
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import BaseLayout from "@/components/layout/BaseLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Clock,
  Info,
  Ticket as TicketIcon,
  Gift,
  Users,
  AlertCircle,
  TrendingUp,
  Timer,
  ChevronRight,
  ThumbsUp,
  ChevronLeft,
  ArrowRight
} from "lucide-react";
import { lotteries } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

const LotteryDetails = () => {
  const { id } = useParams();
  const [lottery, setLottery] = useState<any>(null);
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [numberOptions, setNumberOptions] = useState<number[]>([]);
  const [ticketCount, setTicketCount] = useState(1);
  const { toast } = useToast();
  
  const maxSelectionOptions = lottery?.type === "traditional" ? 6 : 4;

  useEffect(() => {
    const foundLottery = lotteries.find((l) => l.id === Number(id));
    if (foundLottery) {
      setLottery(foundLottery);
      
      // Generate number options based on lottery type
      const max = foundLottery.type === "traditional" ? 36 : 20;
      const options = Array.from({ length: max }, (_, i) => i + 1);
      setNumberOptions(options);
    }
  }, [id]);

  // Calculate time until next draw
  useEffect(() => {
    if (!lottery) return;
    
    const timer = setInterval(() => {
      const now = new Date();
      const nextDraw = new Date(lottery.nextDraw);
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
  }, [lottery]);

  const handleNumberSelection = (number: number) => {
    if (selectedNumbers.includes(number)) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== number));
    } else {
      if (selectedNumbers.length < maxSelectionOptions) {
        setSelectedNumbers([...selectedNumbers, number]);
      } else {
        toast({
          title: "Максимальное количество чисел",
          description: `Вы можете выбрать максимум ${maxSelectionOptions} чисел`,
          variant: "destructive",
        });
      }
    }
  };

  const handleQuickPick = () => {
    const max = lottery?.type === "traditional" ? 36 : 20;
    const picks = [];
    while (picks.length < maxSelectionOptions) {
      const randomNumber = Math.floor(Math.random() * max) + 1;
      if (!picks.includes(randomNumber)) {
        picks.push(randomNumber);
      }
    }
    setSelectedNumbers(picks);
  };

  const handleClearSelection = () => {
    setSelectedNumbers([]);
  };

  const handleTicketCountChange = (increment: number) => {
    const newCount = ticketCount + increment;
    if (newCount > 0 && newCount <= 10) {
      setTicketCount(newCount);
    }
  };

  const handleBuyTicket = () => {
    if (selectedNumbers.length !== maxSelectionOptions) {
      toast({
        title: "Недостаточно чисел",
        description: `Выберите ${maxSelectionOptions} чисел для покупки билета`,
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Билет приобретён!",
      description: "Проверьте свой профиль для деталей.",
    });
    
    // Reset selection after purchase
    setSelectedNumbers([]);
  };

  if (!lottery) {
    return (
      <BaseLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <p>Загрузка данных лотереи...</p>
        </div>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout>
      <div className="mb-4">
        <Link to="/lotteries" className="text-primary flex items-center hover:underline">
          <ChevronLeft size={16} />
          <span>Назад к списку лотерей</span>
        </Link>
      </div>

      <section className="mb-8">
        <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-6">
          <div className="grid md:grid-cols-12 gap-8">
            <div className="md:col-span-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-white shadow rounded-xl overflow-hidden h-24 w-24">
                  <img 
                    src={lottery.image} 
                    alt={lottery.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-3xl font-bold">{lottery.name}</h1>
                    <Badge variant={lottery.type === "traditional" ? "default" : "secondary"}>
                      {lottery.type === "traditional" ? "Традиционная" : "Стратегическая"}
                    </Badge>
                  </div>
                  <p className="text-gray-500 mb-2">{lottery.description}</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users size={14} className="mr-1" />
                    <span>{lottery.participantsCount} участников</span>
                    <span className="mx-2">•</span>
                    <ThumbsUp size={14} className="mr-1" />
                    <span>Рейтинг: {lottery.popularityScore}</span>
                  </div>
                </div>
              </div>

              <Alert className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Следующий розыгрыш</AlertTitle>
                <AlertDescription className="flex justify-between">
                  <span>
                    {new Date(lottery.nextDraw).toLocaleString('ru-RU', { 
                      day: 'numeric', 
                      month: 'long', 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                  <span className="font-mono font-bold">
                    {String(countdown.hours).padStart(2, '0')}:
                    {String(countdown.minutes).padStart(2, '0')}:
                    {String(countdown.seconds).padStart(2, '0')}
                  </span>
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-lg flex items-center">
                      <Gift className="h-4 w-4 mr-2 text-primary" />
                      Призовой фонд
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="py-3">
                    <p className="text-2xl font-bold">{typeof lottery.prizePool === 'number' ? `${lottery.prizePool} ₽` : lottery.prizePool}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-lg flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2 text-primary" />
                      Текущий джекпот
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="py-3">
                    <p className="text-2xl font-bold">{lottery.jackpot} {typeof lottery.jackpot === 'number' ? '₽' : ''}</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="md:col-span-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Информация о лотерее</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Цена билета</p>
                      <p className="font-medium">
                        {lottery.ticketPrice > 0 ? `${lottery.ticketPrice} ₽` : lottery.bonusCost ? `${lottery.bonusCost} бонусов` : "Бесплатно"}
                      </p>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground">Частота розыгрышей</p>
                      <p className="font-medium">{lottery.drawFrequency}</p>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground">Распределение призов</p>
                      <p className="font-medium">{lottery.prizeDistribution}</p>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground">Осталось билетов</p>
                      {lottery.remainingTickets !== "Не ограничено" ? (
                        <>
                          <div className="flex justify-between text-xs mt-1 mb-1">
                            <span>0</span>
                            <span>{lottery.totalTickets}</span>
                          </div>
                          <Progress
                            value={(lottery.remainingTickets / lottery.totalTickets) * 100}
                            className="h-1"
                          />
                          <p className="text-xs text-right mt-1">{lottery.remainingTickets} из {lottery.totalTickets}</p>
                        </>
                      ) : (
                        <p className="font-medium">{lottery.remainingTickets}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section>
        <Tabs defaultValue="buy" className="w-full">
          <TabsList className="mb-6 grid grid-cols-3 sm:grid-cols-3">
            <TabsTrigger value="buy" className="flex items-center">
              <TicketIcon className="mr-2 h-4 w-4" /> Купить билет
            </TabsTrigger>
            <TabsTrigger value="rules" className="flex items-center">
              <Info className="mr-2 h-4 w-4" /> Правила
            </TabsTrigger>
            <TabsTrigger value="minigames" className="flex items-center">
              <Timer className="mr-2 h-4 w-4" /> Мини-игры
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="buy" className="mt-0">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Выберите {maxSelectionOptions} чисел</h3>
              <div className="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-12 gap-2 mb-4">
                {numberOptions.map((number) => (
                  <button
                    key={number}
                    className={`
                      aspect-square text-lg font-semibold rounded-lg flex items-center justify-center
                      transition-all
                      ${selectedNumbers.includes(number)
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                      }
                    `}
                    onClick={() => handleNumberSelection(number)}
                  >
                    {number}
                  </button>
                ))}
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                <Button variant="outline" onClick={handleQuickPick}>
                  Случайные числа
                </Button>
                <Button variant="outline" onClick={handleClearSelection}>
                  Очистить
                </Button>
              </div>
              
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Ваши выбранные числа</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedNumbers.length > 0 ? (
                    <div className="flex gap-2">
                      {selectedNumbers.map((number) => (
                        <div
                          key={number}
                          className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg"
                        >
                          {number}
                        </div>
                      ))}
                      {Array(maxSelectionOptions - selectedNumbers.length)
                        .fill(null)
                        .map((_, index) => (
                          <div
                            key={`empty-${index}`}
                            className="w-10 h-10 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center"
                          >
                            ?
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Выберите {maxSelectionOptions} чисел для покупки билета</p>
                  )}
                </CardContent>
              </Card>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold mb-4">Количество билетов</h3>
                <div className="flex items-center justify-center space-x-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleTicketCountChange(-1)}
                    disabled={ticketCount <= 1}
                  >
                    -
                  </Button>
                  <span className="text-xl font-semibold w-10 text-center">{ticketCount}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleTicketCountChange(1)}
                    disabled={ticketCount >= 10}
                  >
                    +
                  </Button>
                </div>
                
                <div className="mt-4 p-4 bg-white rounded-md">
                  <div className="flex justify-between mb-2">
                    <span>Цена за билет:</span>
                    <span className="font-medium">{lottery.ticketPrice > 0 ? `${lottery.ticketPrice} ₽` : lottery.bonusCost ? `${lottery.bonusCost} бонусов` : "Бесплатно"}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Количество билетов:</span>
                    <span className="font-medium">× {ticketCount}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-semibold">
                    <span>Итого к оплате:</span>
                    <span className="text-primary">
                      {lottery.ticketPrice > 0 
                        ? `${lottery.ticketPrice * ticketCount} ₽` 
                        : lottery.bonusCost 
                          ? `${lottery.bonusCost * ticketCount} бонусов` 
                          : "Бесплатно"}
                    </span>
                  </div>
                </div>
              </div>
              
              <Button className="w-full" size="lg" onClick={handleBuyTicket}>
                Купить билет{ticketCount > 1 ? 'ы' : ''}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="rules" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Правила лотереи</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>{lottery.rules}</p>
                
                <div className="space-y-2">
                  <h3 className="font-semibold">Как работает розыгрыш</h3>
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    <li>Приобретите один или несколько билетов</li>
                    <li>Выберите {maxSelectionOptions} чисел для каждого билета или воспользуйтесь автовыбором</li>
                    <li>Дождитесь розыгрыша, который проводится {lottery.drawFrequency.toLowerCase()}</li>
                    <li>Результаты будут доступны в вашем личном кабинете</li>
                    <li>Выигрыш зачисляется автоматически на счёт</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold">Выигрышные комбинации</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="pb-2 text-left">Совпадения</th>
                          <th className="pb-2 text-right">Выигрыш</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lottery.type === "traditional" ? (
                          <>
                            <tr className="border-b">
                              <td className="py-2">6 из 6</td>
                              <td className="py-2 text-right font-medium">{lottery.jackpot} ₽</td>
                            </tr>
                            <tr className="border-b">
                              <td className="py-2">5 из 6</td>
                              <td className="py-2 text-right font-medium">{Math.round(lottery.jackpot * 0.1)} ₽</td>
                            </tr>
                            <tr className="border-b">
                              <td className="py-2">4 из 6</td>
                              <td className="py-2 text-right font-medium">{Math.round(lottery.jackpot * 0.05)} ₽</td>
                            </tr>
                            <tr>
                              <td className="py-2">3 из 6</td>
                              <td className="py-2 text-right font-medium">{Math.round(lottery.ticketPrice * 5)} ₽</td>
                            </tr>
                          </>
                        ) : (
                          <>
                            <tr className="border-b">
                              <td className="py-2">4 из 4</td>
                              <td className="py-2 text-right font-medium">{lottery.jackpot}</td>
                            </tr>
                            <tr className="border-b">
                              <td className="py-2">3 из 4</td>
                              <td className="py-2 text-right font-medium">500 бонусов</td>
                            </tr>
                            <tr>
                              <td className="py-2">2 из 4</td>
                              <td className="py-2 text-right font-medium">100 бонусов</td>
                            </tr>
                          </>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="minigames" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="overflow-hidden">
                <div className="aspect-video bg-muted relative">
                  <img 
                    src="/placeholder.svg" 
                    alt="Счастливое Колесо"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="pt-4">
                  <h3 className="font-semibold mb-2">Счастливое Колесо</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Крутите колесо и выигрывайте бонусы во время ожидания розыгрыша
                  </p>
                  <Button className="w-full" asChild>
                    <Link to="/mini-game/1">
                      Играть
                      <ChevronRight size={16} className="ml-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden">
                <div className="aspect-video bg-muted relative">
                  <img 
                    src="/placeholder.svg" 
                    alt="Сокровища Пирамиды"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="pt-4">
                  <h3 className="font-semibold mb-2">Сокровища Пирамиды</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Исследуйте пирамиду в поисках скрытых сокровищ и бонусов
                  </p>
                  <Button className="w-full" asChild>
                    <Link to="/mini-game/2">
                      Играть
                      <ChevronRight size={16} className="ml-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden">
                <div className="aspect-video bg-muted relative">
                  <img 
                    src="/placeholder.svg" 
                    alt="Космические Гонки"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="pt-4">
                  <h3 className="font-semibold mb-2">Космические Гонки</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Управляйте космическим кораблем и собирайте бонусы в космосе
                  </p>
                  <Button className="w-full" asChild>
                    <Link to="/mini-game/3">
                      Играть
                      <ChevronRight size={16} className="ml-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <div className="text-center mt-6">
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
    </BaseLayout>
  );
};

export default LotteryDetails;
