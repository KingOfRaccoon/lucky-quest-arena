import React, { createContext, useContext, useState, ReactNode } from "react";
import { dailyTasks as mockDailyTasks, weeklyTasks as mockWeeklyTasks } from "@/data/mockData";

export type DailyTask = typeof mockDailyTasks[number];
export type WeeklyTask = typeof mockWeeklyTasks[number];

type DailyTasksContextType = {
  dailyTasks: DailyTask[];
  setDailyTasks: (tasks: DailyTask[]) => void;
  updateDailyTask: (id: number, patch: Partial<DailyTask>) => void;
};

type WeeklyTasksContextType = {
  weeklyTasks: WeeklyTask[];
  setWeeklyTasks: (tasks: WeeklyTask[]) => void;
  updateWeeklyTask: (id: number, patch: Partial<WeeklyTask>) => void;
};

const DailyTasksContext = createContext<DailyTasksContextType | undefined>(undefined);
const WeeklyTasksContext = createContext<WeeklyTasksContextType | undefined>(undefined);

export const DailyTasksProvider = ({ children }: { children: ReactNode }) => {
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>(mockDailyTasks);

  const updateDailyTask = (id: number, patch: Partial<DailyTask>) =>
    setDailyTasks(prev =>
      prev.map(t =>
        t.id === id ? { ...t, ...patch, id: t.id } as typeof t : t
      )
    );

  return (
    <DailyTasksContext.Provider value={{ dailyTasks, setDailyTasks, updateDailyTask }}>
      {children}
    </DailyTasksContext.Provider>
  );
};

export const WeeklyTasksProvider = ({ children }: { children: ReactNode }) => {
  const [weeklyTasks, setWeeklyTasks] = useState<WeeklyTask[]>(mockWeeklyTasks);

  const updateWeeklyTask = (id: number, patch: Partial<WeeklyTask>) =>
    setWeeklyTasks(prev =>
      prev.map(t =>
        t.id === id ? { ...t, ...patch, id: t.id } as typeof t : t
      )
    );

  return (
    <WeeklyTasksContext.Provider value={{ weeklyTasks, setWeeklyTasks, updateWeeklyTask }}>
      {children}
    </WeeklyTasksContext.Provider>
  );
};

export function useDailyTasks() {
  const ctx = useContext(DailyTasksContext);
  if (!ctx) throw new Error("useDailyTasks must be used within DailyTasksProvider");
  return ctx;
}
export function useWeeklyTasks() {
  const ctx = useContext(WeeklyTasksContext);
  if (!ctx) throw new Error("useWeeklyTasks must be used within WeeklyTasksProvider");
  return ctx;
}