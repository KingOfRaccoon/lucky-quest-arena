import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { battlePassLevels as mockBattlePassLevels } from "@/data/mockData";
import { post } from "@/services/api.ts";

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
      // Заменяем прямой вызов fetch на вызов через api-сервис с логированием
      const data = await post<BattlePassData>('/battlepass/view', {});

      setBattlePassLevels(data.reward);
      setStartDate(data.start_date);
      setEndDate(data.end_date);
    } catch (err) {
      console.error('Ошибка при загрузке Battle Pass:', err);
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка при загрузке Battle Pass');

      // В случае ошибки, используем мок-данные
      console.warn("Загрузка мок-данных Battle Pass из-за ошибки API");
      setBattlePassLevels(mockBattlePassLevels as unknown as BattlePassLevel[]);
      const now = new Date();
      setStartDate(new Date(now.getFullYear(), now.getMonth(), 1).toISOString());
      setEndDate(new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchBattlePassData();
  }, []);

  const updateBattlePassLevel = (level: number, patch: Partial<BattlePassLevel>) => {
    setBattlePassLevels(prevLevels =>
      prevLevels.map(l => (l.level === level ? { ...l, ...patch } : l))
    );
  };

  const refreshBattlePass = fetchBattlePassData;

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
        refreshBattlePass,
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
