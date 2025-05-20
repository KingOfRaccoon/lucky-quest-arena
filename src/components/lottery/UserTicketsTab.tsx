import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Lottery, EnrichedTicket, useLotteries } from "@/LotteriesContext";
import { useUser } from "@/UserContext";
import { formatDistanceToNow, format } from "date-fns";
import { ru } from "date-fns/locale";

interface UserTicketsTabProps {
  lottery: Lottery;
}

const UserTicketsTab = ({ lottery }: UserTicketsTabProps) => {
  const { userTickets, ticketsLoading, fetchUserTickets } = useLotteries();
  const { user } = useUser();
  const [lotteryTickets, setLotteryTickets] = useState<EnrichedTicket[]>([]);

  useEffect(() => {
    // Если есть текущий пользователь и билеты ещё не загружены, загружаем их
    if (user?.id && userTickets.length === 0 && !ticketsLoading) {
      void fetchUserTickets(user.id);
    }
  }, [user?.id, fetchUserTickets, userTickets.length, ticketsLoading]); // Добавлена проверка на ticketsLoading

  useEffect(() => {
    // Фильтруем билеты для текущей лотереи
    if (userTickets && userTickets.length > 0) {
      const filteredTickets = userTickets.filter(
        (ticket) => ticket.lottery?.id === lottery.id
      );
      setLotteryTickets(filteredTickets);
    }
  }, [userTickets, lottery.id]);

  // Функция для красивого отображения чисел в билете
  const formatTicketValue = (valueStr: string): string => {
    // Проверяем, является ли это автомобильным номером
    if (lottery.lottery_type_id === 1) {
      // Для лотереи автомобильных номеров форматируем как номер
      return valueStr;
    } else {
      // Для обычных лотерей разделяем числа запятыми
      return valueStr.split(",").join(", ");
    }
  };

  // Определение статуса билета
  const getTicketStatusBadge = (ticket: EnrichedTicket) => {
    if (ticket.status === "won") {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          Выигрыш {ticket.winAmount} ₽
        </Badge>
      );
    } else if (ticket.status === "active") {
      return (
        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
          Активный
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-gray-100 text-gray-800 border-gray-200">
          Завершен
        </Badge>
      );
    }
  };

  // Расчет даты или текущего статуса для розыгрыша
  const getDrawStatus = (ticket: EnrichedTicket) => {
    const now = new Date();
    const endDate = ticket.lottery ? new Date(ticket.lottery.end_date) : null;

    if (!endDate) return "Дата не указана";

    if (endDate > now) {
      return `Розыгрыш: ${formatDistanceToNow(endDate, { 
        addSuffix: true,
        locale: ru
      })}`;
    } else {
      return `Состоялся: ${format(endDate, 'dd MMMM yyyy в HH:mm', { locale: ru })}`;
    }
  };

  if (ticketsLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <p>Загрузка билетов...</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Мои билеты в лотерее "{lottery.name}"</CardTitle>
        <CardDescription>
          {lotteryTickets.length > 0
            ? `У вас ${lotteryTickets.length} билетов в этой лотерее`
            : "У вас пока нет билетов в этой лотерее"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {lotteryTickets.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Номер билета</TableHead>
                <TableHead>Комбинация</TableHead>
                <TableHead>Дата покупки</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Розыгрыш</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lotteryTickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium">{ticket.id}</TableCell>
                  <TableCell>{formatTicketValue(ticket.value_str)}</TableCell>
                  <TableCell>
                    {format(new Date(ticket.purchase_date), 'dd.MM.yyyy HH:mm')}
                  </TableCell>
                  <TableCell>{getTicketStatusBadge(ticket)}</TableCell>
                  <TableCell>{getDrawStatus(ticket)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-10">
            <p>У вас пока нет билетов в этой лотерее.</p>
            <p className="mt-2 text-muted-foreground">
              Купите билет на вкладке "Купить билет", чтобы принять участие в розыгрыше!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserTicketsTab;
