
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import pages
import Index from "./pages/Index";
import LotteriesList from "./pages/LotteriesList";
import LotteryDetails from "./pages/LotteryDetails";
import LotteryResults from "./pages/LotteryResults";
import BattlePass from "./pages/BattlePass";
import MiniGames from "./pages/MiniGames";
import UserProfile from "./pages/UserProfile";
import BuyCurrency from "./pages/BuyCurrency";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/lotteries" element={<LotteriesList />} />
          <Route path="/lottery/:id" element={<LotteryDetails />} />
          <Route path="/lottery/results/:id" element={<LotteryResults />} />
          <Route path="/battle-pass" element={<BattlePass />} />
          <Route path="/mini-games" element={<MiniGames />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/buy-currency" element={<BuyCurrency />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
