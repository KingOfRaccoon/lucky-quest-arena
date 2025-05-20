import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/UserContext";
import { API_BASE_URL } from "@/config/api";
import BaseLayout from "@/components/layout/BaseLayout";

interface Hero {
  id: number;
  game_id: number;
  name: string;
  image_url: string;
  strength: number;
  dexterity: number;
  intelligence: number;
}

interface Monster {
  id: number;
  game_id: number;
  type: number;
  power: number;
}

interface GameParams {
  heroes: Hero[];
  picks: number[];
  monsters: Monster[];
  end_time: string;
}

interface GameResults extends GameParams {
  battles_won: boolean[];
  reward_credits: number;
}

const BossMonsterGame = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUser();
  const { gameId } = useParams();

  const [betAmount, setBetAmount] = useState<number>(10);
  const [gameState, setGameState] = useState<"initial" | "playing" | "results">("initial");
  const [gameParams, setGameParams] = useState<GameParams | null>(null);
  const [gameResults, setGameResults] = useState<GameResults | null>(null);
  const [selectedHeroes, setSelectedHeroes] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const startGame = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://5.129.199.72:9090/minigame/play`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profile_id: user?.id || 1,
          credits_price: betAmount,
        }),
      });

      if (!response.ok) {
        throw new Error("Ошибка при запуске игры");
      }

      const data = await response.json();
      navigate(`/mini-games/5/${data.game_id}`);
      fetchGameParams(data.game_id);
      setGameState("playing");
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось начать игру. Попробуйте позже.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGameParams = async (id: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://5.129.199.72:9090/minigame/params/${id}`);

      if (!response.ok) {
        throw new Error("Ошибка при получении параметров игры");
      }

      const data = await response.json();
      setGameParams(data);

      // Вычисляем оставшееся время
      const endTime = new Date(data.end_time).getTime();
      updateTimeLeft(endTime);

      // Устанавливаем таймер для обновления оставшегося времени
      const intervalId = setInterval(() => {
        const remaining = updateTimeLeft(endTime);
        if (remaining <= 0) {
          clearInterval(intervalId);
          fetchGameResults(id);
        }
      }, 1000);

      return () => clearInterval(intervalId);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось получить параметры игры. Попробуйте позже.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateTimeLeft = (endTime: number): number => {
    const now = new Date().getTime();
    const distance = endTime - now;

    if (distance <= 0) {
      setTimeLeft("Время истекло");
      return 0;
    }

    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    setTimeLeft(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
    return distance;
  };

  const toggleHeroSelection = (heroId: number) => {
    setSelectedHeroes(prev => {
      // Если герой уже выбран, удаляем его из выбранных
      if (prev.includes(heroId)) {
        return prev.filter(id => id !== heroId);
      }

      // Если выбрано уже 3 героя и пытаемся добавить еще одного, заменяем первого выбранного
      if (prev.length >= 3) {
        return [...prev.slice(1), heroId];
      }

      // Добавляем героя к выбранным
      return [...prev, heroId];
    });
  };

  const submitPicks = async () => {
    if (selectedHeroes.length !== 3 || !gameId) {
      toast({
        title: "Ошибка",
        description: "Необходимо выбрать трех героев",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`https://5.129.199.72:9090/minigame/picks/${gameId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          heroes_ids: selectedHeroes,
        }),
      });

      if (!response.ok) {
        throw new Error("Ошибка при отправке выбранных героев");
      }

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Успешно",
          description: "Ваши герои готовы к бою!",
        });
      } else {
        toast({
          title: "Ошибка",
          description: "Не удалось отправить выбранных героев",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при отправке данных. Попробуйте позже.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGameResults = async (id: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://5.129.199.72:9090/minigame/results/${id}`);

      if (!response.ok) {
        throw new Error("Ошибка при получении результатов игры");
      }

      const data = await response.json();
      setGameResults(data);
      setGameState("results");
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось получить результаты игры. Попробуйте позже.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (gameId) {
      fetchGameParams(Number(gameId));
      setGameState("playing");
    }
  }, [gameId]);

  // Рендеринг начального экрана
  if (gameState === "initial") {
    return (
      <BaseLayout>
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-6">Босс Монстр</h1>
          <div className="max-w-md mx-auto bg-card p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold mb-4">Начать новую игру</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Ваша ставка (кредиты)</label>
              <input
                type="number"
                min="1"
                value={betAmount}
                onChange={(e) => setBetAmount(Number(e.target.value))}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <Button
              onClick={startGame}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Загрузка..." : "Начать игру"}
            </Button>
          </div>
        </div>
      </BaseLayout>
    );
  }

  // Рендеринг игрового экрана
  if (gameState === "playing" && gameParams) {
    return (
      <BaseLayout>
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-6">Босс Монстр - Битва</h1>

          <div className="mb-4 p-2 bg-muted rounded-md text-center">
            <p className="font-medium">До окончания битвы осталось: {timeLeft}</p>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Ваши герои</h2>
              <div className="grid grid-cols-3 gap-2">
                {gameParams.heroes.map(hero => (
                  <Card
                    key={hero.id}
                    className={`p-2 cursor-pointer transition-all ${selectedHeroes.includes(hero.id) ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => toggleHeroSelection(hero.id)}
                  >
                    <div className="aspect-square mb-2 bg-muted rounded-md overflow-hidden">
                      <img
                        src={hero.image_url || '/placeholder.svg'}
                        alt={hero.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-medium text-sm">{hero.name}</h3>
                    <div className="grid grid-cols-3 gap-1 mt-2 text-xs">
                      <div className="flex flex-col items-center">
                        <span className="text-muted-foreground">СИЛ</span>
                        <span>{hero.strength}</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-muted-foreground">ЛОВ</span>
                        <span>{hero.dexterity}</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-muted-foreground">ИНТ</span>
                        <span>{hero.intelligence}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Монстры</h2>
              <div className="grid grid-cols-3 gap-2">
                {gameParams.monsters.map(monster => (
                  <Card key={monster.id} className="p-2">
                    <div className="aspect-square mb-2 bg-muted rounded-md overflow-hidden">
                      <img
                        src={`/monster-type-${monster.type}.svg`}
                        alt={`Монстр #${monster.id}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.svg';
                        }}
                      />
                    </div>
                    <h3 className="font-medium text-sm">Монстр #{monster.id}</h3>
                    <div className="mt-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Сила:</span>
                        <span>???</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              onClick={submitPicks}
              disabled={isLoading || selectedHeroes.length !== 3}
              size="lg"
              className="px-8"
            >
              {isLoading ? "Отправка..." : "В бой!"}
            </Button>
          </div>
        </div>
      </BaseLayout>
    );
  }

  // Рендеринг экрана с результатами
  if (gameState === "results" && gameResults) {
    return (
      <BaseLayout>
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-6">Босс Монстр - Результаты</h1>

          <div className="mb-6 p-4 bg-card rounded-xl shadow-md text-center">
            <h2 className="text-xl font-semibold mb-2">Итоги битвы</h2>
            <p className="text-3xl font-bold mb-4">
              {gameResults.battles_won.filter(Boolean).length > gameResults.battles_won.length / 2
                ? "Победа!"
                : "Поражение!"}
            </p>
            <p className="text-lg">
              Ваша награда: <span className="font-bold text-primary">{gameResults.reward_credits} кредитов</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Ваши герои</h2>
              <div className="grid grid-cols-3 gap-2">
                {gameResults.heroes
                  .filter(hero => gameResults.picks.includes(hero.id))
                  .map((hero, index) => (
                    <Card
                      key={hero.id}
                      className={`p-2 ${gameResults.battles_won[index] ? 'bg-green-50' : 'bg-red-50'}`}
                    >
                      <div className="aspect-square mb-2 bg-muted rounded-md overflow-hidden">
                        <img
                          src={hero.image_url || '/placeholder.svg'}
                          alt={hero.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="font-medium text-sm">{hero.name}</h3>
                      <div className="grid grid-cols-3 gap-1 mt-2 text-xs">
                        <div className="flex flex-col items-center">
                          <span className="text-muted-foreground">СИЛ</span>
                          <span>{hero.strength}</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-muted-foreground">ЛОВ</span>
                          <span>{hero.dexterity}</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-muted-foreground">ИНТ</span>
                          <span>{hero.intelligence}</span>
                        </div>
                      </div>
                      <div className="mt-2 text-center">
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${gameResults.battles_won[index] ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                          {gameResults.battles_won[index] ? 'Победа' : 'Поражение'}
                        </span>
                      </div>
                    </Card>
                  ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Монстры</h2>
              <div className="grid grid-cols-3 gap-2">
                {gameResults.monsters.slice(0, 3).map((monster, index) => (
                  <Card
                    key={monster.id}
                    className={`p-2 ${!gameResults.battles_won[index] ? 'bg-green-50' : 'bg-red-50'}`}
                  >
                    <div className="aspect-square mb-2 bg-muted rounded-md overflow-hidden">
                      <img
                        src={`/monster-type-${monster.type}.svg`}
                        alt={`Монстр #${monster.id}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.svg';
                        }}
                      />
                    </div>
                    <h3 className="font-medium text-sm">Монстр #{monster.id}</h3>
                    <div className="mt-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Сила:</span>
                        <span>{monster.power}</span>
                      </div>
                    </div>
                    <div className="mt-2 text-center">
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${!gameResults.battles_won[index] ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                        {!gameResults.battles_won[index] ? 'Победа' : 'Поражение'}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              onClick={() => {
                setGameState("initial");
                setSelectedHeroes([]);
                setGameParams(null);
                setGameResults(null);
                navigate("/?tab=minigames");
              }}
              size="lg"
              className="px-8"
            >
              Играть снова
            </Button>
          </div>
        </div>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout>
      <div className="container mx-auto p-4 text-center">
        <p>Загрузка...</p>
      </div>
    </BaseLayout>
  );
};

export default BossMonsterGame;

