
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import BaseLayout from "@/components/layout/BaseLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ChevronLeft,
  Calendar,
  Search,
  Trophy,
  Ticket,
  User,
  Clock,
  ArrowRight
} from "lucide-react";
import {Lottery, useLotteries} from "@/LotteriesContext.tsx";

const LotteryResults = () => {
  const { id } = useParams();
  const { lotteries } = useLotteries()
  const [lottery, setLottery] = useState<Lottery>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Тестовые данные для результатов лотереи
  const [resultsHistory] = useState([
    {
      id: 1,
      date: "2025-05-15T19:00:00",
      winningNumbers: [7, 12, 24, 28, 31, 35],
      jackpotWinner: false,
      jackpotAmount: 1000000,
      totalWinners: 128,
      prizePool: 250000
    },
    {
      id: 2,
      date: "2025-05-12T19:00:00",
      winningNumbers: [3, 11, 19, 25, 37, 42],
      jackpotWinner: true,
      jackpotAmount: 850000,
      jackpotWinnerName: "Анонимный игрок",
      totalWinners: 156,
      prizePool: 325000
    },
    {
      id: 3,
      date: "2025-05-09T19:00:00",
      winningNumbers: [5, 14, 21, 33, 39, 45],
      jackpotWinner: false,
      jackpotAmount: 750000,
      totalWinners: 98,
      prizePool: 187000
    },
    {
      id: 4,
      date: "2025-05-06T19:00:00",
      winningNumbers: [2, 10, 17, 29, 36, 41],
      jackpotWinner: false,
      jackpotAmount: 700000,
      totalWinners: 112,
      prizePool: 210000
    },
    {
      id: 5,
      date: "2025-05-03T19:00:00",
      winningNumbers: [8, 15, 23, 27, 34, 47],
      jackpotWinner: true,
      jackpotAmount: 650000,
      jackpotWinnerName: "Иванов И.",
      totalWinners: 135,
      prizePool: 275000
    }
  ]);
  
  // Тестовые данные для статистики лотереи
  const [stats] = useState({
    totalDraws: 87,
    totalPrizePool: 22500000,
    totalWinners: 12450,
    averageJackpot: 835000,
    jackpotFrequency: "1 раз в 17 розыгрышей",
    mostCommonNumbers: [7, 21, 34, 12, 28],
    leastCommonNumbers: [49, 1, 13, 44, 50],
    luckyDays: ["Вторник", "Пятница"]
  });

  useEffect(() => {
    const foundLottery = lotteries.find((l) => l.id === Number(id));
    if (foundLottery) {
      setLottery(foundLottery);
    }
  }, [id]);

  const latestResult = resultsHistory[0];
  
  const filteredResults = resultsHistory.filter(result => 
    result.winningNumbers.some(num => num.toString().includes(searchTerm))
  );

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
        <Link to={`/lottery/${id}`} className="text-primary flex items-center hover:underline">
          <ChevronLeft size={16} />
          <span>Назад к лотерее</span>
        </Link>
      </div>
      
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-white shadow rounded-xl overflow-hidden h-16 w-16">
            <img 
              src={lottery.image || "/placeholder.svg"} 
              alt={lottery.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{lottery.name} - Результаты</h1>
            <p className="text-gray-500">
              История розыгрышей и статистика лотереи
            </p>
          </div>
        </div>
      </div>
      
      <section className="mb-8">
        <Card className="bg-gradient-to-r from-primary/5 to-accent/5">
          <CardHeader>
            <CardTitle>Последний розыгрыш</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center mb-4">
                  <Calendar className="h-5 w-5 mr-2 text-primary" />
                  <span className="font-medium">
                    {new Date(latestResult.date).toLocaleDateString('ru-RU', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric',
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Выигрышные числа</h3>
                  <div className="flex flex-wrap gap-2">
                    {latestResult.winningNumbers.map((number, index) => (
                      <div
                        key={index}
                        className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-lg font-bold"
                      >
                        {number}
                      </div>
                    ))}
                  </div>
                </div>
                
                {latestResult.jackpotWinner ? (
                  <div className="p-4 bg-green-50 border border-green-100 rounded-lg mb-4">
                    <div className="flex items-start">
                      <Trophy className="h-6 w-6 text-green-600 mr-3 mt-1" />
                      <div>
                        <h3 className="font-semibold text-green-800">Джекпот разыгран!</h3>
                        <p className="text-green-700">
                          Победитель: {latestResult.jackpotWinnerName}<br/>
                          Сумма: {latestResult.jackpotAmount.toLocaleString()} ₽
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg mb-4">
                    <div className="flex items-start">
                      <Trophy className="h-6 w-6 text-blue-600 mr-3 mt-1" />
                      <div>
                        <h3 className="font-semibold text-blue-800">Джекпот не разыгран</h3>
                        <p className="text-blue-700">
                          Сумма переходит в следующий розыгрыш и составляет {latestResult.jackpotAmount.toLocaleString()} ₽
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Статистика розыгрыша</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-sm text-muted-foreground">Призовой фонд</div>
                        <div className="text-xl font-semibold">{latestResult.prizePool.toLocaleString()} ₽</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-sm text-muted-foreground">Количество победителей</div>
                        <div className="text-xl font-semibold">{latestResult.totalWinners}</div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Распределение призов</h3>
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="py-2 px-3 text-left">Совпадения</th>
                        <th className="py-2 px-3 text-center">Победителей</th>
                        <th className="py-2 px-3 text-right">Выигрыш</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2 px-3">6 из 6</td>
                        <td className="py-2 px-3 text-center">
                          {latestResult.jackpotWinner ? 1 : 0}
                        </td>
                        <td className="py-2 px-3 text-right font-medium">
                          {latestResult.jackpotAmount.toLocaleString()} ₽
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-3">5 из 6</td>
                        <td className="py-2 px-3 text-center">{Math.floor(Math.random() * 10)}</td>
                        <td className="py-2 px-3 text-right font-medium">
                          {Math.floor(latestResult.jackpotAmount * 0.05).toLocaleString()} ₽
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-3">4 из 6</td>
                        <td className="py-2 px-3 text-center">{Math.floor(Math.random() * 30) + 10}</td>
                        <td className="py-2 px-3 text-right font-medium">
                          {Math.floor(latestResult.jackpotAmount * 0.01).toLocaleString()} ₽
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3">3 из 6</td>
                        <td className="py-2 px-3 text-center">{Math.floor(Math.random() * 100) + 50}</td>
                        <td className="py-2 px-3 text-right font-medium">
                          500 ₽
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-center">
              <Button asChild>
                <Link to={`/lottery/${id}`}>
                  <Ticket className="mr-2 h-4 w-4" />
                  Участвовать в следующем розыгрыше
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
      
      <Tabs defaultValue="history" className="w-full">
        <TabsList className="mb-6 grid grid-cols-2 sm:grid-cols-2">
          <TabsTrigger value="history" className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" /> История розыгрышей
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center">
            <Trophy className="mr-2 h-4 w-4" /> Статистика
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="history" className="mt-0">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>История розыгрышей</CardTitle>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Поиск по числам"
                    className="pl-8 w-[200px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {filteredResults.map((result, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold mb-1">Розыгрыш #{result.id}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(result.date).toLocaleDateString('ru-RU', { 
                            day: 'numeric', 
                            month: 'long', 
                            year: 'numeric',
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                      {result.jackpotWinner && (
                        <Badge className="bg-green-500">Джекпот разыгран</Badge>
                      )}
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-sm text-muted-foreground mb-2">Выигрышные числа</h4>
                      <div className="flex flex-wrap gap-2">
                        {result.winningNumbers.map((number, numIndex) => (
                          <div
                            key={numIndex}
                            className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold"
                          >
                            {number}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-xs text-muted-foreground">Призовой фонд</div>
                        <div className="font-medium">{result.prizePool.toLocaleString()} ₽</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Победителей</div>
                        <div className="font-medium">{result.totalWinners}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Джекпот</div>
                        <div className="font-medium">{result.jackpotAmount.toLocaleString()} ₽</div>
                      </div>
                    </div>
                    
                    {result.jackpotWinner && (
                      <div className="mt-3 p-2 bg-green-50 border border-green-100 rounded text-sm text-green-800">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-green-600" />
                          <span>Победитель джекпота: {result.jackpotWinnerName}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                {filteredResults.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      {searchTerm ? "Нет результатов для заданного поиска" : "Нет данных о розыгрышах"}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="stats" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Общая статистика</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-primary">{stats.totalDraws}</div>
                    <div className="text-sm text-muted-foreground">Всего розыгрышей</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-primary">{stats.totalWinners.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Всего победителей</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-primary">{(stats.totalPrizePool / 1000000).toFixed(1)} млн</div>
                    <div className="text-sm text-muted-foreground">Общий призовой фонд</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-primary">{(stats.averageJackpot / 1000000).toFixed(1)} млн</div>
                    <div className="text-sm text-muted-foreground">Средний джекпот</div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="font-medium mb-3">Дополнительная информация</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Trophy className="h-4 w-4 mr-2 text-yellow-500 mt-0.5" />
                      <div>
                        <span className="font-medium">Частота джекпота:</span>
                        <span className="ml-1">{stats.jackpotFrequency}</span>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Clock className="h-4 w-4 mr-2 text-blue-500 mt-0.5" />
                      <div>
                        <span className="font-medium">Счастливые дни:</span>
                        <span className="ml-1">{stats.luckyDays.join(", ")}</span>
                      </div>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Статистика чисел</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Самые популярные числа</h3>
                  <div className="flex flex-wrap gap-2">
                    {stats.mostCommonNumbers.map((number, index) => (
                      <div
                        key={index}
                        className="relative w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-lg font-bold"
                      >
                        {number}
                        <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-green-500 text-white text-xs flex items-center justify-center font-bold border-2 border-white">
                          {(30 - index * 3)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Самые редкие числа</h3>
                  <div className="flex flex-wrap gap-2">
                    {stats.leastCommonNumbers.map((number, index) => (
                      <div
                        key={index}
                        className="relative w-12 h-12 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-lg font-bold"
                      >
                        {number}
                        <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold border-2 border-white">
                          {(5 + index)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="p-4 border border-primary/20 bg-primary/5 rounded-lg">
                  <h3 className="font-medium mb-2 flex items-center">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Знаете ли вы?
                  </h3>
                  <p className="text-sm">
                    Вероятность выигрыша джекпота в этой лотерее составляет 1 к {Number(lottery.type === "traditional" ? '8,145,060' : '4,845').toLocaleString()}. Это {lottery.type === "traditional" ? "меньше" : "больше"}, чем вероятность быть ударенным молнией (1 к 700,000).
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </BaseLayout>
  );
};

export default LotteryResults;
