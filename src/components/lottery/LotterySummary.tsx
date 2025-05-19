
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Gift, TrendingUp, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

interface LotterySummaryProps {
  lottery: any;
  id?: string | number;
}

const LotterySummary = ({ lottery, id }: LotterySummaryProps) => {
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
            <p className="text-2xl font-bold">{typeof lottery.prizePool === 'number' ? `${lottery.prizePool} ₽` : lottery.prizePool}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-lg flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-primary" />
              Текущий джекпот
            </CardTitle>
          </CardHeader>
          <CardContent className="py-3">
            <p className="text-2xl font-bold">{lottery.jackpot} {typeof lottery.jackpot === 'number' ? '₽' : ''}</p>
            <div className="mt-2">
              <Button variant="ghost" size="sm" className="px-0 h-7" asChild>
                <Link to={`/lottery/results/${id}`} className="text-primary flex items-center">
                  <Calendar className="mr-1 h-4 w-4" />
                  <span>История результатов</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default LotterySummary;
