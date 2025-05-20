import { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import BaseLayout from "@/components/layout/BaseLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Ticket, Gift, Crown, Trophy, Clock, ArrowRight, User } from "lucide-react";
import { useUser } from "@/UserContext";
import { useBattlePass } from "@/BattlePassContext";
import { useMiniGames } from "@/MiniGamesContext";
import { useLotteries, GroupedLottery } from "@/LotteriesContext.tsx";
import { useTasks } from "@/TasksContext.tsx";

const Index = () => {
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 });
  // Используем группировку розыгрышей лотерей
  const { groupedLotteries, loading, error } = useLotteries();
  const { user } = useUser();
  const { battlePassLevels } = useBattlePass();
  const { dailyTasks } = useTasks();
  const { miniGames } = useMiniGames();
  const [nextLottery, setNextLottery] = useState<GroupedLottery | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  // Получаем активную вкладку из URL-параметра или используем "lotteries" по умолчанию
  const activeTab = searchParams.get("tab") || "lotteries";

  // Функция для обновления активной вкладки
  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  // Calculate time until next draw - теперь используем ближ��йший розыгрыш из сгруппированных лотерей
  useEffect(() => {
    if (groupedLotteries && groupedLotteries.length > 0) {
      // Сортируем лотереи по дате ближайшего розыгрыша
      const sortedLotteries = [...groupedLotteries].sort((a, b) =>
        new Date(a.nextDraw.end_date).getTime() - new Date(b.nextDraw.end_date).getTime()
      );
      setNextLottery(sortedLotteries[0]);

      const timer = setInterval(() => {
        const now = new Date();
        const nextDrawDate = sortedLotteries[0]?.nextDraw?.end_date;
        if (!nextDrawDate) {
          clearInterval(timer);
          setCountdown({ hours: 0, minutes: 0, seconds: 0 });
          return;
        }
        const nextDraw = new Date(nextDrawDate);
        const diff = nextDraw.getTime() - now.getTime();

        if (diff <= 0) {
          clearInterval(timer);
          setCountdown({ hours: 0, minutes: 0, seconds: 0 });
        } else {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          setCountdown({ hours, minutes, seconds });
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [groupedLotteries]);

  // Calculate battle pass progress с исправленной формулой
  const currentBattlePassLevel = user && battlePassLevels.find(level => level.level === user.battlePassLevel);
  const nextBattlePassLevel = user && battlePassLevels.find(level => level.level === user.battlePassLevel + 1);

  const battlePassProgress = useMemo(() => {
    // Если пользователя нет или не найден уровень battle pass
    if (!user || !currentBattlePassLevel) {
      return 0;
    }

    // Если следующего уровня нет (максимальный уровень достигнут)
    if (!nextBattlePassLevel) {
      return 100;
    }

    const currentLevelXP = currentBattlePassLevel.xpRequired || 0;
    const nextLevelXP = nextBattlePassLevel.xpRequired || 0;
    const userXP = user.battlePassXp || 0;

    // Предотвращаем деление на ноль
    if (nextLevelXP <= currentLevelXP) {
      return 0;
    }

    // Вычисляем процент прогресса между текущим и следующим уровнем
    const progressPercent = ((userXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

    // Ограничиваем значение между 0 и 100
    return Math.max(0, Math.min(100, progressPercent));
  }, [user, currentBattlePassLevel, nextBattlePassLevel]);

  return (
    <BaseLayout>
      {/* Hero Section */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-primary/80 to-accent/80 rounded-lg text-white p-6 md:p-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Добро пожаловать в мир<br />
                <span className="text-white">увлекательных лотерей!</span>
              </h1>
              <p className="text-gray-100 mb-6">
                Попытайте удачу в традиционных лотереях, выполняйте задания, получайте бонусы и участвуйте в стратегических играх!
              </p>
              <div className="space-x-4">
                <Button variant="default" size="lg" className="bg-white text-primary hover:bg-gray-100" asChild>
                  <Link to="/lotteries">
                    Выбрать лотерею
                    <Ticket className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="bg-primary text-white hover:bg-primary/90" asChild>
                  <Link to="/battle-pass">
                    Battle Pass
                    <Crown className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="glass-card p-6 rounded-xl w-full max-w-md">
                <h3 className="font-bold text-xl mb-2">Ближайший розыгрыш</h3>
                {nextLottery ? (
                  <>
                    <div className="mb-4">
                      <p className="text-sm font-semibold">{nextLottery.name}</p>
                      <p className="text-sm opacity-90">{nextLottery.nextDraw.description_md}</p>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium flex items-center">
                        <Clock size={16} className="mr-1" /> До розыгрыша:
                      </span>
                      <span className="countdown">
                        {countdown.hours.toString().padStart(2, '0')}:{countdown.minutes.toString().padStart(2, '0')}:{countdown.seconds.toString().padStart(2, '0')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm mb-4">
                      <span>Призовой фонд:</span>
                      <span className="font-bold">{nextLottery.nextDraw.price_currency} ₽</span>
                    </div>
                    <div className="text-center">
                      <Button className="w-full game-button" asChild>
                        <Link to={`/lottery/${nextLottery.nextDraw.id}`}>
                          Участвовать
                        </Link>
                      </Button>
                    </div>
                  </>
                ) : loading ? (
                  <p>Загрузка ближайшей лотереи...</p>
                ) : (
                  <p>Нет доступных лотерей.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Battle Pass & Tasks Progress */}
      <section className="mb-12">
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  <Crown className="mr-2 h-5 w-5 text-primary" />
                  Battle Pass
                </CardTitle>
                <Badge variant="outline" className="bg-primary/10 text-primary">
                  Уровень {user?.battlePassLevel || 1}
                </Badge>
              </div>
              <CardDescription>
                Выполняйте задания, повышайте уровень и получайте награды
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Прогресс</span>
                  <span className="text-sm text-muted-foreground">
                    {user?.battlePassXp || 0}/{nextBattlePassLevel?.xpRequired || "MAX"} XP
                  </span>
                </div>
                <Progress value={battlePassProgress} className="h-2" />
                
                <div className="mt-6 flex justify-between space-x-1">
                  {battlePassLevels.slice(0, 5).map((level) => (
                    <div 
                      key={level.level} 
                      className={`battle-pass-level ${user && level.level <= user.battlepass_lvl ? "completed" : user && level.level === user.battlePassLevel + 1 ? "active" : "border-gray-300"}`}
                    >
                      {level.level}
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 text-center">
                  <span className="text-sm text-muted-foreground block mb-2">
                    Следующая награда: <span className="font-medium">{nextBattlePassLevel?.reward || 0}</span>
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/battle-pass">
                  Просмотреть Battle Pass
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Gift className="mr-2 h-5 w-5 text-primary" />
                Ежедневные задания
              </CardTitle>
              <CardDescription>
                Выполняйте задания для получения бонусов и XP
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dailyTasks.map((task) => (
                  <div key={task.id} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{task.title}</span>
                      <Badge variant={task.completed ? "default" : "outline"} className={task.completed ? "bg-green-500" : ""}>
                        {task.completed ? "Выполнено" : `${task.progress}/${task.total}`}
                      </Badge>
                    </div>
                    <Progress value={(task.progress / task.total) * 100} className="h-2" />
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{task.description}</span>
                      <span className="font-medium text-primary">{task.reward}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/tasks">
                  Все задания
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Lotteries & Games Tabs */}
      <section className="mb-12">
        <Tabs defaultValue={activeTab} onValueChange={handleTabChange} className="w-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Игры и лотереи</h2>
            <TabsList>
              <TabsTrigger value="lotteries" className="flex items-center">
                <Ticket className="mr-2 h-4 w-4" /> Лотереи
              </TabsTrigger>
              <TabsTrigger value="minigames" className="flex items-center">
                <Trophy className="mr-2 h-4 w-4" /> Мини-игры
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="lotteries" className="mt-0">
            {loading && <p>Загрузка лотерей...</p>}
            {error && <p>Ошибка загрузки лотерей: {error}</p>}
            {!loading && !error && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupedLotteries.map((lottery) => (
                    <Card key={lottery.name} className="lottery-card overflow-hidden">
                      <div className="aspect-video bg-muted relative">
                        <img
                          src={'/placeholder.svg'}
                          alt={lottery.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                          <Badge className="mb-2" variant={lottery.nextDraw.lottery_type_id === 1 ? "default" : "secondary"}>
                            {lottery.nextDraw.lottery_type_id === 1 ? "Традиционная" : "Стратегическая"}
                          </Badge>
                          <h3 className="text-lg font-semibold text-white">{lottery.name}</h3>
                        </div>
                      </div>
                      <CardContent className="pt-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Ближайший розыгрыш:</span>
                            <span className="font-medium">
                              {new Date(lottery.nextDraw.end_date).toLocaleDateString('ru-RU', {day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'})}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Призовой фонд:</span>
                            <span className="font-medium text-primary">
                              {lottery.nextDraw.price_currency} ₽
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Цена билета:</span>
                            <span className="font-medium">
                              {lottery.nextDraw.price_currency > 0 ? `${lottery.nextDraw.price_currency} ₽` : lottery.nextDraw.price_credits ? `${lottery.nextDraw.price_credits} бонусов` : "Бесплатно"}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Всего розыгрышей:</span>
                            <span className="font-medium">
                              {lottery.totalDraws}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full bg-primary text-white hover:bg-primary/90" asChild>
                          <Link to={`/lottery/${lottery.nextDraw.id}`}>
                            Подробнее
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <Button variant="outline" asChild>
                    <Link to="/lotteries">
                      Все лотереи
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="minigames" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {miniGames.map((game) => (
                <Card key={game.id} className="lottery-card overflow-hidden">
                  <div className="aspect-video bg-muted relative">
                    <img 
                      src={game.image} 
                      alt={game.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <h3 className="text-lg font-semibold text-white">{game.name}</h3>
                    </div>
                  </div>
                  <CardContent className="pt-4">
                    <p className="text-sm text-muted-foreground mb-4">{game.description}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Награда:</span>
                        <span className="font-medium text-primary">{game.bonusReward}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Среднее время:</span>
                        <span className="font-medium">{game.averagePlayTime}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Рейтинг:</span>
                        <span className="font-medium flex items-center">
                          {game.popularity}
                          <span className="text-yellow-500 ml-1">★</span>
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-primary text-white hover:bg-primary/90" asChild>
                      <Link to={`/mini-game/${game.id}`}>
                        Играть
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Button variant="outline" asChild>
                <Link to="/mini-games">
                  Все мини-игры
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </section>
      
      {/* Call-to-Action Section */}
      <section>
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Присоединяйтесь к нам!</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Откройте для себя мир азарта, выигрышей и стратегий! Участвуйте в лотереях, выполняйте задания и повышайте свой VIP-статус для получения эксклюзивных привилегий.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="game-button" asChild>
              <Link to="/lotteries">
                <Ticket className="mr-2 h-5 w-5" />
                <span>Начать играть</span>
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="game-button" asChild>
              <Link to="/profile">
                <User className="mr-2 h-5 w-5" />
                <span>Мой профиль</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </BaseLayout>
  );
};

export default Index;
