
import { useState } from "react";
import { Link } from "react-router-dom";
import BaseLayout from "@/components/layout/BaseLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Ticket,
  User,
  Coins,
  Crown,
  Clock,
  Calendar,
  ChevronRight
} from "lucide-react";
import { user, lotteries } from "@/data/mockData";

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("overview");
  
  // Тестовые данные для билетов пользователя
  const userTickets = [
    {
      id: 1,
      lotteryId: 2,
      lotteryName: "Счастливая Семёрка",
      purchaseDate: "2025-05-17T14:30:00",
      drawDate: "2025-05-19T20:00:00",
      numbers: [4, 12, 23, 28, 31, 36],
      status: "active"
    },
    {
      id: 2,
      lotteryId: 1,
      lotteryName: "ЕвроМиллионы",
      purchaseDate: "2025-05-16T10:15:00",
      drawDate: "2025-05-18T21:00:00",
      numbers: [7, 14, 22, 35, 41, 48],
      status: "active"
    },
    {
      id: 3,
      lotteryId: 3,
      lotteryName: "Стратегический Бонус",
      purchaseDate: "2025-05-15T16:20:00",
      drawDate: "2025-05-17T19:00:00",
      numbers: [3, 8, 14, 17],
      status: "won",
      prize: "250 бонусов"
    }
  ];
  
  // Тестовые данные для истории транзакций
  const transactions = [
    {
      id: 1,
      date: "2025-05-17T14:30:00",
      type: "purchase",
      description: "Покупка билета «Счастливая Семёрка»",
      amount: -150,
      currency: "RUB"
    },
    {
      id: 2,
      date: "2025-05-16T10:15:00",
      type: "purchase",
      description: "Покупка билета «ЕвроМиллионы»",
      amount: -200,
      currency: "RUB"
    },
    {
      id: 3,
      date: "2025-05-15T16:20:00",
      type: "purchase",
      description: "Покупка билета «Стратегический Бонус»",
      amount: -300,
      currency: "BONUS"
    },
    {
      id: 4,
      date: "2025-05-17T19:05:00",
      type: "win",
      description: "Выигрыш в «Стратегический Бонус»",
      amount: 250,
      currency: "BONUS"
    },
    {
      id: 5,
      date: "2025-05-14T12:00:00",
      type: "deposit",
      description: "Пополнение баланса",
      amount: 1000,
      currency: "RUB"
    }
  ];

  return (
    <BaseLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Личный кабинет</h1>
        <p className="text-gray-500">Управляйте вашим аккаунтом, билетами и транзакциями</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <User className="h-4 w-4 mr-2 text-primary" />
              Профиль пользователя
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{user.username}</h3>
                <p className="text-sm text-muted-foreground">{user.email || "user@example.com"}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Баланс:</span>
                <span className="font-medium">{user.balance} ₽</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Бонусы:</span>
                <span className="font-medium">{user.bonusBalance} бонусов</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">VIP-статус:</span>
                <div className="flex items-center">
                  <Badge className="bg-gradient-to-r from-purple-600 to-pink-500">
                    <Crown className="h-3 w-3 mr-1" />
                    Уровень {user.vipLevel}
                  </Badge>
                </div>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">До следующего уровня:</span>
                <div className="mt-1">
                  <Progress value={70} className="h-2" />
                  <p className="text-xs text-right mt-1">70%</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 space-x-2">
              <Button variant="outline" size="sm" className="w-full">
                Редактировать профиль
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Ticket className="h-4 w-4 mr-2 text-primary" />
              Активные билеты
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userTickets.filter(ticket => ticket.status === "active").map((ticket, index) => (
              <div 
                key={index} 
                className={`p-3 rounded-md ${index > 0 ? 'mt-3' : ''} bg-gray-50 hover:bg-gray-100`}
              >
                <div className="flex justify-between mb-1">
                  <span className="font-medium">{ticket.lotteryName}</span>
                  <Badge variant="outline">{new Date(ticket.drawDate).toLocaleDateString('ru-RU')}</Badge>
                </div>
                <div className="flex gap-1 mb-2">
                  {ticket.numbers.map((num, i) => (
                    <div 
                      key={i} 
                      className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium"
                    >
                      {num}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>До розыгрыша: {Math.floor(Math.random() * 24)} ч</span>
                  </div>
                  <Button variant="ghost" size="sm" className="h-6 px-2" asChild>
                    <Link to={`/lottery/${ticket.lotteryId}`}>
                      Подробнее
                      <ChevronRight className="h-3 w-3 ml-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
            <Button className="w-full mt-4" asChild>
              <Link to="/lotteries">
                Купить еще билеты
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-primary" />
              Ближайшие розыгрыши
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lotteries.slice(0, 3).map((lottery, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="bg-white shadow rounded-lg overflow-hidden h-10 w-10 flex-shrink-0">
                    <img 
                      src={lottery.image || "/placeholder.svg"} 
                      alt={lottery.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h3 className="font-medium text-sm truncate">{lottery.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {new Date(lottery.nextDraw).toLocaleString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div>
                    <Button variant="ghost" size="sm" className="h-8 px-2" asChild>
                      <Link to={`/lottery/${lottery.id}`}>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <Button variant="outline" className="w-full mt-4" asChild>
              <Link to="/lotteries">
                Все лотереи
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6 grid grid-cols-3 sm:grid-cols-3">
          <TabsTrigger value="overview">Обзор</TabsTrigger>
          <TabsTrigger value="tickets">Мои билеты</TabsTrigger>
          <TabsTrigger value="transactions">История</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Последние выигрыши</CardTitle>
              </CardHeader>
              <CardContent>
                {userTickets.filter(ticket => ticket.status === "won").length > 0 ? (
                  <div className="space-y-4">
                    {userTickets.filter(ticket => ticket.status === "won").map((ticket, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between mb-2">
                          <span className="font-semibold">{ticket.lotteryName}</span>
                          <Badge variant="default" className="bg-green-500">Выигрыш</Badge>
                        </div>
                        <div className="flex gap-2 mb-2">
                          {ticket.numbers.map((num, i) => (
                            <div 
                              key={i} 
                              className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-medium"
                            >
                              {num}
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-muted-foreground">
                            {new Date(ticket.drawDate).toLocaleDateString('ru-RU')}
                          </div>
                          <div className="font-semibold text-green-600">{ticket.prize}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="mb-3">
                      <Trophy className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
                    </div>
                    <h3 className="font-semibold mb-1">Нет выигрышей</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      У вас пока нет выигрышных билетов. Испытайте удачу!
                    </p>
                    <Button asChild>
                      <Link to="/lotteries">Купить билет</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Активность аккаунта</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Статистика участия</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-3 bg-gray-50 rounded-lg text-center">
                        <div className="text-2xl font-bold text-primary">5</div>
                        <div className="text-xs text-muted-foreground">Всего билетов</div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg text-center">
                        <div className="text-2xl font-bold text-primary">1</div>
                        <div className="text-xs text-muted-foreground">Выигрышей</div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg text-center">
                        <div className="text-2xl font-bold text-primary">20%</div>
                        <div className="text-xs text-muted-foreground">Доходность</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">VIP-прогресс</h3>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <Crown className="h-4 w-4 mr-2 text-yellow-500" />
                          <span className="font-medium">Уровень {user.vipLevel}</span>
                        </div>
                        <span className="text-sm">70% до Уровня {user.vipLevel + 1}</span>
                      </div>
                      <Progress value={70} className="h-2 mb-2" />
                      <p className="text-xs text-muted-foreground">
                        Покупайте билеты и участвуйте в активностях для повышения VIP-уровня
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="tickets" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>История ваших билетов</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userTickets.map((ticket, index) => (
                  <div 
                    key={index} 
                    className="p-4 rounded-lg border"
                  >
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold">{ticket.lotteryName}</span>
                      {ticket.status === "active" ? (
                        <Badge variant="outline" className="text-blue-500 border-blue-500 bg-blue-50">Активный</Badge>
                      ) : ticket.status === "won" ? (
                        <Badge variant="default" className="bg-green-500">Выигрыш</Badge>
                      ) : (
                        <Badge variant="outline" className="text-gray-500">Завершен</Badge>
                      )}
                    </div>
                    <div className="flex gap-2 mb-3">
                      {ticket.numbers.map((num, i) => (
                        <div 
                          key={i} 
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                            ticket.status === "won" 
                              ? "bg-primary text-white" 
                              : "bg-primary/10 text-primary"
                          }`}
                        >
                          {num}
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between">
                      <div className="text-sm text-muted-foreground">
                        Дата покупки: {new Date(ticket.purchaseDate).toLocaleDateString('ru-RU')}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Розыгрыш: {new Date(ticket.drawDate).toLocaleDateString('ru-RU')}
                      </div>
                      {ticket.prize && (
                        <div className="font-semibold text-green-600">{ticket.prize}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="transactions" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>История транзакций</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactions.map((transaction, index) => (
                  <div 
                    key={index} 
                    className="p-3 border rounded-lg flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center">
                        {transaction.type === 'purchase' && (
                          <Ticket className="h-4 w-4 mr-2 text-blue-500" />
                        )}
                        {transaction.type === 'win' && (
                          <Trophy className="h-4 w-4 mr-2 text-green-500" />
                        )}
                        {transaction.type === 'deposit' && (
                          <Coins className="h-4 w-4 mr-2 text-orange-500" />
                        )}
                        <span className="font-medium">{transaction.description}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(transaction.date).toLocaleDateString('ru-RU', { 
                          day: 'numeric', 
                          month: 'long', 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                    <div className={`font-semibold ${
                      transaction.amount > 0 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount} {
                        transaction.currency === 'RUB' ? '₽' : 'бонусов'
                      }
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </BaseLayout>
  );
};

export default UserProfile;
