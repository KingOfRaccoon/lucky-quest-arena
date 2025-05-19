
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface NumberSelectionProps {
  numberOptions: number[];
  maxSelectionOptions: number;
  selectedNumbers: number[];
  setSelectedNumbers: (numbers: number[]) => void;
}

const NumberSelection = ({ 
  numberOptions, 
  maxSelectionOptions, 
  selectedNumbers, 
  setSelectedNumbers 
}: NumberSelectionProps) => {
  const { toast } = useToast();

  const handleNumberSelection = (number: number) => {
    if (selectedNumbers.includes(number)) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== number));
    } else {
      if (selectedNumbers.length < maxSelectionOptions) {
        setSelectedNumbers([...selectedNumbers, number]);
      } else {
        toast({
          title: "Максимальное количество чисел",
          description: `Вы можете выбрать максимум ${maxSelectionOptions} чисел`,
          variant: "destructive",
        });
      }
    }
  };

  const handleQuickPick = () => {
    const max = numberOptions.length;
    const picks = [];
    while (picks.length < maxSelectionOptions) {
      const randomNumber = Math.floor(Math.random() * max) + 1;
      if (!picks.includes(randomNumber)) {
        picks.push(randomNumber);
      }
    }
    setSelectedNumbers(picks);
  };

  const handleClearSelection = () => {
    setSelectedNumbers([]);
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4">Выберите {maxSelectionOptions} чисел</h3>
      <div className="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-12 gap-2 mb-4">
        {numberOptions.map((number) => (
          <button
            key={number}
            className={`
              aspect-square text-lg font-semibold rounded-lg flex items-center justify-center
              transition-all
              ${selectedNumbers.includes(number)
                ? 'bg-primary text-white'
                : 'bg-gray-100 hover:bg-gray-200'
              }
            `}
            onClick={() => handleNumberSelection(number)}
          >
            {number}
          </button>
        ))}
      </div>
      
      <div className="flex flex-wrap gap-2 mb-6">
        <Button variant="outline" onClick={handleQuickPick}>
          Случайные числа
        </Button>
        <Button variant="outline" onClick={handleClearSelection}>
          Очистить
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Ваши выбранные числа</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedNumbers.length > 0 ? (
            <div className="flex gap-2">
              {selectedNumbers.map((number) => (
                <div
                  key={number}
                  className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg"
                >
                  {number}
                </div>
              ))}
              {Array(maxSelectionOptions - selectedNumbers.length)
                .fill(null)
                .map((_, index) => (
                  <div
                    key={`empty-${index}`}
                    className="w-10 h-10 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center"
                  >
                    ?
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Выберите {maxSelectionOptions} чисел для покупки билета</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NumberSelection;
