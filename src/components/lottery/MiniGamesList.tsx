
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import MiniGameCard from "./MiniGameCard";

const miniGames = [
  {
    id: 1,
    title: "Счастливое Колесо",
    description: "Крутите колесо и выигрывайте бонусы во время ожидания розыгрыша",
    image: "/placeholder.svg"
  },
  {
    id: 2,
    title: "Сокровища Пирамиды",
    description: "Исследуйте пирамиду в поисках скрытых сокровищ и бонусов",
    image: "/placeholder.svg"
  },
  {
    id: 3,
    title: "Космические Гонки",
    description: "Управляйте космическим кораблем и собирайте бонусы в космосе",
    image: "/placeholder.svg"
  }
];

const MiniGamesList = () => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {miniGames.map(game => (
          <MiniGameCard key={game.id} {...game} />
        ))}
      </div>
      
      <div className="text-center mt-6">
        <Button variant="outline" asChild>
          <Link to="/mini-games">
            Все мини-игры
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </>
  );
};

export default MiniGamesList;
