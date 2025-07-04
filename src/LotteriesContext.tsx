import React, {createContext, useContext, useState, useEffect, ReactNode, useMemo} from "react";
import {lotteries as mockLotteries} from "@/data/mockData";
import { get, post } from "@/services/api.ts";

// Новый тип для лотереи согласно формату API
export type Lottery = {
    id: number;
    price_currency: number;
    lottery_type_id: number;
    name: string;
    ticket_amount: number;
    battlepass_lvl: number;
    bonus_credit_vip: number;
    start_date: string;
    price_credits: number;
    end_date: string;
    description_md: string;
    winning_str: string | null;
    bonus_credit: number;
    is_active: boolean;
};

// Тип для результата розыгрыша лотереи
export type LotteryResult = {
    winning_str: string;
    reward_amount: number;
    message: string;
};

export type ResultLottery = {
    "winning_str": string;
    "reward_amount": number;
    "message": string
};

// Тип для сгруппированной лотереи
export type GroupedLottery = {
    name: string; // Название лотереи
    draws: Lottery[]; // Все розыгрыши данной лотереи
    nextDraw: Lottery; // Ближайший розыгрыш
    totalDraws: number; // Общее количество розыгрышей
    type: number; // Тип лотереи
    isActive: boolean; // Активна ли лотерея
};

// Тип для параметров фильтрации лотерей
export type LotteryFilterParams = {
    activeOnly?: boolean;
    type?: number;
    sortBy?: 'date' | 'price' | 'name';
    sortDirection?: 'asc' | 'desc';
};

// Тип для билета из API
export type Ticket = {
    purchase_date: string;
    id: number;
    reward: number | null;
    draw_id: number;
    value_str: string;
    profile_id: number;
    tier_name: string;
};

// Тип для билета с дополнительной информацией
export type EnrichedTicket = Ticket & {
    lottery?: Lottery;
    status: "active" | "won" | "completed";
    winAmount?: number;
};

// Старый тип для совместимости с моковыми данными
type MockLottery = typeof mockLotteries[number];

// Функция для преобразования мока в новый формат
const convertMockToLottery = (mockLottery: MockLottery): Lottery => {
    return {
        id: mockLottery.id,
        price_currency: mockLottery.ticketPrice || 0,
        lottery_type_id: mockLottery.type === "traditional" ? 1 : 2,
        name: mockLottery.name,
        ticket_amount: mockLottery.totalTickets || 0,
        battlepass_lvl: 1, // Значение по умолчанию
        bonus_credit_vip: 0, // Значение по умолчанию
        start_date: new Date().toISOString(),
        price_credits: typeof mockLottery.bonusCost === 'number' ? mockLottery.bonusCost : 0,
        end_date: mockLottery.nextDraw,
        description_md: mockLottery.description,
        winning_str: null,
        bonus_credit: 10, // Значение по умолчанию
        is_active: true
    };
};

type LotteriesContextType = {
    lotteries: Lottery[];
    groupedLotteries: GroupedLottery[]; // Сгруппированные лотереи
    loading: boolean;
    error: string | null;
    setLotteries: (lotteries: Lottery[]) => void;
    addLottery: (lottery: Lottery) => void;
    updateLottery: (id: number, patch: Partial<Lottery>) => void;
    removeLottery: (id: number) => void;
    refreshLotteries: () => Promise<void>;

    // Методы для работы с группировкой лотерей
    getLotteryDraws: (lotteryName: string) => Lottery[];
    getNextDrawByLotteryName: (lotteryName: string) => Lottery | undefined;

    // Новые методы для фильтрации и группировки
    getFilteredLotteries: (params?: LotteryFilterParams) => Lottery[];
    getFilteredGroupedLotteries: (params?: LotteryFilterParams) => GroupedLottery[];
    getLotteriesByType: (type: number) => Lottery[];
    getPopularLotteries: (limit?: number) => GroupedLottery[];

    // Новые методы для работы с билетами
    userTickets: EnrichedTicket[];
    ticketsLoading: boolean;
    ticketsError: string | null;
    fetchUserTickets: (profileId: number) => Promise<void>;
    getLotteryByDrawId: (drawId: number) => Lottery | undefined;
};

const LotteriesContext = createContext<LotteriesContextType | undefined>(undefined);

