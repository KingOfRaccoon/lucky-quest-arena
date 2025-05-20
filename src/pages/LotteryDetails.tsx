import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import BaseLayout from "@/components/layout/BaseLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info, Ticket as TicketIcon, Timer, Calendar } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { get } from "@/services/api.ts";

// Import our new components
import LotteryHeader from "@/components/lottery/LotteryHeader";
import LotterySummary from "@/components/lottery/LotterySummary";
import LotteryInfo from "@/components/lottery/LotteryInfo";
import BuyTicketTab from "@/components/lottery/BuyTicketTab";
import LotteryRules from "@/components/lottery/LotteryRules";
import MiniGamesList from "@/components/lottery/MiniGamesList";
import { Lottery, LotteryResult, useLotteries } from "@/LotteriesContext.tsx";

const LotteryDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { lotteries, refreshLotteries, getLotteryDraws, getLotteryByDrawId } = useLotteries();
  const [lottery, setLottery] = useState<Lottery | null>(null);
  const [allDraws, setAllDraws] = useState<Lottery[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  // Состояние для отслеживания загрузки данных из контекста
  const [lotteriesLoaded, setLotteriesLoaded] = useState<boolean>(false);
  // Состояние для хранения результатов лотереи
  const [lotteryResult, setLotteryResult] = useState<LotteryResult | null>(null);
  const [resultLoading, setResultLoading] = useState<boolean>(false);

  // Отслеживаем изменения в lotteries из контекста
  useEffect(() => {
    if (lotteries.length > 0) {
      setLotteriesLoaded(true);
    }
  }, [lotteries]);

  useEffect(() => {
    const fetchLotteryData = async () => {
      if (!id) return;

      setLoading(true);
      try {
        // Проверяем наличие лотерей в контексте, иначе загружаем их
        if (lotteries.length === 0) {
          console.log("Лотереи не загружены, загружаем...");
          await refreshLotteries();
          return; // Выходим и ждем повторного выполнения эффекта после обновления lotteries
        }

        console.log("Ищем лотерею с ID:", Number(id));
        const lotteryFromContext = getLotteryByDrawId(Number(id));

        if (lotteryFromContext) {
          console.log("Лотерея найдена в контексте:", lotteryFromContext);
          setLottery(lotteryFromContext);

          // Получаем все розыгрыши текущей лотереи
          const lotteryDraws = getLotteryDraws(lotteryFromContext.name);
          setAllDraws(lotteryDraws);

          // Если лотерея уже завершена, запрашиваем её результаты
          const now = new Date();
          const endDate = new Date(lotteryFromContext.end_date);

          if (now > endDate) {
            await fetchLotteryResult(Number(id));
          }
        } else {
          console.log("Лотерея не найдена в контексте, обновляем данные...");
          // Повторная попытка обновления лотерей, если она не найдена
          await refreshLotteries();

          // Проверяем еще раз после обновления
          const updatedLottery = getLotteryByDrawId(Number(id));

          if (updatedLottery) {
            console.log("Лотерея найдена после обновления:", updatedLottery);
            setLottery(updatedLottery);
            const lotteryDraws = getLotteryDraws(updatedLottery.name);
            setAllDraws(lotteryDraws);

            // Проверка для завершенных лотерей
            const now = new Date();
            const endDate = new Date(updatedLottery.end_date);

            if (now > endDate) {
              await fetchLotteryResult(Number(id));
            }
          } else {
            console.error("Лотерея не найдена даже после обновления списка");
          }
        }
      } catch (err) {
        console.error("Failed to fetch lottery data:", err);
      } finally {
        setLoading(false);
      }
    };

    // Функция для получения результатов лотереи
    const fetchLotteryResult = async (lotteryId: number) => {
      try {
        setResultLoading(true);
        // Получаем данные о результатах лотереи
        const result = await get<LotteryResult>(`/lottery/draws/${lotteryId}/result`);
        setLotteryResult(result);
      } catch (error) {
        console.error("Error fetching lottery results:", error);
      } finally {
        setResultLoading(false);
      }
    };

    if (id) {
      void fetchLotteryData();
    }
  }, [id, lotteriesLoaded, lotteries, refreshLotteries, getLotteryDraws, getLotteryByDrawId]);

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
  const now = new Date();

  // Разделяем розыгрыши на предстоящие и прошедшие
  const upcomingDraws = allDraws.filter(draw => new Date(draw.end_date) > now);
  const pastDraws = allDraws.filter(draw => new Date(draw.end_date) <= now);

  return (
    <BaseLayout>
      <section className="mb-8">
        <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-6">
          <div className="grid md:grid-cols-12 gap-8">
            <div className="md:col-span-8">
              <LotteryHeader lottery={lottery} />
              <LotterySummary lottery={lottery} id={id} lotteryResult={lotteryResult} />
            </div>

            <div className="md:col-span-4">
              <LotteryInfo lottery={lottery} />
            </div>
          </div>
        </div>
      </section>

      <section>
        <Tabs defaultValue="buy" className="w-full">
          <TabsList className="mb-6 grid grid-cols-4">
            <TabsTrigger value="buy" className="flex items-center">
              <TicketIcon className="mr-2 h-4 w-4" /> Купить билет
            </TabsTrigger>
            <TabsTrigger value="draws" className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" /> Все розыгрыши
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

          <TabsContent value="draws" className="mt-0">
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 md:p-6">
                <h2 className="text-xl font-bold mb-6">Расписание розыгрышей лотереи "{lottery.name}"</h2>

                {/* Предстоящие розыгрыши */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-3">Предстоящие розыгрыши</h3>
                  {upcomingDraws.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Дата розыгрыша</TableHead>
                          <TableHead>Призовой фонд</TableHead>
                          <TableHead>Цена билета</TableHead>
                          <TableHead>Статус</TableHead>
                          <TableHead>Действие</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {upcomingDraws.map((draw) => (
                          <TableRow key={draw.id}>
                            <TableCell>
                              {new Date(draw.end_date).toLocaleDateString('ru-RU', {
                                day: 'numeric',
                                month: 'long',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </TableCell>
                            <TableCell>{draw.price_currency} ₽</TableCell>
                            <TableCell>
                              {draw.price_currency > 0
                                ? `${draw.price_currency} ₽`
                                : draw.price_credits
                                  ? `${draw.price_credits} бонусов`
                                  : "Бесплатно"
                              }
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                                Активен
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                disabled={draw.id === Number(id)}
                                onClick={() => window.location.href = `/lottery/${draw.id}`}
                                variant={draw.id === Number(id) ? "outline" : "default"}
                              >
                                {draw.id === Number(id) ? "Текущий" : "Участвовать"}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-gray-500">Нет предстоящих розыгрышей</p>
                  )}
                </div>

                {/* Прошедшие розыгрыши */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Прошедшие розыгрыши</h3>
                  {pastDraws.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Дата розыгрыша</TableHead>
                          <TableHead>Призовой фонд</TableHead>
                          <TableHead>Выигрышная комбинация</TableHead>
                          <TableHead>Статус</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pastDraws.map((draw) => (
                          <TableRow key={draw.id}>
                            <TableCell>
                              {new Date(draw.end_date).toLocaleDateString('ru-RU', {
                                day: 'numeric',
                                month: 'long',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </TableCell>
                            <TableCell>{draw.price_currency} ₽</TableCell>
                            <TableCell>
                              {(draw.id === Number(id) && lotteryResult)
                                ? lotteryResult.winning_str
                                : draw.winning_str || "Не определена"
                              }
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
                                Завершен
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-gray-500">Нет прошедших розыгрышей</p>
                  )}
                </div>
              </div>
            </div>
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
