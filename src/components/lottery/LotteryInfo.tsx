
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

interface LotteryInfoProps {
  lottery: any;
}

const LotteryInfo = ({ lottery }: LotteryInfoProps) => {
  return (
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
  );
};

export default LotteryInfo;
