
import { useState } from "react";
import BaseLayout from "@/components/layout/BaseLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Crown, Gift, Clock, CheckCircle, LayoutList } from "lucide-react";
import { user, battlePassLevels, dailyTasks, weeklyTasks } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

const BattlePass = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("rewards");
  
  // Calculate current level progress
  const currentLevel = battlePassLevels.find(level => level.level === user.battlePassLevel);
  const nextLevel = battlePassLevels.find(level => level.level === user.battlePassLevel + 1);
  const progress = nextLevel
    ? ((user.battlePassXp - (currentLevel?.xpRequired || 0)) / 
       (nextLevel.xpRequired - (currentLevel?.xpRequired || 0))) * 100
    : 100;

  // Function to claim rewards
  const handleClaimReward = () => {
    toast({
      title: "Награда получена!",
      description: "Проверьте свой профиль для деталей"
    });
  };

  return (
    <BaseLayout>
      <section className="mb-12">
        <div className="bg-gradient-to-r from-primary/80 to-accent/80 rounded-lg text-white p-6 md:p-10">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Crown className="h-8 w-8" />
                <h1 className="text-3xl font-bold">Battle Pass</h1>
              </div>
              <p className="mb-6">
                Выполняйте задания, получайте опыт, повышайте уровень и получайте эксклюзивные награды!
              </p>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span>Текущий уровень:</span>
                  <span className="font-bold">{user.battlePassLevel}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Опыт:</span>
                  <span className="font-bold">{user.battlePassXp} / {nextLevel?.xpRequired || "MAX"}</span>
                </div>
                <Progress value={progress} className="h-2 bg-white/20 mb-2" />
                {nextLevel && (
                  <div className="text-center text-sm">
                    Следующая награда: {nextLevel.reward}
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-white/10 backdrop-blur-sm text-white border-0">
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-2">
                    <Gift className="h-5 w-5" />
                    <CardTitle>Выполнено заданий</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">{user.completedQuests}</div>
                  <CardDescription className="text-white/70">из {dailyTasks.length + weeklyTasks.length}</CardDescription>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-sm text-white border-0">
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5" />
                    <CardTitle>Завершённые уровни</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">{user.battlePassLevel}</div>
                  <CardDescription className="text-white/70">из {battlePassLevels.length}</CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section>
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 grid grid-cols-2">
            <TabsTrigger value="rewards" className="flex items-center">
              <Gift className="mr-2 h-4 w-4" /> Награды
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center">
              <LayoutList className="mr-2 h-4 w-4" /> Задания
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="rewards" className="mt-0">
            <div className="bg-muted/30 rounded-lg p-8 mb-8 overflow-x-auto">
              <div className="flex min-w-[800px]">
                {battlePassLevels.map((level, index) => {
                  const isCompleted = level.level <= user.battlePassLevel;
                  const isCurrent = level.level === user.battlePassLevel + 1;
                  
                  return (
                    <div key={level.level} className="flex-1 px-2">
                      <div className="relative">
                        {index > 0 && (
                          <div 
                            className={`absolute h-0.5 top-6 -left-1/2 right-1/2 ${
                              isCompleted ? 'bg-primary' : 'bg-gray-300'
                            }`}
                          ></div>
                        )}
                        <div 
                          className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto border-2 ${
                            isCompleted 
                              ? 'bg-primary border-primary text-white' 
                              : isCurrent
                                ? 'border-primary text-primary'
                                : 'border-gray-300 text-gray-400'
                          }`}
                        >
                          {level.level}
                        </div>
                      </div>
                      
                      <div className={`mt-4 p-3 rounded-lg ${
                        isCompleted 
                          ? 'bg-primary/10' 
                          : isCurrent
                            ? 'bg-gray-100 border border-primary/30'
                            : 'bg-gray-100'
                      }`}>
                        <div className="text-center mb-2">
                          <Badge variant={isCompleted ? "default" : "outline"}>
                            Уровень {level.level}
                          </Badge>
                        </div>
                        <div className="text-center mb-2">
                          <span className="text-sm font-medium">{level.reward}</span>
                        </div>
                        <div className="text-center text-xs text-muted-foreground mb-3">
                          {level.xpRequired} XP
                        </div>
                        
                        {isCompleted ? (
                          <Button variant="default" size="sm" className="w-full" disabled>
                            Получено
                          </Button>
                        ) : isCurrent && progress >= 100 ? (
                          <Button variant="default" size="sm" className="w-full" onClick={handleClaimReward}>
                            Получить
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm" className="w-full" disabled>
                            Заблокировано
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Ограниченное время
                </CardTitle>
                <CardDescription>
                  Battle Pass активен до 31 июля 2025
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  По окончании сезона несобранные награды будут автоматически добавлены в ваш профиль, если вы достигли соответствующего уровня. Прогресс будет сброшен, и начнётся новый сезон Battle Pass.
                </p>
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2">Совет</h3>
                  <p className="text-sm text-muted-foreground">
                    Выполняйте ежедневные и еженедельные задания, чтобы быстрее повышать свой уровень Battle Pass и получать больше наград. Участие в лотереях также даёт дополнительный опыт.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tasks" className="mt-0">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Ежедневные задания</CardTitle>
                <CardDescription>Сбрасываются каждый день в 00:00</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dailyTasks.map((task) => (
                    <div key={task.id} className="bg-muted/30 p-4 rounded-lg">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{task.title}</h3>
                          <p className="text-sm text-muted-foreground">{task.description}</p>
                        </div>
                        <div className="mt-2 sm:mt-0 flex items-center">
                          <Badge variant={task.completed ? "default" : "outline"} className={task.completed ? "bg-green-500" : ""}>
                            {task.completed ? "Выполнено" : `${task.progress}/${task.total}`}
                          </Badge>
                        </div>
                      </div>
                      
                      <Progress value={(task.progress / task.total) * 100} className="h-2 mb-3" />
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Gift className="h-4 w-4 text-primary mr-1" />
                          <span className="text-sm font-medium">{task.reward}</span>
                        </div>
                        
                        <Button 
                          size="sm"
                          variant={task.completed ? "default" : "outline"}
                          disabled={!task.completed}
                          onClick={handleClaimReward}
                        >
                          {task.completed ? "Получить награду" : "Выполните задание"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Еженедельные задания</CardTitle>
                <CardDescription>Сбрасываются каждый понедельник в 00:00</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {weeklyTasks.map((task) => (
                    <div key={task.id} className="bg-muted/30 p-4 rounded-lg">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{task.title}</h3>
                          <p className="text-sm text-muted-foreground">{task.description}</p>
                        </div>
                        <div className="mt-2 sm:mt-0 flex items-center">
                          <Badge variant={task.completed ? "default" : "outline"} className={task.completed ? "bg-green-500" : ""}>
                            {task.completed ? "Выполнено" : `${task.progress}/${task.total}`}
                          </Badge>
                        </div>
                      </div>
                      
                      <Progress value={(task.progress / task.total) * 100} className="h-2 mb-3" />
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Gift className="h-4 w-4 text-primary mr-1" />
                          <span className="text-sm font-medium">{task.reward}</span>
                        </div>
                        
                        <Button 
                          size="sm"
                          variant={task.completed ? "default" : "outline"}
                          disabled={!task.completed}
                          onClick={handleClaimReward}
                        >
                          {task.completed ? "Получить награду" : "Выполните задание"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </BaseLayout>
  );
};

export default BattlePass;
