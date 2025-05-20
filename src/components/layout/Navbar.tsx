import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Ticket, 
  User, 
  Coins, 
  Crown,
  LogIn,
  UserPlus,
  LogOut
} from "lucide-react";
import { useState } from "react";
import { useUser } from "@/UserContext"; // Импортируем useUser

// Функция для форматирования чисел
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    const value = (num / 1000000).toFixed(2);
    return (value.endsWith('.00') ? value.slice(0, -3) : value.replace(/\.0$/, '')) + "м";
  }
  if (num >= 10000) {
    const value = (num / 1000).toFixed(2);
    return (value.endsWith('.00') ? value.slice(0, -3) : value.replace(/\.0$/, '')) + "к";
  }
  return num.toString();
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, loading, logout } = useUser(); // Получаем данные из контекста
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); // Перенаправляем на главную после выхода
    setIsOpen(false); // Закрываем мобильное меню, если открыто
  };

  const renderUserControls = (isMobile: boolean = false) => {
    if (loading) {
      return <span className="text-sm text-gray-600">Загрузка...</span>;
    }

    if (!isAuthenticated || !user) {
      return (
        <div className={`flex ${isMobile ? 'flex-col space-y-2' : 'items-center space-x-2'}`}>
          <Button variant={isMobile ? "default" : "outline"} size="sm" asChild className={isMobile ? "w-full" : ""}>
            <Link to="/#login"> {/* TODO: Заменить на реальный путь к странице логина */}
              <LogIn size={16} className="mr-1" />
              Войти
            </Link>
          </Button>
          <Button variant={isMobile ? "default" : "primary"} size="sm" asChild className={isMobile ? "w-full" : ""}>
            <Link to="/#register"> {/* TODO: Заменить на реальный путь к странице регистрации */}
              <UserPlus size={16} className="mr-1" />
              Регистрация
            </Link>
          </Button>
        </div>
      );
    }

    return (
      <div className={`flex ${isMobile ? 'flex-col space-y-2' : 'items-center space-x-4'}`}>
        <div className={`flex ${isMobile ? 'justify-between w-full py-2' : 'items-center space-x-4'}`}>
          <div className="flex items-center space-x-1" title={`Валюта: ${user.currency}`}>
            <Coins size={16} className="text-yellow-500" />
            <span className="font-semibold">{formatNumber(user.currency)}</span>
          </div>
          <div className="flex items-center space-x-1" title={`Кредиты: ${user.credits}`}>
            <Coins size={16} className="text-purple-500" />
            <span className="font-semibold">{formatNumber(user.credits)}</span>
          </div>
          {user.vip && (
            <div className="flex items-center space-x-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-2 py-0.5 rounded text-xs">
              <Crown size={14} />
              {/* Используем battlepass_lvl для отображения уровня VIP, если пользователь VIP */}
              <span>VIP {user.battlepass_lvl}</span>
            </div>
          )}
        </div>
        <div className={`flex ${isMobile ? 'space-x-2 w-full' : 'items-center space-x-2'}`}>
          <Button variant="outline" size="sm" asChild className={isMobile ? "flex-1" : ""}>
            <Link to="/profile">
              <User size={16} className="mr-1" />
              <span>{user.name.split(' ')[0]}</span> {/* Показываем первое слово имени */}
            </Link>
          </Button>
          <Button size="sm" asChild className={isMobile ? "flex-1" : ""}>
            <Link to="/buy-currency">
              <Coins size={16} className="mr-1" />
              <span>Пополнить</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" onClick={handleLogout} className={isMobile ? "flex-1 text-red-600" : "text-red-600 hover:bg-red-100"}>
            <LogOut size={16} className="mr-1" />
            {isMobile ? <span>Выйти</span> : null}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
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
            {renderUserControls(false)}
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
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-4 space-y-3">
            <Link to="/" onClick={() => setIsOpen(false)} className="block py-2 text-gray-700 hover:text-primary font-medium">
              Главная
            </Link>
            <Link to="/lotteries" onClick={() => setIsOpen(false)} className="block py-2 text-gray-700 hover:text-primary font-medium">
              Лотереи
            </Link>
            <Link to="/battle-pass" onClick={() => setIsOpen(false)} className="block py-2 text-gray-700 hover:text-primary font-medium">
              Battle Pass
            </Link>
            <hr className="my-2"/>
            {renderUserControls(true)}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
