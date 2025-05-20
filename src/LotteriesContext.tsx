import React, {createContext, useContext, useState, useEffect, ReactNode} from "react";
import {lotteries as mockLotteries} from "@/data/mockData";
import {API_BASE_URL} from "@/config/api.ts";

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
    loading: boolean;
    error: string | null;
    setLotteries: (lotteries: Lottery[]) => void;
    addLottery: (lottery: Lottery) => void;
    updateLottery: (id: number, patch: Partial<Lottery>) => void;
    removeLottery: (id: number) => void;
    refreshLotteries: () => Promise<void>;
};

const LotteriesContext = createContext<LotteriesContextType | undefined>(undefined);

export const LotteriesProvider = ({children}: { children: ReactNode }) => {
    const [lotteries, setLotteries] = useState<Lottery[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchLotteries = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`https://5.129.199.72:9090/lottery/draws`);

            if (!response.ok) {
                throw new Error(`Ошибка: ${response.status}`);
            }

            const data = await response.json();
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
            loading,
            error,
            setLotteries,
            addLottery,
            updateLottery,
            removeLottery,
            refreshLotteries
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

