import { useState, useEffect } from "react";
import BaseLayout from "@/components/layout/BaseLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Crown, Gift, Clock, CheckCircle, LayoutList, AlertCircle, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/UserContext";
import { useBattlePass, BattlePassLevel } from "@/BattlePassContext";
import { useTasks } from "@/TasksContext";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

const BattlePass = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("rewards");
  const { user } = useUser();
  const { battlePassLevels, startDate, endDate, loading, error, refreshBattlePass } = useBattlePass();
  const { dailyTasks, weeklyTasks } = useTasks();

  // Initialize values
  const userBattlePassLevel = user?.battlepass_lvl || 0;

  // Форматируем даты
  const formattedStartDate = startDate ? format(new Date(startDate), 'd MMMM yyyy', { locale: ru }) : '';
  const formattedEndDate = endDate ? format(new Date(endDate), 'd MMMM yyyy', { locale: ru }) : '';

  // Сортируем уровни по возрастанию
  const sortedLevels = [...battlePassLevels].sort((a, b) => a.level - b.level);

  // Для расчета прогресса нам нужно определить текущий и следующий уровни
  const currentLevel = sortedLevels.find(level => level.level === userBattlePassLevel);
  const nextLevel = sortedLevels.find(level => level.level === userBattlePassLevel + 1);

  // Расчет прогресса (в новой модели нет xpRequired, поэтому используем фиксированное значение)
  // Здесь мы установим прогресс в 35% для демонстрации
  const progress = 35;

  // Функция получения наград
  const handleClaimReward = () => {
    toast({
      title: "Награда получена!",
      description: "Проверьте свой профиль для деталей"
    });
  };

  const handleRefresh = async () => {
    try {
      await refreshBattlePass();
      toast({
        title: "Данные обновлены",
        description: "Информация о Battle Pass успешно обновлена"
      });
    } catch (err) {
      toast({
        title: "Ошибка обновления",
        description: "Не удалось обновить данные. Попробуйте позже.",
        variant: "destructive"
      });
    }
  };

  return (
    <BaseLayout>
      <section className="mb-12">
        <div className="bg-gradient-to-r from-primary/80 to-accent/80 rounded-lg text-white p-6 md:p-10">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Crown className="h-8 w-8" />
                <h1 className="text-3xl font-bold">Battle Pass</h1>
                {!loading && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-white hover:text-white/80 hover:bg-white/10"
                    onClick={handleRefresh}
                  >
                    <RefreshCw className="h-5 w-5" />
                  </Button>
                )}
              </div>
              <p className="mb-6">
                Выполняйте задания, получайте опыт, повышайте уровень и получайте эксклюзивные награды!
              </p>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span>Текущий уровень:</span>
                  <span className="font-bold">{userBattlePassLevel}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Прогресс до следующего уровня:</span>
                </div>
                <Progress value={progress} className="h-2 bg-white/20 mb-2" />
                {nextLevel && (
                  <div className="text-center text-sm">
                    Следующая награда: {nextLevel.name}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-white/10 backdrop-blur-sm text-white border-0">
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-2">
                    <Gift className="h-5 w-5" />
                    <CardTitle>Выполнено заданий</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">{user?.completedQuests || 0}</div>
                  <CardDescription className="text-white/70">из {dailyTasks.length + weeklyTasks.length}</CardDescription>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-sm text-white border-0">
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5" />
                    <CardTitle>Завершённые уровни</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">{userBattlePassLevel}</div>
                  <CardDescription className="text-white/70">из {battlePassLevels.length}</CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section>
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 grid grid-cols-2">
            <TabsTrigger value="rewards" className="flex items-center">
              <Gift className="mr-2 h-4 w-4" /> Награды
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center">
              <LayoutList className="mr-2 h-4 w-4" /> Задания
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rewards" className="mt-0">
            {loading ? (
              <Card className="p-8 mb-8 text-center">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
                    <p>Загрузка данных Battle Pass...</p>
                  </div>
                </CardContent>
              </Card>
            ) : error ? (
              <Card className="p-8 mb-8">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center space-y-4 text-destructive">
                    <AlertCircle className="h-8 w-8" />
                    <p>{error}</p>
                    <Button onClick={handleRefresh}>Повторить загрузку</Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="bg-muted/30 rounded-lg p-8 mb-8 overflow-x-auto">
                <div className="flex min-w-[800px] relative pb-4">
                  {/* Прогресс линии (рисуются ПОД уровнями) */}
                  <div className="absolute top-6 left-12 right-12 h-1 z-0">
                    {/* Рисуем линии для всех уровней */}
                    {sortedLevels.map((level, index, array) => {
                      // Для каждого уровня, кроме последнего, рисуем линию от него к следующему
                      if (index === array.length - 1) return null; // Не рисуем линию после последнего уровня

                      const nextLevel = array[index + 1];
                      const isCompleted = level.level < userBattlePassLevel;
                      const isCurrentLevelProgress = level.level === userBattlePassLevel;

                      // Рассчитываем позицию и ширину линии между текущим и следующим уровнем
                      const leftPos = `${(index) * (100 / (array.length - 1))}%`;
                      const width = `${100 / (array.length - 1)}%`;

                      return (
                        <div
                          key={`line-${level.level}-to-${nextLevel.level}`}
                          className="absolute h-full"
                          style={{
                            left: leftPos,
                            width: width
                          }}
                        >
                          {/* Базовая линия (серая) */}
                          <div className="absolute top-0 left-0 right-0 h-full bg-gray-300"></div>

                          {/* Прогресс линия */}
                          {(isCompleted || isCurrentLevelProgress) && (
                            <div
                              className="absolute top-0 left-0 h-full bg-primary transition-all duration-300"
                              style={{
                                width: isCompleted ? '100%' : (isCurrentLevelProgress ? `${progress}%` : '0%')
                              }}
                            ></div>
                          )}
                        </div>
                      );
                    })}

                    {/* Добавляем линию для последнего уровня (если пользователь достиг максимума) */}
                    {sortedLevels.length > 0 && userBattlePassLevel >= sortedLevels.length && (
                      <div
                        className="absolute h-full"
                        style={{
                          left: `${(sortedLevels.length - 1) * (100 / (sortedLevels.length - 1))}%`,
                          width: `${100 / (sortedLevels.length - 1)}%`
                        }}
                      >
                        <div className="absolute top-0 left-0 right-0 h-full bg-primary"></div>
                      </div>
                    )}
                  </div>

                  {/* Уровни (рисуются НАД линиями) */}
                  {sortedLevels.map((level, index) => {
                    const isCompleted = level.level <= userBattlePassLevel;
                    const isCurrent = level.level === userBattlePassLevel + 1;

                    return (
                      <div key={level.id} className="flex-1 px-2 z-10">
                        <div className="relative">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto border-2 shadow-md relative z-10 ${
                              isCompleted 
                                ? 'bg-primary border-primary' 
                                : isCurrent
                                  ? 'border-primary text-primary bg-white'
                                  : 'border-gray-300 text-gray-400 bg-white'
                            }`}
                          >
                            <span className={`${
                              isCompleted 
                                ? 'text-white font-bold' 
                                : ''
                            }`}>
                              {level.level}
                            </span>
                          </div>
                        </div>

                        <div className={`mt-4 p-3 rounded-lg ${
                          isCompleted 
                            ? 'bg-primary/10' 
                            : isCurrent
                              ? 'bg-gray-100 border border-primary/30'
                              : 'bg-gray-100'
                        }`}>
                          <div className="text-center mb-2">
                            <Badge variant={isCompleted ? "default" : "outline"}>
                              Уровень {level.level}
                            </Badge>
                            {level.for_vip && (
                              <Badge variant="secondary" className="ml-2">
                                VIP
                              </Badge>
                            )}
                          </div>
                          <div className="text-center mb-2">
                            <span className="text-sm font-medium">{level.name}</span>
                          </div>
                          {level.desscription && (
                            <div className="text-center text-xs text-muted-foreground mb-3">
                              {level.desscription}
                            </div>
                          )}

                          {isCompleted ? (
                            <Button variant="default" size="sm" className="w-full" disabled>
                              Получено
                            </Button>
                          ) : isCurrent ? (
                            <div className="space-y-2">
                              <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary"
                                  style={{ width: `${progress}%` }}
                                ></div>
                              </div>
                              <Button
                                variant="default"
                                size="sm"
                                className="w-full"
                                onClick={handleClaimReward}
                                disabled={progress < 100}
                              >
                                {progress >= 100 ? 'Получить' : `${Math.floor(progress)}%`}
                              </Button>
                            </div>
                          ) : (
                            <Button variant="outline" size="sm" className="w-full" disabled>
                              Заблокировано
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Ограниченное время
                </CardTitle>
                <CardDescription>
                  Battle Pass активен {startDate && endDate
                    ? `с ${formattedStartDate} до ${formattedEndDate}`
                    : 'в течение ограниченного времени'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  По окончании сезона несобранные награды будут автоматически добавлены в ваш профиль, если вы достигли соответствующего уровня. Прогресс будет сброшен, и начнётся новый сезон Battle Pass.
                </p>
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2">Совет</h3>
                  <p className="text-sm text-muted-foreground">
                    Выполняйте ежедневные и еженедельные задания, чтобы быстрее повышать свой уровень Battle Pass и получать больше наград. Участие в лотереях также даёт дополнительный опыт.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks" className="mt-0">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Ежедневные задания</CardTitle>
                <CardDescription>Сбрасываются каждый день в 00:00</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dailyTasks.map((task) => (
                    <div key={task.id} className="bg-muted/30 p-4 rounded-lg">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{task.title}</h3>
                          <p className="text-sm text-muted-foreground">{task.description}</p>
                        </div>
                        <div className="mt-2 sm:mt-0 flex items-center">
                          <Badge variant={task.completed ? "default" : "outline"} className={task.completed ? "bg-green-500" : ""}>
                            {task.completed ? "Выполнено" : `${task.progress}/${task.total}`}
                          </Badge>
                        </div>
                      </div>

                      <Progress value={(task.progress / task.total) * 100} className="h-2 mb-3" />

                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Gift className="h-4 w-4 text-primary mr-1" />
                          <span className="text-sm font-medium">{task.reward}</span>
                        </div>

                        <Button
                          size="sm"
                          variant={task.completed ? "default" : "outline"}
                          disabled={!task.completed}
                          onClick={handleClaimReward}
                        >
                          {task.completed ? "Получить награду" : "Выполните задание"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Еженедельные задания</CardTitle>
                <CardDescription>Сбрасываются каждый понедельник в 00:00</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {weeklyTasks.map((task) => (
                    <div key={task.id} className="bg-muted/30 p-4 rounded-lg">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{task.title}</h3>
                          <p className="text-sm text-muted-foreground">{task.description}</p>
                        </div>
                        <div className="mt-2 sm:mt-0 flex items-center">
                          <Badge variant={task.completed ? "default" : "outline"} className={task.completed ? "bg-green-500" : ""}>
                            {task.completed ? "Выполнено" : `${task.progress}/${task.total}`}
                          </Badge>
                        </div>
                      </div>

                      <Progress value={(task.progress / task.total) * 100} className="h-2 mb-3" />

                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Gift className="h-4 w-4 text-primary mr-1" />
                          <span className="text-sm font-medium">{task.reward}</span>
                        </div>

                        <Button
                          size="sm"
                          variant={task.completed ? "default" : "outline"}
                          disabled={!task.completed}
                          onClick={handleClaimReward}
                        >
                          {task.completed ? "Получить награду" : "Выполните задание"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </BaseLayout>
  );
};

export default BattlePass;
