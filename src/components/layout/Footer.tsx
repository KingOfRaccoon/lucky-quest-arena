
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white/90 backdrop-blur-md border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">LotteryPlus</h3>
            <p className="text-gray-500 text-sm">
              Геймифицированная лотерейная платформа с традиционными лотереями и инновационными стратегическими играми.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Навигация</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-500 hover:text-primary">Главная</Link>
              </li>
              <li>
                <Link to="/lotteries" className="text-gray-500 hover:text-primary">Список лотерей</Link>
              </li>
              <li>
                <Link to="/battle-pass" className="text-gray-500 hover:text-primary">Battle Pass</Link>
              </li>
              <li>
                <Link to="/mini-games" className="text-gray-500 hover:text-primary">Мини-игры</Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-500 hover:text-primary">Профиль</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Правовая информация</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/terms" className="text-gray-500 hover:text-primary">Условия использования</Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-500 hover:text-primary">Политика конфиденциальности</Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-500 hover:text-primary">Часто задаваемые вопросы</Link>
              </li>
              <li>
                <Link to="/support" className="text-gray-500 hover:text-primary">Поддержка</Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-6 text-center text-sm text-gray-500">
          <p>© {currentYear} LotteryPlus. Все права защищены.</p>
          <p className="mt-1">ИНН: 1234567890 | Лицензия на организацию лотерей №123456789</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
