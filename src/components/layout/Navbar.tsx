
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Ticket, 
  User, 
  Coins, 
  Crown
} from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Test data for user
  const user = {
    username: "Player123",
    balance: 2500,
    bonusBalance: 1200,
    vipLevel: 3,
  };

  return (
    <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="bg-primary text-white p-1.5 rounded">
              <Crown size={20} />
            </span>
            <span className="font-bold text-xl">LotteryPlus</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-primary font-medium flex items-center space-x-1">
              <LayoutDashboard size={18} />
              <span>Главная</span>
            </Link>
            <Link to="/lotteries" className="text-gray-700 hover:text-primary font-medium flex items-center space-x-1">
              <Ticket size={18} />
              <span>Лотереи</span>
            </Link>
            <Link to="/battle-pass" className="text-gray-700 hover:text-primary font-medium flex items-center space-x-1">
              <Crown size={18} />
              <span>Battle Pass</span>
            </Link>
          </nav>

          {/* User Controls Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Coins size={16} className="text-yellow-500" />
                <span className="font-semibold">{user.balance}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Coins size={16} className="text-purple-500" />
                <span className="font-semibold">{user.bonusBalance}</span>
              </div>
              <div className="flex items-center space-x-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-2 py-0.5 rounded text-xs">
                <Crown size={14} />
                <span>VIP {user.vipLevel}</span>
              </div>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/profile">
                <User size={16} className="mr-1" />
                <span>Профиль</span>
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/buy-currency">
                <Coins size={16} className="mr-1" />
                <span>Купить валюту</span>
              </Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b">
          <div className="container mx-auto px-4 py-2 space-y-2">
            <Link to="/" className="block py-2 text-gray-700 hover:text-primary font-medium">
              Главная
            </Link>
            <Link to="/lotteries" className="block py-2 text-gray-700 hover:text-primary font-medium">
              Лотереи
            </Link>
            <Link to="/battle-pass" className="block py-2 text-gray-700 hover:text-primary font-medium">
              Battle Pass
            </Link>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-2">
                <Coins size={16} className="text-yellow-500" />
                <span className="font-semibold">{user.balance}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Coins size={16} className="text-purple-500" />
                <span className="font-semibold">{user.bonusBalance}</span>
              </div>
              <div className="flex items-center space-x-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-2 py-0.5 rounded text-xs">
                <Crown size={14} />
                <span>VIP {user.vipLevel}</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="flex-1" asChild>
                <Link to="/profile">
                  <User size={16} className="mr-1" />
                  <span>Профиль</span>
                </Link>
              </Button>
              <Button size="sm" className="flex-1" asChild>
                <Link to="/buy-currency">
                  <Coins size={16} className="mr-1" />
                  <span>Купить валюту</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
