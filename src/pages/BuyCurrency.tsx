import { useState } from "react";
import { Link } from "react-router-dom";
import BaseLayout from "@/components/layout/BaseLayout";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  ChevronLeft,
  CreditCard,
  Wallet,
  Banknote,
  CheckCircle,
  Coins
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/UserContext"; // Импортируем useUser

const BuyCurrency = () => {
  const { user, addCurrency, addCredits, loading: userLoading, error: userError } = useUser(); // Используем useUser
  const [amount, setAmount] = useState<number>(500);
  const [paymentMethod, setPaymentMethod] = useState<string>("card");
  // isProcessing теперь заменяется на userLoading из UserContext
  const { toast } = useToast();

  const handleQuickAmountSelect = (value: number) => {
    setAmount(value);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setAmount(isNaN(value) ? 0 : value);
  };

  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethod(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (amount <= 0) {
      toast({
        title: "Ошибка",
        description: "Сумма должна быть больше нуля",
        variant: "destructive",
      });
      return;
    }
    
    // Имитация процесса оплаты и обновление баланса через UserContext
    try {
      await addCurrency(amount); // Используем addCurrency из UserContext
      toast({
        title: "Успешно",
        description: `На ваш счет зачислено ${amount} ₽.`,
      });
    } catch (error) {
      console.error("Ошибка при пополнении баланса:", error);
      toast({
        title: "Ошибка пополнения",
        description: (error as Error).message || "Не удалось пополнить баланс.",
        variant: "destructive",
      });
    }
  };

  const bonusCalculator = (value: number) => { // Переименовал параметр для ясности
    if (value >= 5000) return Math.floor(value * 0.2);
    if (value >= 2000) return Math.floor(value * 0.15);
    if (value >= 1000) return Math.floor(value * 0.1);
    if (value >= 500) return Math.floor(value * 0.05);
    return 0;
  };

  const bonusAmount = bonusCalculator(amount);

  // Отображение текущего баланса пользователя
  const currentCurrency = user?.currency ?? 0;
  const currentCredits = user?.credits ?? 0;

  if (userLoading && !user) { // Показываем загрузку, если пользователь еще не загружен
    return (
      <BaseLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <p>Загрузка данных пользователя...</p>
        </div>
      </BaseLayout>
    );
  }

  if (userError) {
    return (
      <BaseLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <p>Ошибка загрузки данных: {userError}</p>
        </div>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout>
      <div className="mb-4">
        <Link to="/profile" className="text-primary flex items-center hover:underline">
          <ChevronLeft size={16} />
          {/* Изменено направление ссылки на профиль, если это более логично */}
          <span>Назад в профиль</span>
        </Link>
      </div>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Пополнить баланс</h1>
        <p className="text-gray-500">Текущий баланс: {currentCurrency} ₽ | Кредиты: {currentCredits}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Выберите сумму</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* ... остальная часть формы без изменений ... */}
                <div className="grid grid-cols-4 gap-3">
                  {[500, 1000, 2000, 5000].map((value) => (
                    <Button
                      key={value}
                      type="button"
                      variant={amount === value ? "default" : "outline"}
                      onClick={() => handleQuickAmountSelect(value)}
                      className="w-full"
                    >
                      {value} ₽
                    </Button>
                  ))}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="custom-amount">Другая сумма</Label>
                  <Input
                    id="custom-amount"
                    type="number"
                    min="100"
                    max="50000"
                    value={amount}
                    onChange={handleAmountChange}
                  />
                </div>
                
                <Tabs defaultValue="card" className="w-full" onValueChange={handlePaymentMethodChange}>
                  <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger value="card" className="flex items-center">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Карта
                    </TabsTrigger>
                    <TabsTrigger value="ewallet" className="flex items-center">
                      <Wallet className="mr-2 h-4 w-4" />
                      Кошелек
                    </TabsTrigger>
                    <TabsTrigger value="banking" className="flex items-center">
                      <Banknote className="mr-2 h-4 w-4" />
                      СБП
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="card" className="mt-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="card-number">Номер карты</Label>
                      <Input id="card-number" placeholder="XXXX XXXX XXXX XXXX" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Срок действия</Label>
                        <Input id="expiry" placeholder="ММ/ГГ" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" type="password" placeholder="XXX" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="card-name">Имя владельца</Label>
                      <Input id="card-name" placeholder="Имя, как на карте" />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="ewallet" className="mt-6 space-y-4">
                    <RadioGroup defaultValue="yoomoney">
                      <div className="flex items-center space-x-2 p-3 border rounded-md">
                        <RadioGroupItem value="yoomoney" id="yoomoney" />
                        <Label htmlFor="yoomoney" className="flex items-center">
                          <img src="/placeholder.svg" className="w-6 h-6 mr-2" alt="YooMoney" />
                          ЮMoney
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border rounded-md">
                        <RadioGroupItem value="qiwi" id="qiwi" />
                        <Label htmlFor="qiwi" className="flex items-center">
                          <img src="/placeholder.svg" className="w-6 h-6 mr-2" alt="QIWI" />
                          QIWI
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border rounded-md">
                        <RadioGroupItem value="webmoney" id="webmoney" />
                        <Label htmlFor="webmoney" className="flex items-center">
                          <img src="/placeholder.svg" className="w-6 h-6 mr-2" alt="WebMoney" />
                          WebMoney
                        </Label>
                      </div>
                    </RadioGroup>
                  </TabsContent>
                  
                  <TabsContent value="banking" className="mt-6">
                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                      <div className="mb-4">
                        <img src="/placeholder.svg" className="w-24 h-24 mx-auto" alt="QR Code" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Отсканируйте QR-код в вашем банковском приложении для оплаты через Систему Быстрых Платежей
                      </p>
                      <Button variant="outline" size="sm">
                        Скачать QR-код
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={userLoading || amount <= 0} // Используем userLoading
                >
                  {userLoading ? 'Обработка...' : `Оплатить ${amount} ₽`}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Информация о платеже</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Сумма:</span>
                  <span className="font-medium">{amount} ₽</span>
                </div>
                {bonusAmount > 0 && (
                  <div className="flex justify-between mb-2 text-green-600">
                    <span>Бонус (кредиты):</span>
                    <span className="font-medium">+{bonusAmount} кредитов</span>
                  </div>
                )}
                <div className="border-t my-2"></div>
                <div className="flex justify-between font-semibold">
                  <span>Итого к оплате:</span>
                  <span>{amount} ₽</span>
                </div>
              </div>
              
              {/* ... остальная часть информации о бонусах без изменений ... */}
              <div className="space-y-3">
                <h3 className="font-medium">Бонусная программа</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                    <span>От 500 ₽: +5% кредитов</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                    <span>От 1000 ₽: +10% кредитов</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                    <span>От 2000 ₽: +15% кредитов</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                    <span>От 5000 ₽: +20% кредитов</span>
                  </li>
                </ul>
              </div>
              
              <div className="p-4 border border-green-100 bg-green-50 rounded-lg">
                <div className="flex items-start">
                  <Coins className="h-5 w-5 mr-3 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-medium text-green-800 mb-1">Кредиты можно использовать</h3>
                    <p className="text-sm text-green-700">
                      Для покупки билетов на бонусные лотереи и доступа к стратегическим играм
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </BaseLayout>
  );
};

export default BuyCurrency;
