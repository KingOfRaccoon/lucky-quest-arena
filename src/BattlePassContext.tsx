import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { battlePassLevels as mockBattlePassLevels } from "@/data/mockData";

export interface BattlePassReward {
  battlepass_id: number;
  for_vip: boolean;
  name: string;
  reward_str: string;
  image_url: string | null;
  level: number;
  id: number;
  desscription: string;
}

export interface BattlePassData {
  reward: BattlePassReward[];
  start_date: string;
  end_date: string;
}

// Обновленный тип для работы с API
export type BattlePassLevel = BattlePassReward;

type BattlePassContextType = {
  battlePassLevels: BattlePassLevel[];
  setBattlePassLevels: (levels: BattlePassLevel[]) => void;
  updateBattlePassLevel: (level: number, patch: Partial<BattlePassLevel>) => void;
  startDate: string | null;
  endDate: string | null;
  loading: boolean;
  error: string | null;
  refreshBattlePass: () => Promise<void>;
};

const BattlePassContext = createContext<BattlePassContextType | undefined>(undefined);

export const BattlePassProvider = ({ children }: { children: ReactNode }) => {
  const [battlePassLevels, setBattlePassLevels] = useState<BattlePassLevel[]>([]);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBattlePassData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://5.129.199.72:9090/battlepass/view`, {
        method: 'POST'
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("API Error Response:", response.status, errorData);
        throw new Error(`Ошибка загрузки данных Battle Pass: ${response.status} ${response.statusText}`);
      }

      const data: BattlePassData = await response.json();

      // Устанавливаем уровни Battle Pass
      setBattlePassLevels(data.reward);
      setStartDate(data.start_date);
      setEndDate(data.end_date);
    } catch (err) {
      console.error('Ошибка при загрузке данных Battle Pass:', err);
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка при загрузке данных Battle Pass');

      // В случае ошибки можно загрузить мок-данные для разработки
      console.warn("Загрузка мок-данных Battle Pass из-за ошибки API.");
      setBattlePassLevels(mockBattlePassLevels as unknown as BattlePassLevel[]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchBattlePassData();
  }, []);

  const updateBattlePassLevel = (level: number, patch: Partial<BattlePassLevel>) =>
    setBattlePassLevels(prev =>
      prev.map(lv =>
        lv.level === level ? { ...lv, ...patch, level: lv.level } as typeof lv : lv
      )
    );

  const refreshBattlePass = async () => {
    await fetchBattlePassData();
  };

  return (
    <BattlePassContext.Provider
      value={{
        battlePassLevels,
        setBattlePassLevels,
        updateBattlePassLevel,
        startDate,
        endDate,
        loading,
        error,
        refreshBattlePass
      }}
    >
      {children}
    </BattlePassContext.Provider>
  );
};

export function useBattlePass() {
  const ctx = useContext(BattlePassContext);
  if (!ctx) throw new Error("useBattlePass must be used within BattlePassProvider");
  return ctx;
}
