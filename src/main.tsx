
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from './UserContext';
import { LotteriesProvider } from './LotteriesContext';
import { MiniGamesProvider } from './MiniGamesContext';
import { UserTicketsProvider } from './UserTicketsContext';
import { BalanceProvider } from './BalanceContext';
import { TasksProvider } from './TasksContext';
import { BattlePassProvider } from './BattlePassContext';
import { VipLevelsProvider } from './VIPLevelsContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <BalanceProvider>
          <LotteriesProvider>
            <MiniGamesProvider>
              <UserTicketsProvider>
                <TasksProvider>
                  <BattlePassProvider>
                    <VipLevelsProvider>
                      <App />
                    </VipLevelsProvider>
                  </BattlePassProvider>
                </TasksProvider>
              </UserTicketsProvider>
            </MiniGamesProvider>
          </LotteriesProvider>
        </BalanceProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
