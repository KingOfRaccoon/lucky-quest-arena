
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import MiniGameCard from "./MiniGameCard";
import { miniGames } from "@/data/mockData";

const MiniGamesList = () => {
  // Get only first 3 mini games for display on the home page
  const displayedGames = miniGames.slice(0, 3);
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {displayedGames.map(game => (
          <MiniGameCard 
            key={game.id} 
            id={game.id}
            title={game.name} // Changed from name to title to match MiniGameCard props
            description={game.description} 
            image={game.image} 
          />
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