export const LotteriesProvider = ({children}: { children: ReactNode }) => {
    const [lotteries, setLotteries] = useState<Lottery[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Состояние для билетов
    const [userTickets, setUserTickets] = useState<EnrichedTicket[]>([]);
    const [ticketsLoading, setTicketsLoading] = useState<boolean>(false);
    const [ticketsError, setTicketsError] = useState<string | null>(null);

    const fetchLotteries = async () => {
        try {
            setLoading(true);
            setError(null);

            // Заменяем прямой вызов fetch на вызов через api-сервис с логированием
            const data = await get<{ draws: Lottery[] }>('/lottery/draws');
            setLotteries(data.draws);
        } catch (err) {
            console.error('Ошибка при загрузке данных:', err);
            setError(err instanceof Error ? err.message : 'Неизвестная ошибка при загрузке данных');
            // Преобразуем моковые данные в новый формат
            const convertedMockLotteries = mockLotteries.map(convertMockToLottery);
            setLotteries(convertedMockLotteries);
        } finally {
            setLoading(false);
        }
    };

    // Группировка лотерей по названию и сортировка розыгрышей по дате
    const groupedLotteries = useMemo(() => {
        if (!lotteries.length) return [];

        const lotteryGroups: { [key: string]: Lottery[] } = {};

        // Группируем розыгрыши по названию лотереи
        lotteries.forEach(lottery => {
            if (!lotteryGroups[lottery.name]) {
                lotteryGroups[lottery.name] = [];
            }
            lotteryGroups[lottery.name].push(lottery);
        });

        // Преобразуем в массив сгруппированных лотерей и сортируем розыгрыши по дате
        return Object.entries(lotteryGroups).map(([name, draws]) => {
            // Сортируем розыгрыши по дате (от ближайшего к дальнейшему)
            const sortedDraws = [...draws].sort(
                (a, b) => new Date(a.end_date).getTime() - new Date(b.end_date).getTime()
            );

            // Определяем тип лотереи (берем из первого розыгрыша)
            const type = sortedDraws[0]?.lottery_type_id || 0;

            // Проверяем, активна ли лотерея (хотя бы один розыгрыш активен)
            const isActive = sortedDraws.some(draw => draw.is_active);

            return {
                name,
                draws: sortedDraws,
                nextDraw: sortedDraws[0], // Первый розыгрыш после сортировки - ближайший
                totalDraws: sortedDraws.length,
                type,
                isActive
            };
        });
    }, [lotteries]);

    // Фильтрация лотерей по разным критериям
    const getFilteredLotteries = (params?: LotteryFilterParams): Lottery[] => {
        if (!params) return lotteries;

        let filtered = [...lotteries];

        // Фильтрация только активных лотерей
        if (params.activeOnly) {
            filtered = filtered.filter(lottery => lottery.is_active);
        }

        // Фильтрация по типу лотереи
        if (params.type !== undefined) {
            filtered = filtered.filter(lottery => lottery.lottery_type_id === params.type);
        }

        // Сортировка по разным критериям
        if (params.sortBy) {
            const direction = params.sortDirection === 'desc' ? -1 : 1;

            switch (params.sortBy) {
                case 'date':
                    filtered.sort((a, b) => direction * (new Date(a.end_date).getTime() - new Date(b.end_date).getTime()));
                    break;
                case 'price':
                    filtered.sort((a, b) => direction * (a.price_currency - b.price_currency));
                    break;
                case 'name':
                    filtered.sort((a, b) => direction * (a.name.localeCompare(b.name)));
                    break;
            }
        }

        return filtered;
    };

    // Получение отфильтрованных и сгруппированных лотерей
    const getFilteredGroupedLotteries = (params?: LotteryFilterParams): GroupedLottery[] => {
        // Сначала применяем фильтрацию
        const filteredLotteries = getFilteredLotteries(params);

        if (!filteredLotteries.length) return [];

        const lotteryGroups: { [key: string]: Lottery[] } = {};

        // Группируем фильтрованные розыгрыши по названию лотереи
        filteredLotteries.forEach(lottery => {
            if (!lotteryGroups[lottery.name]) {
                lotteryGroups[lottery.name] = [];
            }
            lotteryGroups[lottery.name].push(lottery);
        });

        // Преобразуем в массив сгруппированных лотерей
        return Object.entries(lotteryGroups).map(([name, draws]) => {
            const sortedDraws = [...draws].sort(
                (a, b) => new Date(a.end_date).getTime() - new Date(b.end_date).getTime()
            );

            const type = sortedDraws[0]?.lottery_type_id || 0;
            const isActive = sortedDraws.some(draw => draw.is_active);

            return {
                name,
                draws: sortedDraws,
                nextDraw: sortedDraws[0],
                totalDraws: sortedDraws.length,
                type,
                isActive
            };
        });
    };

    // Получение лотерей определенного типа
    const getLotteriesByType = (type: number): Lottery[] => {
        return lotteries.filter(lottery => lottery.lottery_type_id === type);
    };

    // Получение популярных лотерей (на основе количества розыгрышей)
    const getPopularLotteries = (limit?: number): GroupedLottery[] => {
        // Сортируем группированные лотереи по количеству розыгрышей (от большего к меньшему)
        const sorted = [...groupedLotteries].sort((a, b) => b.totalDraws - a.totalDraws);

        // Возвращаем либо все, либо ограниченное количество
        return limit ? sorted.slice(0, limit) : sorted;
    };

    // Получение всех розыгрышей конкретной лотереи, отсортированных по дате
    const getLotteryDraws = (lotteryName: string): Lottery[] => {
        const group = groupedLotteries.find(group => group.name === lotteryName);
        return group ? group.draws : [];
    };

    // Получение ближайшего розыгрыша конкретной лотереи
    const getNextDrawByLotteryName = (lotteryName: string): Lottery | undefined => {
        const group = groupedLotteries.find(group => group.name === lotteryName);
        return group ? group.nextDraw : undefined;
    };

    // Функция для получения лотереи по drawId
    const getLotteryByDrawId = (drawId: number): Lottery | undefined => {
        return lotteries.find(lottery => lottery.id === drawId);
    };

    // Функция для получения билетов пользователя
    const fetchUserTickets = async (profileId: number) => {
        try {
            setTicketsLoading(true);
            setTicketsError(null);

            // Заменяем прямой вызов fetch на вызов через api-сервис с логированием
            const data = await post<{ tickets: Ticket[] }>('/tickets/list', { profile_id: profileId });

            // Обогащаем билеты информацией о лотерее
            const enrichedTickets: EnrichedTicket[] = data.tickets.map((ticket: Ticket) => {
                const lottery = getLotteryByDrawId(ticket.draw_id);
                const now = new Date();
                const endDate = lottery ? new Date(lottery.end_date) : null;

                // Определяем статус билета
                let status: "active" | "won" | "completed" = "completed";
                if (endDate && endDate > now) {
                    status = "active";
                } else if (ticket.reward !== null) {
                    status = "won";
                }

                // Используем реальное значение reward из API вместо случайного
                const winAmount = ticket.reward !== null ? ticket.reward : undefined;

                return {
                    ...ticket,
                    lottery,
                    status,
                    winAmount
                };
            });

            setUserTickets(enrichedTickets);
        } catch (err) {
            console.error('Ошибка при загрузке билетов:', err);
            setTicketsError(err instanceof Error ? err.message : 'Неизвестная ошибка при загрузке билетов');

            // Создаем пустой массив билетов в случае ошибки
            setUserTickets([]);
        } finally {
            setTicketsLoading(false);
        }
    };

    // Загружаем данные при первом рендеринге
    useEffect(() => {
        void fetchLotteries();
    }, []);

    const addLottery = (lottery: Lottery) => setLotteries(prev => [...prev, lottery]);
    const updateLottery = (id: number, patch: Partial<Lottery>) =>
        setLotteries(prev =>
            prev.map(l =>
                l.id === id
                    ? {...l, ...patch} as Lottery
                    : l
            )
        );
    const removeLottery = (id: number) => setLotteries(prev => prev.filter(l => l.id !== id));
    const refreshLotteries = fetchLotteries;

    return (
        <LotteriesContext.Provider value={{
            lotteries,
            groupedLotteries,
            loading,
            error,
            setLotteries,
            addLottery,
            updateLottery,
            removeLottery,
            refreshLotteries,

            // Методы для работы с группировкой
            getLotteryDraws,
            getNextDrawByLotteryName,

            // Новые функции для работы с билетами
            userTickets,
            ticketsLoading,
            ticketsError,
            fetchUserTickets,
            getLotteryByDrawId,

            // Новые методы для фильтрации и группировки
            getFilteredLotteries,
            getFilteredGroupedLotteries,
            getLotteriesByType,
            getPopularLotteries
        }}>
            {children}
        </LotteriesContext.Provider>
    );
};

// Хук для использования контекста лотерей
export function useLotteries() {
    const ctx = useContext(LotteriesContext);
    if (!ctx) throw new Error("useLotteries must be used within LotteriesProvider");
    return ctx;
}

