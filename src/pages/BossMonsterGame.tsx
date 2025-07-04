import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/UserContext";
import BaseLayout from "@/components/layout/BaseLayout";
import { post, get } from "@/services/api.ts";

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
  image_url: string;
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
  const location = useLocation();
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

  // Функция для корректного выхода из игры
  const exitGame = useCallback(() => {
    // Сбросить все состояния игры
    setGameState("initial");
    setGameParams(null);
    setGameResults(null);
    setSelectedHeroes([]);
    setTimeLeft("");

    // Перейти на страницу мини-игр
    navigate("/?tab=minigames");
  }, [navigate]);

  // Функция для проверки необходимости принудительного начала с начального экрана
  const resetGameIfNavigatedTo = useCallback(() => {
    // Если приходим с другой страницы, а не с результатов игры,
    // и gameId в URL отсутствует - сбрасываем игру до начального экрана
    const isDirectNavigation = !location.state || !location.state.fromResults;

    if (isDirectNavigation && !gameId) {
      setGameState("initial");
      setGameParams(null);
      setGameResults(null);
      setSelectedHeroes([]);
    }
  }, [gameId, location.state]);

  // Отслеживаем изменение URL и при необходимости сбрасываем игру
  useEffect(() => {
    resetGameIfNavigatedTo();
  }, [location.pathname, resetGameIfNavigatedTo]);

  const startGame = async () => {
    setIsLoading(true);
    try {
      const response = await post<any>(`/minigame/play`, {
          profile_id: user?.id || 1,
          credits_price: betAmount,
        });

      navigate(`/mini-games/5/${response.game_id}`);
      await fetchGameParams(response.game_id);
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
      // Заменяем прямой вызов fetch на вызов через api-сервис с логированием
      const data = await get<GameParams>(`/minigame/params/${id}`);
      setGameParams(data);

      // Вычисляем оставшееся время
      const endTime = new Date(data.end_time).getTime();
      const now = new Date().getTime();
      const timeRemaining = endTime - now;

      console.log('Remaining time (ms):', timeRemaining);

      // Если до окончания игры осталось менее 5 секунд
      if (timeRemaining < 5000) {
        toast({
          title: "Внимание",
          description: "До конца битвы осталось мало времени, вы будете участвовать в следующей.",
          duration: 5000,
        });

        // Время окончания + 3 секунды
        const nextGameStartTime = endTime + 3000;

        // Устанавливаем таймер до следующей игры
        const intervalId = setInterval(() => {
          const remaining = updateTimeLeft(nextGameStartTime);
          if (remaining <= 0) {
            clearInterval(intervalId);

            // Автоматически запускаем новую игру
            startGame();
          }
        }, 1000);

        return () => clearInterval(intervalId);
      }

      // Устанавливаем таймер для обновления оставшегося времени
      const intervalId = setInterval(() => {
        const remaining = updateTimeLeft(endTime + 5000);
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
      // Заменяем прямой вызов fetch на вызов через api-сервис с логированием
      const data = await post<{success: boolean}>(`/minigame/picks/${gameId}`, {
        heroes_ids: selectedHeroes,
      });
      console.log(selectedHeroes);

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
      // Заменяем прямой вызов fetch на вызов через api-сервис с логированием
      const data = await get<GameResults>(`/minigame/results/${id}`);
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

  // Функция для получения текстового описания типа монстра
  const getMonsterTypeString = (typeNum: number): string => {
    switch (typeNum) {
      case 1: return "слабый";
      case 2: return "сильный";
      case 3: return "неуклюжий";
      case 4: return "ловкий";
      case 5: return "глупый";
      case 6: return "умный";
      default: return "неизвестный";
    }
  };

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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Босс Монстр - Битва</h1>
            <Button variant="outline" size="sm" onClick={exitGame}>
              Выйти из игры
            </Button>
          </div>

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
                        src={'/images/heros/' + hero.image_url || '/placeholder.svg'}
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
                        src={`/images/monstres/monster_${monster.type}.jpg`}
                        alt={`Монстр #${monster.id}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.svg';
                        }}
                      />
                    </div>
                    <h3 className="font-medium text-sm">Монстр #{monster.id}</h3>
                    <div className="mt-2 text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Тип:</span>
                        <span className="font-medium">{getMonsterTypeString(monster.type)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Сила:</span>
                        <span>{monster.power}</span>
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
                          src={'/images/heros/'+ hero.image_url || '/placeholder.svg'}
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
                        src={`/images/monstres/monster_${monster.type}.jpg`}
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
                        <span className="text-muted-foreground">Тип:</span>
                        <span className="font-medium">{getMonsterTypeString(monster.type)}</span>
                      </div>
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

          <div className="flex justify-center gap-4">
            <Button
              onClick={() => {
                setGameState("initial");
                setSelectedHeroes([]);
                setGameParams(null);
                setGameResults(null);
                // Переходим на начальный экран игры, но удаляем ID игры из URL
                navigate("/mini-games/5", { replace: true });
              }}
              size="lg"
              className="px-8"
            >
              Играть снова
            </Button>

            <Button
              onClick={exitGame}
              variant="outline"
              size="lg"
              className="px-8"
            >
              Выйти в меню
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

