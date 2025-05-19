
import { useState } from "react";
import BaseLayout from "@/components/layout/BaseLayout";
import WordleGame from "@/components/mini-games/WordleGame";
import { Card, CardContent } from "@/components/ui/card";

const WordleGamePage = () => {
  return (
    <BaseLayout>
      <section className="mb-12">
        <h1 className="text-3xl font-bold mb-2">Wordle</h1>
        <p className="text-gray-500 mb-6">
          Угадайте слово из 5 букв за 6 попыток
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <WordleGame />
          </div>
          
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Правила игры</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>У вас есть 6 попыток, чтобы угадать слово из 5 букв</li>
                <li>После каждой попытки буквы будут подсвечены:</li>
                <li className="ml-4"><span className="text-green-500 font-semibold">Зеленый</span>: буква на правильном месте</li>
                <li className="ml-4"><span className="text-yellow-500 font-semibold">Жёлтый</span>: буква есть в слове, но не на этой позиции</li>
                <li className="ml-4"><span className="text-gray-500 font-semibold">Серый</span>: буквы нет в загаданном слове</li>
                <li>Вводите только слова из 5 букв на русском языке</li>
                <li>За каждую победу вы получаете бонусные монеты</li>
              </ul>
              
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">Совет:</h3>
                <p>Начните с угадывания слов с наиболее частыми буквами, такими как "О", "А", "Е", "Р", "С", чтобы быстрее выявить правильные буквы.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </BaseLayout>
  );
};

export default WordleGamePage;
