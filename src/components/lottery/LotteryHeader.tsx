
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Users, ThumbsUp, AlertCircle, ChevronLeft } from "lucide-react";
import LotteryCountdown from "./LotteryCountdown";

interface LotteryHeaderProps {
  lottery: any;
}

const LotteryHeader = ({ lottery }: LotteryHeaderProps) => {
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
          <LotteryCountdown nextDraw={lottery.nextDraw} />
        </AlertDescription>
      </Alert>
    </>
  );
};

export default LotteryHeader;
