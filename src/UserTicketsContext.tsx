import React, { createContext, useContext, useState, ReactNode } from "react";
import { userTickets as mockUserTickets } from "@/data/mockData";

export type UserTicket = typeof mockUserTickets[number];

type UserTicketsContextType = {
  userTickets: UserTicket[];
  setUserTickets: (tickets: UserTicket[]) => void;
  addUserTicket: (ticket: UserTicket) => void;
  updateUserTicket: (id: number, patch: Partial<UserTicket>) => void;
  removeUserTicket: (id: number) => void;
};

const UserTicketsContext = createContext<UserTicketsContextType | undefined>(undefined);

export const UserTicketsProvider = ({ children }: { children: ReactNode }) => {
  const [userTickets, setUserTickets] = useState<UserTicket[]>(mockUserTickets);

  const addUserTicket = (ticket: UserTicket) => setUserTickets(prev => [...prev, ticket]);
  const updateUserTicket = (id: number, patch: Partial<UserTicket>) =>
    setUserTickets(prev =>
      prev.map(t =>
        t.id === id ? { ...t, ...patch, id: t.id } as typeof t : t
      )
    );
  const removeUserTicket = (id: number) => setUserTickets(prev => prev.filter(t => t.id !== id));

  return (
    <UserTicketsContext.Provider value={{ userTickets, setUserTickets, addUserTicket, updateUserTicket, removeUserTicket }}>
      {children}
    </UserTicketsContext.Provider>
  );
};

export function useUserTickets() {
  const ctx = useContext(UserTicketsContext);
  if (!ctx) throw new Error("useUserTickets must be used within UserTicketsProvider");
  return ctx;
}