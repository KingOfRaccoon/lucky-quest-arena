
import React, { useState, useEffect } from 'react';
import { Check, X, Keyboard } from 'lucide-react';
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// List of 5-letter words for the game
const wordList = [
  "РУЧКА", "КНИГА", "СЛОВО", "МЕСТО", "ВРЕМЯ", 
  "ИГРОК", "ЛАМПА", "МУЗЕЙ", "ВЕТЕР", "ЗЕМЛЯ",
  "КОШКА", "СОБОР", "СУМКА", "МЫШКА", "ЛОЖКА",
  "ПОРОГ", "РАДИО", "ТЕПЛО", "ФОРМА", "ЦИФРА"
];

const WordleGame = () => {
  const [secretWord, setSecretWord] = useState("");
  const [attempts, setAttempts] = useState<string[]>([]);
  const [currentAttempt, setCurrentAttempt] = useState("");
  const [gameState, setGameState] = useState<"playing" | "won" | "lost">("playing");
  const maxAttempts = 6;
  
  useEffect(() => {
    // Choose a random word when the component mounts
    startNewGame();
  }, []);
  
  const startNewGame = () => {
    const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
    setSecretWord(randomWord);
    setAttempts([]);
    setCurrentAttempt("");
    setGameState("playing");
  };
  
  const handleGuess = () => {
    // Check if the guess is 5 letters
    if (currentAttempt.length !== 5) {
      toast.error("Слово должно содержать 5 букв");
      return;
    }
    
    // Convert to uppercase for comparison
    const guessUpperCase = currentAttempt.toUpperCase();
    
    // Add to attempts
    const newAttempts = [...attempts, guessUpperCase];
    setAttempts(newAttempts);
    
    // Check if the guess is correct
    if (guessUpperCase === secretWord) {
      setGameState("won");
      toast.success("Поздравляем! Вы угадали слово!");
    } else if (newAttempts.length >= maxAttempts) {
      setGameState("lost");
      toast.error(`Игра окончена! Загаданное слово: ${secretWord}`);
    }
    
    // Reset current attempt
    setCurrentAttempt("");
  };
  
  const getLetterStyle = (letter: string, position: number, attempt: string) => {
    if (!secretWord) return "bg-gray-200";
    
    if (attempt[position] === secretWord[position]) {
      return "bg-green-500 text-white"; // Correct letter and position
    } else if (secretWord.includes(attempt[position])) {
      return "bg-yellow-500 text-white"; // Correct letter but wrong position
    } else {
      return "bg-gray-300 text-gray-700"; // Wrong letter
    }
  };
  
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && gameState === "playing") {
      handleGuess();
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Wordle</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          {/* Attempts display */}
          <div className="grid grid-cols-5 gap-2 w-full max-w-xs">
            {[...Array(maxAttempts)].map((_, attemptIndex) => (
              <React.Fragment key={attemptIndex}>
                {[...Array(5)].map((_, letterIndex) => {
                  const attempt = attempts[attemptIndex] || "";
                  const letter = attempt[letterIndex] || "";
                  const letterStyle = attempt ? getLetterStyle(letter, letterIndex, attempt) : "bg-white border border-gray-300";
                  
                  return (
                    <div 
                      key={`${attemptIndex}-${letterIndex}`}
                      className={`w-12 h-12 flex items-center justify-center font-bold text-lg uppercase transition-colors ${letterStyle}`}
                    >
                      {letter}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
          
          {/* Input field for current guess */}
          {gameState === "playing" && (
            <div className="w-full max-w-xs mt-4">
              <Input
                maxLength={5}
                value={currentAttempt}
                onChange={(e) => setCurrentAttempt(e.target.value.toUpperCase())}
                onKeyPress={handleKeyPress}
                className="text-center uppercase font-bold text-lg"
                placeholder="Введите слово"
                disabled={gameState !== "playing"}
              />
            </div>
          )}
          
          {/* Game result */}
          {gameState === "won" && (
            <div className="flex items-center space-x-2 text-green-600 font-bold">
              <Check />
              <span>Вы угадали слово {secretWord}!</span>
            </div>
          )}
          
          {gameState === "lost" && (
            <div className="flex items-center space-x-2 text-red-600 font-bold">
              <X />
              <span>Загаданное слово: {secretWord}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        {gameState === "playing" ? (
          <Button onClick={handleGuess} className="flex items-center space-x-2">
            <span>Проверить</span>
          </Button>
        ) : (
          <Button onClick={startNewGame} className="flex items-center space-x-2">
            <span>Новая игра</span>
            <Keyboard size={16} />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default WordleGame;
