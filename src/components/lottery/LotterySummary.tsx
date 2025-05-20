import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Gift, TrendingUp, Calendar, Coins } from "lucide-react";
import { Link } from "react-router-dom";
import { Lottery } from "@/LotteriesContext";

interface LotterySummaryProps {
  lottery: Lottery;
  id?: string | number;
}

const LotterySummary = ({ lottery, id }: LotterySummaryProps) => {
  // Рассчитываем призовой фонд в зависимости от цены билета
  const prizePool = lottery.price_currency * lottery.ticket_amount; // Примерный расчет призового фонда

  // Доступность лотереи
  const isActive = lottery.is_active;

  // Используем ID из лотереи, если он не передан явно
  const lotteryId = id || lottery.id;

  // Рассчитываем процент заполнения билетов
  // TODO: Нет данных о максимальном количестве билетов, используем условное значение
  const maxTickets = lottery.ticket_amount * 2; // Предполагаемое максимальное количество билетов
  const fillPercentage = (lottery.ticket_amount / maxTickets) * 100;

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-lg flex items-center">
              <Gift className="h-4 w-4 mr-2 text-primary" />
              Призовой фонд
            </CardTitle>
          </CardHeader>
          <CardContent className="py-3">
            <p className="text-2xl font-bold">{prizePool.toLocaleString()} ₽</p>
            {/* TODO: Нет данных о процентах от общего фонда */}
            <p className="text-xs text-muted-foreground">70% от суммы билетов</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-lg flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-primary" />
              Бонусные кредиты
            </CardTitle>
          </CardHeader>
          <CardContent className="py-3">
            <p className="text-2xl font-bold">{lottery.bonus_credit} <Coins className="inline h-4 w-4" /></p>
            <div className="mt-2">
              <Button variant="ghost" size="sm" className="px-0 h-7" asChild>
                <Link to={`/lottery/results/${lotteryId}`} className="text-primary flex items-center">
                  <Calendar className="mr-1 h-4 w-4" />
                  <span>История результатов</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-muted/40 rounded-lg p-4 mt-6">
        <h2 className="font-semibold mb-2">Информация о лотерее</h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground text-sm">Стоимость билета:</span>
            <span className="font-medium">{lottery.price_currency} ₽</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground text-sm">Бонусы VIP:</span>
            <span className="font-medium">{lottery.bonus_credit_vip}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground text-sm">Всего билетов:</span>
            <span className="font-medium">{lottery.ticket_amount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground text-sm">Начало:</span>
            <span className="font-medium">{new Date(lottery.start_date).toLocaleDateString('ru-RU')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground text-sm">Цена в кредитах:</span>
            <span className="font-medium">{lottery.price_credits}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground text-sm">Конец:</span>
            <span className="font-medium">{new Date(lottery.end_date).toLocaleDateString('ru-RU')}</span>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="mb-2">
          <div className="flex justify-between text-sm">
            <span>Заполнение:</span>
            <span>{lottery.ticket_amount} / {maxTickets}</span>
          </div>
          {/* TODO: Нет данных о максимальном количестве билетов */}
          <Progress value={fillPercentage} className="h-2" />
        </div>

        <div className="text-center mt-4">
          <Button asChild disabled={!isActive}>
            <Link to={`/lottery/${lotteryId}/buy`}>
              {isActive ? "Купить билет" : "Лотерея завершена"}
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
};

export default LotterySummary;
