import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Users, ThumbsUp, AlertCircle, ChevronLeft, Clock, Award } from "lucide-react";
import ReactMarkdown from "react-markdown";
import LotteryCountdown from "./LotteryCountdown";
import { Lottery } from "@/LotteriesContext";

interface LotteryHeaderProps {
  lottery: Lottery;
}

const LotteryHeader = ({ lottery }: LotteryHeaderProps) => {
  // Рассчитываем приблизительную стоимость джекпота на основе цены билета
  const estimatedJackpot = lottery.price_currency * 1000;

  // Форматируем дату и время розыгрыша
  const drawDate = new Date(lottery.end_date).toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Определяем активность лотереи
  const isActive = lottery.is_active;

  // Проверяем, есть ли результаты выигрыша
  const hasResults = !!lottery.winning_str;

  return (
    <>
      <div className="mb-4">
        <Link to="/lotteries" className="text-primary flex items-center hover:underline">
          <ChevronLeft size={16} />
          <span>Назад к списку лотерей</span>
        </Link>
      </div>

      <div className="flex items-start gap-4 mb-4">
        <div className="bg-white shadow rounded-xl overflow-hidden h-24 w-24">
          <img 
            src={'/placeholder.svg'}
            alt={lottery.name}
            className="w-full h-full object-cover"
          />
          {/* TODO: Нет данных об изображении лотереи */}
        </div>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-3xl font-bold">{lottery.name}</h1>
            <Badge variant={lottery.lottery_type_id === 1 ? "default" : "secondary"}>
              {lottery.lottery_type_id === 1 ? "Традиционная" : "Стратегическая"}
            </Badge>
            {!isActive && (
              <Badge variant="destructive">Завершена</Badge>
            )}
          </div>
          <div className="text-gray-500 mb-2 prose prose-sm max-w-none">
            <ReactMarkdown>{lottery.description_md}</ReactMarkdown>
          </div>
          <div className="flex flex-wrap items-center text-sm text-muted-foreground gap-y-1">
            <div className="flex items-center mr-4">
              <Users size={14} className="mr-1" />
              <span>{lottery.ticket_amount || 0} участников</span>
            </div>
            <div className="flex items-center mr-4">
              <ThumbsUp size={14} className="mr-1" />
              <span>Уровень: {lottery.battlepass_lvl}</span>
            </div>
            <div className="flex items-center mr-4">
              <Award size={14} className="mr-1" />
              <span>Приз: {estimatedJackpot.toLocaleString()} ₽</span>
              {/* TODO: Нет точных данных о джекпоте */}
            </div>
            <div className="flex items-center">
              <Clock size={14} className="mr-1" />
              <span>Старт: {new Date(lottery.start_date).toLocaleDateString('ru-RU')}</span>
            </div>
          </div>
        </div>
      </div>

      <Alert className={`mb-6 ${hasResults ? 'bg-green-50 border-green-200' : ''}`}>
        {hasResults ? (
          <>
            <Award className="h-4 w-4 text-green-600" />
            <AlertTitle>Результаты розыгрыша</AlertTitle>
            <AlertDescription>
              <div>
                <span className="font-medium">Выигрышные числа: </span>
                <span>{lottery.winning_str}</span>
              </div>
              {/* TODO: Нет данных о победителях и суммах выигрышей */}
            </AlertDescription>
          </>
        ) : (
          <>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{isActive ? "Следующий розыгрыш" : "Розыгрыш завершен"}</AlertTitle>
            <AlertDescription className="flex justify-between">
              <span>{drawDate}</span>
              {isActive && <LotteryCountdown nextDraw={lottery.end_date} />}
            </AlertDescription>
          </>
        )}
      </Alert>
    </>
  );
};

export default LotteryHeader;
