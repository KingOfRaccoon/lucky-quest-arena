import { useContext } from "react";
import { BalanceContext } from "@/BalanceContext";

// Хук должен импортировать именно созданный контекст
export const useBalance = () => {
  const ctx = useContext(BalanceContext);
  if (!ctx) throw new Error("useBalance must be used within BalanceProvider");
  return ctx;
};