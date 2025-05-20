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
import { Lottery, useLotteries } from "@/LotteriesContext.tsx";

const LotteryDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { lotteries, refreshLotteries, getLotteryDraws } = useLotteries();
  const [lottery, setLottery] = useState<Lottery | null>(null);
  const [allDraws, setAllDraws] = useState<Lottery[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchLottery = async () => {
      setLoading(true);

      try {
        // Если список лотерей пуст, запросим его через API-сервис с логированием
        if (lotteries.length === 0) {
          await refreshLotteries();
        }

        // Если нужно получить конкретную лотерею напрямую, используем API-сервис
        if (id) {
          try {
            // Используем get запрос вместо прямого fetch для логирования
            const lotteryData = await get<Lottery>(`/lottery/draws/${id}`);
            setLottery(lotteryData);

            // Получаем все розыгрыши текущей лотереи
            if (lotteryData) {
              const lotteryDraws = getLotteryDraws(lotteryData.name);
              setAllDraws(lotteryDraws);
            }
          } catch (e) {
            console.error("Error fetching specific lottery:", e);
            // Вернемся к поиску в списке лотерей, если API недоступен
            const foundLottery = lotteries.find((l) => l.id === Number(id));
            if (foundLottery) {
              setLottery(foundLottery);
              const lotteryDraws = getLotteryDraws(foundLottery.name);
              setAllDraws(lotteryDraws);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch lottery data:", err);
      } finally {
        setLoading(false);
      }
    };

    void fetchLottery();
  }, [id, lotteries, refreshLotteries, getLotteryDraws]);

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
                          <TableHead>Цена биле��а</TableHead>
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
                              {draw.winning_str || "Не определена"}
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
