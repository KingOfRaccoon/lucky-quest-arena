import React, { createContext, useState, type ReactNode } from "react";

// Обычно получаем данные из API или localStorage, но сейчас инициализируем из mockData
const START_BALANCE = 2000; // аналогично user.balance
const START_BONUS = 1200;

type BalanceContextType = {
  balance: number;
  bonusBalance: number;
  setBalance: (val: number) => void;
  setBonusBalance: (val: number) => void;
  addBalance: (amount: number) => void;
  addBonus: (amount: number) => void;
};

export const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export const BalanceProvider = ({ children }: { children: ReactNode }) => {
  const [balance, setBalance] = useState<number>(START_BALANCE);
  const [bonusBalance, setBonusBalance] = useState<number>(START_BONUS);

  const addBalance = (amount: number) => setBalance((b) => b + amount);
  const addBonus = (amount: number) => setBonusBalance((b) => b + amount);

  return (
    <BalanceContext.Provider
      value={{ balance, setBalance, bonusBalance, setBonusBalance, addBalance, addBonus }}
    >
      {children}
    </BalanceContext.Provider>
  );
};
