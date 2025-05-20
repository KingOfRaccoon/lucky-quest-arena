import React, { createContext, useContext, useState, ReactNode } from "react";
import { battlePassLevels as mockBattlePassLevels } from "@/data/mockData";

export type BattlePassLevel = typeof mockBattlePassLevels[number];

type BattlePassContextType = {
  battlePassLevels: BattlePassLevel[];
  setBattlePassLevels: (levels: BattlePassLevel[]) => void;
  updateBattlePassLevel: (level: number, patch: Partial<BattlePassLevel>) => void;
};

const BattlePassContext = createContext<BattlePassContextType | undefined>(undefined);

export const BattlePassProvider = ({ children }: { children: ReactNode }) => {
  const [battlePassLevels, setBattlePassLevels] = useState<BattlePassLevel[]>(mockBattlePassLevels);

  const updateBattlePassLevel = (level: number, patch: Partial<BattlePassLevel>) =>
    setBattlePassLevels(prev =>
      prev.map(lv =>
        lv.level === level ? { ...lv, ...patch, level: lv.level } as typeof lv : lv
      )
    );

  return (
    <BattlePassContext.Provider value={{ battlePassLevels, setBattlePassLevels, updateBattlePassLevel }}>
      {children}
    </BattlePassContext.Provider>
  );
};

export function useBattlePass() {
  const ctx = useContext(BattlePassContext);
  if (!ctx) throw new Error("useBattlePass must be used within BattlePassProvider");
  return ctx;
}