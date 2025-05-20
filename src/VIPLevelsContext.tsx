
import React, { createContext, useContext, useState, ReactNode } from "react";
import { vipLevels as mockVipLevels } from "@/data/mockData";

export type VipLevel = typeof mockVipLevels[number];

type VipLevelsContextType = {
  vipLevels: VipLevel[];
  setVipLevels: (levels: VipLevel[]) => void;
  updateVipLevel: (level: number, patch: Partial<VipLevel>) => void;
};

// Create a default context value to avoid null checks
const defaultContextValue: VipLevelsContextType = {
  vipLevels: mockVipLevels,
  setVipLevels: () => {},
  updateVipLevel: () => {},
};

const VipLevelsContext = createContext<VipLevelsContextType>(defaultContextValue);

export const VipLevelsProvider = ({ children }: { children: ReactNode }) => {
  const [vipLevels, setVipLevels] = useState<VipLevel[]>(mockVipLevels);

  const updateVipLevel = (level: number, patch: Partial<VipLevel>) =>
    setVipLevels(prev =>
      prev.map(lv =>
        lv.level === level ? { ...lv, ...patch, level: lv.level } as typeof lv : lv
      )
    );

  return (
    <VipLevelsContext.Provider value={{ vipLevels, setVipLevels, updateVipLevel }}>
      {children}
    </VipLevelsContext.Provider>
  );
};

export function useVipLevels() {
  const ctx = useContext(VipLevelsContext);
  if (!ctx) throw new Error("useVipLevels must be used within VipLevelsProvider");
  return ctx;
}
