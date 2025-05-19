import Index from "@/pages/Index";
import LotteriesList from "@/pages/LotteriesList";
import LotteryDetails from "@/pages/LotteryDetails";
import LotteryResults from "@/pages/LotteryResults";
import UserProfile from "@/pages/UserProfile";
import MiniGames from "@/pages/MiniGames";
import BattlePass from "@/pages/BattlePass";
import BuyCurrency from "@/pages/BuyCurrency";
import NotFound from "@/pages/NotFound";
import WordleGamePage from "@/pages/WordleGame";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/lotteries" element={<LotteriesList />} />
        <Route path="/lottery/:id" element={<LotteryDetails />} />
        <Route path="/results" element={<LotteryResults />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/mini-games" element={<MiniGames />} />
        <Route path="/mini-game/4" element={<WordleGamePage />} />
        <Route path="/mini-game/:id" element={<MiniGames />} />
        <Route path="/battle-pass" element={<BattlePass />} />
        <Route path="/buy-currency" element={<BuyCurrency />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
