
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import BaseLayout from "@/components/layout/BaseLayout";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Trophy, Star } from "lucide-react";
import { useMiniGames } from "@/MiniGamesContext";
import WordleGame from "@/components/mini-games/WordleGame";

const MiniGames = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { miniGames } = useMiniGames();
  const params = useParams();
  const gameId = params.id;
  
  // Check if we should show a specific game
  if (gameId && Number(gameId) === 4) {
    return (
      <BaseLayout>
        <section className="mb-12">
          <h1 className="text-3xl font-bold mb-2">Wordle</h1>
          <p className="text-gray-500 mb-6">
            Угадайте слово из 5 букв за 6 попыток
          </p>
          
          <WordleGame />
        </section>
      </BaseLayout>
    );
  }
  
  // This is a placeholder as we only have one category in the mock data
  // In a real app, you would filter by category
  const filteredGames = miniGames;

  return (
    <BaseLayout>
      <section className="mb-12">
        <h1 className="text-3xl font-bold mb-2">Мини-игры</h1>
        <p className="text-gray-500 mb-6">
          Развлекайтесь и зарабатывайте бонусы во время ожидания результатов лотереи
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredGames.map((game) => (
            <Card key={game.id} className="lottery-card overflow-hidden flex flex-col h-full">
              <div className="aspect-video bg-muted relative">
                <img 
                  src={game.image} 
                  alt={game.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3">
                  <Badge variant="secondary" className="flex items-center shadow-lg bg-white">
                    <Star className="h-3 w-3 fill-yellow-500 text-yellow-500 mr-1" />
                    <span>{game.popularity}</span>
                  </Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle>{game.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{game.description}</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Награда</span>
                    <span className="font-medium text-primary">{game.bonusReward}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Время игры</span>
                    <span className="font-medium flex items-center">
                      <Clock className="mr-1 h-3 w-3" />
                      {game.averagePlayTime}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="mt-auto">
                <Button className="w-full bg-primary text-white hover:bg-primary/90 game-button" asChild>
                  <Link to={`/mini-game/${game.id}`}>
                    Играть
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
      
      {/* Game Mockup Section */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Пример мини-игры</h2>
          
          <Card>
            <CardHeader>
              <CardTitle>Счастливое Колесо</CardTitle>
              <p className="text-muted-foreground">Крутите колесо и выигрывайте призы</p>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 rounded-lg p-4 mb-4 aspect-video flex flex-col items-center justify-center">
                <div className="w-64 h-64 rounded-full border-8 border-primary/50 relative flex items-center justify-center bg-white">
                  <div className="absolute inset-0 rounded-full border-4 border-dashed border-primary/30"></div>
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute top-1/2 left-1/2 -translate-y-1/2 h-1/2 origin-bottom rotate-0 border-r border-gray-300"
                      style={{ transform: `translateX(-50%) rotate(${i * 45}deg)` }}
                    ></div>
                  ))}
                  <div className="w-16 h-16 rounded-full bg-primary shadow-xl flex items-center justify-center">
                    <span className="text-white font-bold">Крутить</span>
                  </div>
                </div>
              </div>
              
              <div className="mb-4 p-4 rounded-lg bg-gray-50">
                <h3 className="font-medium mb-2">Правила игры</h3>
                <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-1">
                  <li>Нажмите на кнопку, чтобы крутить колесо</li>
                  <li>Получите бонусы в зависимости от сектора, на котором остановится колесо</li>
                  <li>Бонусы автоматически зачисляются на ваш счёт</li>
                  <li>Вы можете крутить колесо каждые 2 часа</li>
                </ul>
              </div>
              
              <div className="bg-muted/30 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Возможные призы</h3>
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2 bg-white rounded-lg border text-center">
                    <div className="font-bold text-green-500 mb-1">10</div>
                    <div className="text-xs text-muted-foreground">бонусов</div>
                  </div>
                  <div className="p-2 bg-white rounded-lg border text-center">
                    <div className="font-bold text-green-500 mb-1">20</div>
                    <div className="text-xs text-muted-foreground">бонусов</div>
                  </div>
                  <div className="p-2 bg-white rounded-lg border text-center">
                    <div className="font-bold text-green-500 mb-1">50</div>
                    <div className="text-xs text-muted-foreground">бонусов</div>
                  </div>
                  <div className="p-2 bg-white rounded-lg border text-center">
                    <div className="font-bold text-green-500 mb-1">100</div>
                    <div className="text-xs text-muted-foreground">бонусов</div>
                  </div>
                  <div className="p-2 bg-white rounded-lg border text-center">
                    <div className="font-bold text-primary mb-1">VIP</div>
                    <div className="text-xs text-muted-foreground">+5 XP</div>
                  </div>
                  <div className="p-2 bg-white rounded-lg border text-center">
                    <div className="font-bold text-red-500 mb-1">
                      <Trophy size={16} className="mx-auto" />
                    </div>
                    <div className="text-xs text-muted-foreground">Лотерея</div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full game-button">Начать игру</Button>
            </CardFooter>
          </Card>
        </div>
      </section>
    </BaseLayout>
  );
};

export default MiniGames;
