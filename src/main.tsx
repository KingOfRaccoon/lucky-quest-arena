import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import { LotteriesProvider } from "@/LotteriesContext.tsx";
import { BalanceProvider } from "@/BalanceContext.tsx";
import { MiniGamesProvider } from "@/MiniGamesContext";
import { BattlePassProvider } from "@/BattlePassContext";
import { UserTicketsProvider } from "@/UserTicketsContext";
import { DailyTasksProvider, WeeklyTasksProvider } from "@/TasksContext";
import { VipLevelsProvider } from "@/VIPLevelsContext";
import { UserProvider } from "@/UserContext";

createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
        <UserProvider>
            <VipLevelsProvider>
                <LotteriesProvider>
                    <MiniGamesProvider>
                        <BattlePassProvider>
                            <UserTicketsProvider>
                                <DailyTasksProvider>
                                    <WeeklyTasksProvider>
                                        <BalanceProvider>
                                            <App />
                                        </BalanceProvider>
                                    </WeeklyTasksProvider>
                                </DailyTasksProvider>
                            </UserTicketsProvider>
                        </BattlePassProvider>
                    </MiniGamesProvider>
                </LotteriesProvider>
            </VipLevelsProvider>
        </UserProvider>
    </BrowserRouter>
);
