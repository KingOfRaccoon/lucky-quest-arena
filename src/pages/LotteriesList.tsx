import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import BaseLayout from "@/components/layout/BaseLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Search, TrendingUp, Users, Zap } from "lucide-react";
import { useLotteries, GroupedLottery, LotteryFilterParams } from "@/LotteriesContext.tsx";

const LotteriesList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { getFilteredGroupedLotteries, getLotteryByDrawId } = useLotteries();

  // Определяем параметры фильтрации в зависимости от поиска
  const filterParams: LotteryFilterParams = useMemo(() => ({
    activeOnly: true, // показываем только активные лотереи
    sortBy: 'date',   // сортируем по дате
    sortDirection: 'asc'  // от ближайших к дальним
  }), []);

  // Получаем сгруппированные лотереи для каждого типа
  const allLotteries = useMemo(() => {
    const grouped = getFilteredGroupedLotteries(filterParams);
    return grouped.filter(group =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.draws.some(draw =>
        draw.description_md.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [getFilteredGroupedLotteries, filterParams, searchTerm]);

  // Фильтруем по типам
  const traditionalLotteries = useMemo(() =>
    allLotteries.filter(group => group.type === 1),
    [allLotteries]
  );
  
  const strategicLotteries = useMemo(() =>
    allLotteries.filter(group => group.type === 2),
    [allLotteries]
  );

  // Format time remaining function
  const formatTimeRemaining = (drawTime: string) => {
    const drawDate = new Date(drawTime);
    const now = new Date();
    const diffMs = drawDate.getTime() - now.getTime();
    
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

  // Рендерим карточку лотереи
  const renderLotteryCard = (group: GroupedLottery) => {
    const lottery = group.nextDraw; // Используем ближайший розыгрыш для отображения

    return (
      <Card key={group.name} className="lottery-card overflow-hidden">
        <div className="aspect-video bg-muted relative">
          <img
            src={'/placeholder.svg'}
            alt={group.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4">
            <Badge variant={group.type === 1 ? "default" : "secondary"} className="shadow-md">
              {group.type === 1 ? "Традиционная" : "Стратегическая"}
            </Badge>
          </div>
        </div>
        <CardHeader>
          <CardTitle>{group.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{lottery.description_md}</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Призовой фонд</span>
              <span className="font-medium text-primary">{lottery.price_currency * 1000} ₽</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Цена билета</span>
              <span className="font-medium">
                {lottery.price_credits > 0 ? `${lottery.price_credits} ₽` : lottery.bonus_credit ? `${lottery.bonus_credit} бонусов` : "Бесплатно"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Участников</span>
              <span className="font-medium flex items-center">
                <Users className="mr-1 h-3 w-3" />
                {lottery.ticket_amount || 0}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">До розыгрыша</span>
              <span className="font-medium flex items-center">
                <Clock className="mr-1 h-3 w-3" />
                {formatTimeRemaining(lottery.end_date)}
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full bg-primary text-white hover:bg-primary/90" asChild>
            <Link to={`/lottery/${lottery.id}`}>
              Подробнее
            </Link>
          </Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <BaseLayout>
      <section className="mb-12">
        <h1 className="text-3xl font-bold mb-2">Список лотерей</h1>
        <p className="text-gray-500 mb-6">
          Выберите лотерею и испытайте свою удачу или стратегические навыки
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Поиск лотереи..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">Все лотереи</TabsTrigger>
            <TabsTrigger value="traditional">Традиционные</TabsTrigger>
            <TabsTrigger value="strategic">Стратегические</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allLotteries.map(renderLotteryCard)}
            </div>
          </TabsContent>
          
          <TabsContent value="traditional" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {traditionalLotteries.map(renderLotteryCard)}
            </div>
          </TabsContent>
          
          <TabsContent value="strategic" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {strategicLotteries.map(renderLotteryCard)}
            </div>
          </TabsContent>
        </Tabs>
      </section>

      <section className="mb-12">
        <div className="bg-primary/5 rounded-lg p-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-8">
              <h2 className="text-2xl font-bold mb-2">Почему стоит играть с нами?</h2>
              <p className="text-muted-foreground">
                Наша платформа предлагает уникальный игровой опыт и справедливые розыгрыши
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full md:w-auto">
              <div className="bg-white p-4 rounded-lg shadow-sm flex">
                <div className="mr-4 flex items-center justify-center">
                  <span className="bg-primary/10 p-2 rounded-full flex items-center justify-center">
                    <Zap className="h-5 w-5 text-primary" />
                  </span>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Быстрые розыгрыши</h3>
                  <p className="text-xs text-muted-foreground">
                    Розыгрыши каждые 15 минут без задержек
                  </p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm flex">
                <div className="mr-4 flex items-center justify-center">
                  <span className="bg-primary/10 p-2 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </span>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Высокие шансы</h3>
                  <p className="text-xs text-muted-foreground">
                    Призовой фонд 50-70% от суммы билетов
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </BaseLayout>
  );
};

export default LotteriesList;
