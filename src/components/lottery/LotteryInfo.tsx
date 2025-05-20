import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Lottery } from "@/LotteriesContext.tsx";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Award } from "lucide-react";

interface LotteryInfoProps {
    lottery: Lottery;
}

const LotteryInfo = ({ lottery }: LotteryInfoProps) => {
    // Расчет времени до розыгрыша
    const timeUntilDraw = () => {
        const now = new Date();
        const endDate = new Date(lottery.end_date);
        const diffMs = endDate.getTime() - now.getTime();

        if (diffMs <= 0) return "Розыгрыш начался";

        const diffMins = Math.floor(diffMs / 60000);
        if (diffMins < 60) {
            return `${diffMins} мин`;
        } else {
            const hours = Math.floor(diffMins / 60);
            const mins = diffMins % 60;
            return `${hours} ч ${mins} мин`;
        }
    };

    // Расчет оставшихся билетов
    // TODO: Нет данных о максимальном количестве билетов, используем условное значение
    const maxTickets = lottery.ticket_amount * 2; // Предполагаемое максимальное количество
    const remainingTickets = maxTickets - lottery.ticket_amount;
    const ticketProgressPercentage = (lottery.ticket_amount / maxTickets) * 100;

    // Определяем тип цены в зависимости от значений в объекте лотереи
    const getPriceDisplay = () => {
        if (lottery.price_currency > 0) {
            return `${lottery.price_currency} ₽`;
        } else if (lottery.price_credits > 0) {
            return `${lottery.price_credits} ₽`;
        } else if (lottery.bonus_credit > 0) {
            return `${lottery.bonus_credit} бонусов`;
        } else {
            return "Бесплатно";
        }
    };

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-lg">Информация о лотерее</CardTitle>
                <div className="flex mt-1">
                    <Badge variant={lottery.lottery_type_id === 1 ? "default" : "secondary"}>
                        {lottery.lottery_type_id === 1 ? "Традиционная" : "Стратегическая"}
                    </Badge>
                    <Badge variant={lottery.is_active ? "outline" : "destructive"} className="ml-2">
                        {lottery.is_active ? "Активна" : "Завершена"}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    <div>
                        <p className="text-sm text-muted-foreground">Цена билета</p>
                        <p className="font-medium">{getPriceDisplay()}</p>
                    </div>
                    <Separator/>
                    <div>
                        <p className="text-sm text-muted-foreground">До розыгрыша</p>
                        <p className="font-medium flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                            {timeUntilDraw()}
                            {/* TODO: Нет данных о частоте проведения розыгрышей */}
                        </p>
                    </div>
                    <Separator/>
                    <div>
                        <p className="text-sm text-muted-foreground">Участники</p>
                        <p className="font-medium flex items-center">
                            <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                            {lottery.ticket_amount}
                        </p>
                    </div>
                    <Separator/>
                    <div>
                        <p className="text-sm text-muted-foreground">Выигрыш</p>
                        <p className="font-medium flex items-center">
                            <Award className="h-4 w-4 mr-1 text-muted-foreground" />
                            {/* TODO: Нет точных данных о выигрыше/джекпоте */}
                            {lottery.price_currency * 1000} ₽
                        </p>
                    </div>
                    <Separator/>
                    <div>
                        <p className="text-sm text-muted-foreground">Осталось билетов</p>
                        <>
                            <div className="flex justify-between text-xs mt-1 mb-1">
                                <span>0</span>
                                <span>{maxTickets}</span>
                            </div>
                            <Progress
                                value={ticketProgressPercentage}
                                className="h-1"
                            />
                            <p className="text-xs text-right mt-1">
                                {/* TODO: Нет данных о максимальном количестве билетов */}
                                {remainingTickets} из {maxTickets}
                            </p>
                        </>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default LotteryInfo;
