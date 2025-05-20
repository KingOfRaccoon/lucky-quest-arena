import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import BaseLayout from "@/components/layout/BaseLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  Ticket,
  Coins,
  Crown,
  Clock,
  Calendar,
  ChevronRight,
  UserRound
} from "lucide-react";
import { useLotteries } from "@/LotteriesContext.tsx";
import { useUser } from "@/UserContext.tsx";
import { useToast } from "@/hooks/use-toast";

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showDeposit, setShowDeposit] = useState(false);
  const [depositAmount, setDepositAmount] = useState(500);
  const [ticketsLoadAttempted, setTicketsLoadAttempted] = useState(false);

  // Используем расширенный контекст лотерей с билетами
  const { lotteries, userTickets, ticketsLoading, fetchUserTickets } = useLotteries();
  const { user, addCurrency, loading: userLoading, error: userError } = useUser();
  const { toast } = useToast();

  // Улучшенная версия загрузки билетов, защищенная от бесконечных циклов
  const loadUserTickets = useCallback(async () => {
    if (!user?.id || ticketsLoadAttempted) return;

    try {
      setTicketsLoadAttempted(true);
      await fetchUserTickets(user.id);
    } catch (err) {
      console.error("Ошибка при загрузке билетов:", err);
      // Ошибка уже обрабатывается в контексте, здесь можно добавить уведомление если нужно
      toast({
        title: "Ошибка загрузки билетов",
        description: "Не удалось загрузить информацию о ваших билетах. Попробуйте позже.",
        variant: "destructive",
      });
    }
  }, [user?.id, fetchUserTickets, ticketsLoadAttempted, toast]);

  // Загружаем билеты пользователя при монтировании и изменении user.id
  useEffect(() => {
    if (user?.id) {
      void loadUserTickets();
    }
  }, [user?.id, loadUserTickets]);

  // Сбрасываем флаг загрузки при размонтировании
  useEffect(() => {
    return () => {
      setTicketsLoadAttempted(false);
    };
  }, []);

  // Создаем транзакции на основе данных о билетах
  const generateTransactionsFromTickets = (): {
    id: number;
    date: string;
    type: "purchase" | "win" | "deposit";
    description: string;
    amount: number;
    currency: "RUB" | "BONUS"; // RUB для валюты, BONUS для кредитов
  }[] => {
    if (!userTickets.length) return [];

    const ticketTransactions = userTickets.map((ticket, _) => {
      const lotteryName = ticket.lottery?.name || `Лотерея #${ticket.draw_id}`;

      // Транзакция покупки билета (всегда создается)
      const purchaseTransaction = {
        id: ticket.id * 10, // Уникальный id для транзакции покупки
        date: ticket.purchase_date,
        type: "purchase" as const,
        description: `Покупка билета «${lotteryName}»`,
        // Используем цену лотереи, если доступна, иначе случайное значение
        amount: -(ticket.lottery?.price_currency || Math.floor(Math.random() * 300) + 100),
        currency: "RUB" as const // Предполагаем, что билеты покупаются за валюту
      };

      // Для выигрышных билетов добавляем транзакцию выигрыша
      if (ticket.status === "won" && ticket.winAmount) {
        return [
          purchaseTransaction,
          {
            id: ticket.id * 10 + 1, // Уникальный id для транзакции выигрыша
            date: new Date(new Date(ticket.purchase_date).getTime() + 86400000).toISOString().split('T')[0], // Выигрыш на следующий день
            type: "win" as const,
            description: `Выигрыш в «${lotteryName}»`,
            amount: ticket.winAmount,
            currency: "BONUS" as const // Предполагаем, что выигрыши в кредитах
          }
        ];
      }

      return [purchaseTransaction];
    });

    // Уплощаем массив транзакций и добавляем транзакцию пополнения для примера
    const flatTransactions = ticketTransactions.flat();

    // Добавляем пример пополнения баланса
    if (flatTransactions.length > 0) {
      flatTransactions.push({
        id: 99999,
        date: new Date().toISOString().split('T')[0],
        type: "deposit" as const,
        description: "Пополнение баланса",
        amount: 1000,
        currency: "RUB" as const
      });
    }

    // Сортируем по дате (сначала новые)
    return flatTransactions.sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  };

  const transactions = generateTransactionsFromTickets();

  // Функция для извлечения номеров из строки значения билета
  const extractNumbersFromTicket = (valueStr: string): number[] => {
    // Для автомобильных номеров - возвращаем коды символов
    if (valueStr.length <= 10 && /[А-Я]/.test(valueStr)) {
      return Array.from(valueStr).map(char => char.charCodeAt(0));
    }

    // Для числовых комбинаций - разделяем на числа
    const numbers = valueStr.split(/[^0-9]+/).filter(Boolean).map(Number);
    if (numbers.length > 0) {
      return numbers;
    }

    // Если не удалось определить формат, возвращаем коды всех символов
    return Array.from(valueStr).map(char => char.charCodeAt(0) % 100); // Ограничиваем до 2 цифр
  };

  // Обогащаем билеты дополнительной информацией для отображения
  const enrichedTicketsForUI = userTickets.map(ticket => ({
    ...ticket,
    lotteryName: ticket.lottery?.name || `Лотерея #${ticket.draw_id}`,
    numbers: extractNumbersFromTicket(ticket.value_str),
    purchaseDate: ticket.purchase_date,
    drawDate: ticket.lottery?.end_date || new Date().toISOString()
  }));

  const handleDeposit = async () => {
    if (depositAmount <= 0) {
      toast({
        title: "Ошибка",
        description: "Сумма пополнения должна быть больше нуля.",
        variant: "destructive",
      });
      return;
    }
    try {
      await addCurrency(depositAmount);
      toast({
        title: "Успешно",
        description: `Баланс пополнен на ${depositAmount} ₽.`,
      });
      setShowDeposit(false);
    } catch (error) {
      toast({
        title: "Ошибка пополнения",
        description: (error as Error).message || "Не удалось пополнить баланс.",
        variant: "destructive",
      });
    }
  };

  // Обработка состояний загрузки и ошибок
  if ((userLoading && !user)) {
    return (
      <BaseLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <p>Загрузка данных профиля...</p>
        </div>
      </BaseLayout>
    );
  }

  if (ticketsLoading) {
    return (
      <BaseLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <p>Загрузка данных о билетах...</p>
        </div>
      </BaseLayout>
    );
  }

  if (userError) {
    return (
      <BaseLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <p>Ошибка загрузки профиля: {userError}</p>
        </div>
      </BaseLayout>
    );
  }

  if (!user) {
    return (
      <BaseLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <p>Пользователь не найден. Возможно, необходимо войти в систему.</p>
          <Button asChild className="ml-4"><Link to="/">На главную</Link></Button>
        </div>
      </BaseLayout>
    );
  }

  // Расчет прогресса VIP (примерный, т.к. нет точных данных о следующем уровне)
  const vipProgress = user.vip ? 100 : 50; // Если VIP - 100%, иначе - условно 50%
  const nextVipLevelName = user.vip ? "Максимальный" : "Следующий уровень"; // Пример

  return (
    <BaseLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Личный кабинет</h1>
        <p className="text-gray-500">Добро пожаловать, {user.name}!</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <UserRound className="h-4 w-4 mr-2 text-primary" />
              Профиль пользователя
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <UserRound className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{user.name}</h3>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Баланс:</span>
                <span className="font-medium">{user.currency} ₽</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Кредиты:</span>
                <span className="font-medium">{user.credits} кредитов</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">VIP-статус:</span>
                <div className="flex items-center">
                  <Badge className={`${user.vip ? 'bg-gradient-to-r from-purple-600 to-pink-500' : 'bg-gray-400'}`}>
                    <Crown className="h-3 w-3 mr-1" />
                    {user.vip ? "VIP Активен" : "Стандарт"}
                  </Badge>
                </div>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Прогресс VIP:</span>
                <div className="mt-1">
                  <Progress value={vipProgress} className="h-2" />
                  <p className="text-xs text-right mt-1">{vipProgress}% до "{nextVipLevelName}"</p>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <Button variant="outline" size="sm" className="w-full" onClick={() => setShowDeposit(true)}>
                Пополнить баланс
              </Button>
            </div>

            {showDeposit && (
              <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                <div className="bg-white rounded shadow-lg p-6 min-w-[300px]">
                  <h2 className="text-lg font-bold mb-4">Пополнить баланс (валюта)</h2>
                  <input
                    type="number"
                    min={1}
                    value={depositAmount}
                    onChange={e => setDepositAmount(Number(e.target.value))}
                    className="border rounded px-2 py-1 w-full mb-4"
                    placeholder="Сумма в ₽"
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleDeposit} disabled={userLoading}>
                      {userLoading ? "Пополнение..." : "Пополнить"}
                    </Button>
                    <Button variant="outline" onClick={() => setShowDeposit(false)} disabled={userLoading}>
                      Отмена
                    </Button>
                  </div>
                </div>
              </div>
            )}
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
            {enrichedTicketsForUI.filter(ticket => ticket.status === "active").length > 0 ?
              enrichedTicketsForUI.filter(ticket => ticket.status === "active").map((ticket, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-md ${index > 0 ? 'mt-3' : ''} bg-gray-50 hover:bg-gray-100`}
                >
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">{ticket.lotteryName}</span>
                    <Badge variant="outline">{new Date(ticket.drawDate).toLocaleDateString('ru-RU')}</Badge>
                  </div>
                  <div className="flex gap-1 mb-2">
                    {ticket.numbers.slice(0, 6).map((num, i) => (
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
                      {/* Рассчитываем время до розыгрыша */}
                      <span>До розыгрыша: {
                        Math.max(
                          0,
                          Math.floor((new Date(ticket.drawDate).getTime() - new Date().getTime()) / (1000 * 60 * 60))
                        )
                      } ч</span>
                    </div>
                    <Button variant="ghost" size="sm" className="h-6 px-2" asChild>
                      <Link to={`/lottery/${ticket.draw_id}`}>
                        Подробнее
                        <ChevronRight className="h-3 w-3 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground text-center py-4">Нет активных билетов.</p>
              )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full mt-4" asChild>
              <Link to="/lotteries">
                Купить еще билеты
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-primary" />
              Ближайшие розыгрыши
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lotteries.length > 0 ? (
              <div className="space-y-3">
                {lotteries.slice(0, 3).map((lottery, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="bg-white shadow rounded-lg overflow-hidden h-10 w-10 flex-shrink-0">
                      <img
                        src={"/placeholder.svg"}
                        alt={lottery.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h3 className="font-medium text-sm truncate">{lottery.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {new Date(lottery.end_date).toLocaleString('ru-RU', {
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
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">Нет доступных лотерей.</p>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full mt-4" asChild>
              <Link to="/lotteries">
                Все лотереи
              </Link>
            </Button>
          </CardFooter>
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
                {enrichedTicketsForUI.filter(ticket => ticket.status === "won").length > 0 ? (
                  <div className="space-y-4">
                    {enrichedTicketsForUI.filter(ticket => ticket.status === "won").map((ticket, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between mb-2">
                          <span className="font-semibold">{ticket.lotteryName}</span>
                          <Badge variant="default" className="bg-green-500">Выигрыш</Badge>
                        </div>
                        <div className="flex gap-2 mb-2">
                          {ticket.numbers.slice(0, 6).map((num, i) => (
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
                          <div className="font-semibold text-green-600">{ticket.winAmount} кредитов</div>
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
                        <div className="text-2xl font-bold text-primary">{enrichedTicketsForUI.length}</div>
                        <div className="text-xs text-muted-foreground">Всего билетов</div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg text-center">
                        <div className="text-2xl font-bold text-primary">
                          {enrichedTicketsForUI.filter(t => t.status === 'won').length}
                        </div>
                        <div className="text-xs text-muted-foreground">Выигрышей</div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg text-center">
                        {/* Рассчитываем доходность, если есть данные */}
                        <div className="text-2xl font-bold text-primary">
                          {enrichedTicketsForUI.length > 0 ?
                            Math.round(
                              (enrichedTicketsForUI.filter(t => t.status === 'won').length /
                              enrichedTicketsForUI.length) * 100
                            ) + '%'
                            : 'N/A'}
                        </div>
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
                          <span className="font-medium">{user.vip ? "VIP Активен" : "Стандарт"}</span>
                        </div>
                        <span className="text-sm">{vipProgress}% до "{nextVipLevelName}"</span>
                      </div>
                      <Progress value={vipProgress} className="h-2 mb-2" />
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
              {enrichedTicketsForUI.length > 0 ? (
                <div className="space-y-4">
                  {enrichedTicketsForUI.map((ticket, index) => (
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
                        {ticket.numbers.slice(0, 6).map((num, i) => (
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
                          Комбинация: {ticket.value_str}
                        </div>
                      </div>
                      <div className="flex justify-between mt-2">
                        <div className="text-sm text-muted-foreground">
                          Дата покупки: {new Date(ticket.purchaseDate).toLocaleDateString('ru-RU')}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Розыгрыш: {new Date(ticket.drawDate).toLocaleDateString('ru-RU')}
                        </div>
                      </div>

                      {/* Отображение информации о выигрыше, если билет выигрышный */}
                      {ticket.status === "won" && (
                        <div className="mt-3 p-2 bg-green-50 rounded-md border border-green-200">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Выигрыш:</span>
                            <span className="font-semibold text-green-600">{ticket.winAmount} кредитов</span>
                          </div>
                          {ticket.tier_name && (
                            <div className="mt-1 text-sm">
                              <span className="text-gray-600">{ticket.tier_name}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">У вас пока нет купленных билетов.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="transactions" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>История транзакций</CardTitle>
            </CardHeader>
            <CardContent>
              {transactions.length > 0 ? (
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
                          transaction.currency === 'RUB' ? '₽' : 'кредитов'
                        }
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">История транзакций пуста.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </BaseLayout>
  );
};

export default UserProfile;
