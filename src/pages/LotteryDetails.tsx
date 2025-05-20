import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import BaseLayout from "@/components/layout/BaseLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info, Ticket as TicketIcon, Timer } from "lucide-react";

// Import our new components
import LotteryHeader from "@/components/lottery/LotteryHeader";
import LotterySummary from "@/components/lottery/LotterySummary";
import LotteryInfo from "@/components/lottery/LotteryInfo";
import BuyTicketTab from "@/components/lottery/BuyTicketTab";
import LotteryRules from "@/components/lottery/LotteryRules";
import MiniGamesList from "@/components/lottery/MiniGamesList";
import { Lottery, useLotteries } from "@/LotteriesContext.tsx";

const LotteryDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { lotteries, refreshLotteries } = useLotteries();
  const [lottery, setLottery] = useState<Lottery | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchLottery = async () => {
      setLoading(true);

      // Если список лотерей пуст, запросим его
      if (lotteries.length === 0) {
        await refreshLotteries();
      }

      const foundLottery = lotteries.find((l) => l.id === Number(id));
      if (foundLottery) {
        setLottery(foundLottery);
      }

      setLoading(false);
    };

    void fetchLottery();
  }, [id, lotteries, refreshLotteries]);

  if (loading) {
    return (
      <BaseLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <p>Загрузка данных лотереи...</p>
        </div>
      </BaseLayout>
    );
  }

  if (!lottery) {
    return (
      <BaseLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <p>Лотерея не найдена</p>
        </div>
      </BaseLayout>
    );
  }

  const maxSelectionOptions = lottery.lottery_type_id === 1 ? 6 : 4;

  return (
    <BaseLayout>
      <section className="mb-8">
        <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-6">
          <div className="grid md:grid-cols-12 gap-8">
            <div className="md:col-span-8">
              <LotteryHeader lottery={lottery} />
              <LotterySummary lottery={lottery} id={id} />
            </div>

            <div className="md:col-span-4">
              <LotteryInfo lottery={lottery} />
            </div>
          </div>
        </div>
      </section>

      <section>
        <Tabs defaultValue="buy" className="w-full">
          <TabsList className="mb-6 grid grid-cols-3 sm:grid-cols-3">
            <TabsTrigger value="buy" className="flex items-center">
              <TicketIcon className="mr-2 h-4 w-4" /> Купить билет
            </TabsTrigger>
            <TabsTrigger value="rules" className="flex items-center">
              <Info className="mr-2 h-4 w-4" /> Правила
            </TabsTrigger>
            <TabsTrigger value="minigames" className="flex items-center">
              <Timer className="mr-2 h-4 w-4" /> Мини-игры
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="buy" className="mt-0">
            <BuyTicketTab lottery={lottery} maxSelectionOptions={maxSelectionOptions} />
          </TabsContent>
          
          <TabsContent value="rules" className="mt-0">
            <LotteryRules lottery={lottery} maxSelectionOptions={maxSelectionOptions} />
          </TabsContent>
          
          <TabsContent value="minigames" className="mt-0">
            <MiniGamesList />
          </TabsContent>
        </Tabs>
      </section>
    </BaseLayout>
  );
};

export default LotteryDetails;
