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

// Общий тип для объединенного контекста
type TasksContextType = DailyTasksContextType & WeeklyTasksContextType;

const DailyTasksContext = createContext<DailyTasksContextType | undefined>(undefined);
const WeeklyTasksContext = createContext<WeeklyTasksContextType | undefined>(undefined);
const TasksContext = createContext<TasksContextType | undefined>(undefined);

// Объединенный провайдер для всех задач
export const TasksProvider = ({ children }: { children: ReactNode }) => {
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>(mockDailyTasks);
  const [weeklyTasks, setWeeklyTasks] = useState<WeeklyTask[]>(mockWeeklyTasks);

  const updateDailyTask = (id: number, patch: Partial<DailyTask>) =>
    setDailyTasks(prev =>
      prev.map(t =>
        t.id === id ? { ...t, ...patch, id: t.id } as typeof t : t
      )
    );

  const updateWeeklyTask = (id: number, patch: Partial<WeeklyTask>) =>
    setWeeklyTasks(prev =>
      prev.map(t =>
        t.id === id ? { ...t, ...patch, id: t.id } as typeof t : t
      )
    );

  // Создаем единый объект значений контекста
  const contextValue: TasksContextType = {
    dailyTasks,
    setDailyTasks,
    updateDailyTask,
    weeklyTasks,
    setWeeklyTasks,
    updateWeeklyTask
  };

  return (
    <TasksContext.Provider value={contextValue}>
      {children}
    </TasksContext.Provider>
  );
};


// Общий хук для доступа ко всем задачам
export function useTasks() {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error("useTasks must be used within TasksProvider");
  return ctx;
}