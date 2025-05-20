import React, { createContext, useContext, useState, ReactNode } from "react";
import { miniGames as mockMiniGames } from "@/data/mockData";

// Тип одной мини-игры
export type MiniGame = typeof mockMiniGames[number];

type MiniGamesContextType = {
  miniGames: MiniGame[];
  setMiniGames: (miniGames: MiniGame[]) => void;
  addMiniGame: (miniGame: MiniGame) => void;
  updateMiniGame: (id: number, patch: Partial<MiniGame>) => void;
  removeMiniGame: (id: number) => void;
};

const MiniGamesContext = createContext<MiniGamesContextType | undefined>(undefined);

export const MiniGamesProvider = ({ children }: { children: ReactNode }) => {
  const [miniGames, setMiniGames] = useState<MiniGame[]>(mockMiniGames);

  const addMiniGame = (miniGame: MiniGame) => setMiniGames(prev => [...prev, miniGame]);
  const updateMiniGame = (id: number, patch: Partial<MiniGame>) =>
    setMiniGames(prev =>
      prev.map(mg =>
        mg.id === id ? { ...mg, ...patch, id: mg.id } as typeof mg : mg
      )
    );
  const removeMiniGame = (id: number) => setMiniGames(prev => prev.filter(mg => mg.id !== id));

  return (
    <MiniGamesContext.Provider value={{ miniGames, setMiniGames, addMiniGame, updateMiniGame, removeMiniGame }}>
      {children}
    </MiniGamesContext.Provider>
  );
};

export function useMiniGames() {
  const ctx = useContext(MiniGamesContext);
  if (!ctx) throw new Error("useMiniGames must be used within MiniGamesProvider");
  return ctx;
}