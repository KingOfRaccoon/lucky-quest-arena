import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import NumberSelection from "./NumberSelection";
import CarNumberSelection from "./CarNumberSelection";
import TicketQuantity from "./TicketQuantity";
import { Lottery } from "@/LotteriesContext";

interface BuyTicketTabProps {
  lottery: Lottery;
  maxSelectionOptions: number;
}

// Тип для хранения данных автомобильного номера
interface CarNumberData {
  selectedLetter: string;
  firstNumbers: string;
  secondNumbers: string;
  thirdNumbers: string;
  isValid: boolean;
}

const BuyTicketTab = ({ lottery, maxSelectionOptions }: BuyTicketTabProps) => {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [ticketCount, setTicketCount] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'currency' | 'credits'>(
    lottery.price_currency > 0 ? 'currency' : 'credits'
  );
  const [numberOptions, setNumberOptions] = useState<number[]>(() => {
    const max = lottery.lottery_type_id === 1 ? 36 : 20;
    return Array.from({ length: max }, (_, i) => i + 1);
  });

  // Массив для хранения данных всех автомобильных номеров
  const [carNumbersData, setCarNumbersData] = useState<CarNumberData[]>([{
    selectedLetter: '',
    firstNumbers: '',
    secondNumbers: '',
    thirdNumbers: '',
    isValid: false
  }]);

  const { toast } = useToast();

  // Обновляем массив автомобильных номеров при изменении количества билетов
  useEffect(() => {
    // Если число вводов меньше выбранного количества, добавляем недостающие
    if (carNumbersData.length < ticketCount) {
      const newCarNumbers = [...carNumbersData];
      for (let i = carNumbersData.length; i < ticketCount; i++) {
        newCarNumbers.push({
          selectedLetter: '',
          firstNumbers: '',
          secondNumbers: '',
          thirdNumbers: '',
          isValid: false
        });
      }
      setCarNumbersData(newCarNumbers);
    }
    // Если число вводов больше выбранного количества, удаляем лишние
    else if (carNumbersData.length > ticketCount) {
      setCarNumbersData(carNumbersData.slice(0, ticketCount));
    }
  }, [ticketCount]);

  const handleTicketCountChange = (increment: number) => {
    const newCount = ticketCount + increment;
    if (newCount > 0 && newCount <= 10) {
      setTicketCount(newCount);
    }
  };

  // Получить текущую цену билета в зависимости от способа оплаты
  const getCurrentPrice = () => {
    if (paymentMethod === 'currency') {
      return lottery.price_currency;
    } else {
      return lottery.price_credits;
    }
  };

  // Получить текст для кнопки покупки в зависимости от способа оплаты
  const getBuyButtonText = () => {
    const suffix = ticketCount > 1 ? 'ы' : '';
    if (paymentMethod === 'currency') {
      return `Купить билет${suffix} за ${lottery.price_currency * ticketCount} ₽`;
    } else {
      return `Купить билет${suffix} за ${lottery.price_credits * ticketCount} баллов`;
    }
  };

  // Функция для обновления данных конкретного автомобильного номера
  const updateCarNumber = (index: number, field: keyof CarNumberData, value: string | boolean) => {
    const newCarNumbersData = [...carNumbersData];
    newCarNumbersData[index] = {
      ...newCarNumbersData[index],
      [field]: value
    };
    setCarNumbersData(newCarNumbersData);
  };

  // Проверка валидности всех автомобильных номеров
  const areAllCarNumbersValid = (): boolean => {
    return carNumbersData.slice(0, ticketCount).every(data => data.isValid);
  };

  const handleBuyTicket = () => {
    // Для лотереи "АвтоНомер" проверяем валидность всех номеров
    if (lottery.lottery_type_id === 2) {
      if (!areAllCarNumbersValid()) {
        toast({
          title: "Неверный формат номера",
          description: "Пожалуйста, заполните корректно все автомобильные номера",
          variant: "destructive",
        });
        return;
      }

      // Подготовим строки для отображения номеров в уведомлении
      const carNumberStrings = carNumbersData.map(data =>
        `${data.selectedLetter}${data.firstNumbers}${data.secondNumbers}${data.thirdNumbers}`
      );

      toast({
        title: `${ticketCount > 1 ? 'Билеты' : 'Билет'} приобретен!`,
        description: `Вы купили ${ticketCount} билет${ticketCount > 1 ? 'а' : ''} с номер${ticketCount > 1 ? 'ами' : 'ом'}: ${carNumberStrings.join(', ')} за ${getCurrentPrice() * ticketCount} ${paymentMethod === 'currency' ? '₽' : 'баллов'}`,
      });

      // Сбросить все номера
      const resetCarNumbers = Array(ticketCount).fill({
        selectedLetter: '',
        firstNumbers: '',
        secondNumbers: '',
        thirdNumbers: '',
        isValid: false
      });
      setCarNumbersData(resetCarNumbers);
    } else {
      // Для обычных лотерей
      if (selectedNumbers.length !== maxSelectionOptions) {
        toast({
          title: "Недостаточно чисел",
          description: `Выберите ${maxSelectionOptions} чисел для покупки билета`,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Билет приобретён!",
        description: `Вы купили ${ticketCount} билет${ticketCount > 1 ? 'а' : ''} с числами ${selectedNumbers.join(', ')} за ${getCurrentPrice() * ticketCount} ${paymentMethod === 'currency' ? '₽' : 'баллов'}`,
      });

      // Сброс выбора после покупки
      setSelectedNumbers([]);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 md:p-6">
        <h2 className="text-xl font-bold mb-6">Купить билет</h2>

        {/* Секция выбора количества билетов */}
        <TicketQuantity
          count={ticketCount}
          onChange={handleTicketCountChange}
          className="mb-6"
        />

        {/* Выбор комбинации для обычной лотереи */}
        {lottery.lottery_type_id === 1 && (
          <NumberSelection
            maxSelections={maxSelectionOptions}
            numberOptions={numberOptions}
            selectedNumbers={selectedNumbers}
            setSelectedNumbers={setSelectedNumbers}
          />
        )}

        {/* Выбор автомобильного номера для специальной лотереи */}
        {lottery.lottery_type_id === 2 && (
          <div>
            {carNumbersData.map((data, index) => (
              <div key={index} className="mb-6">
                {ticketCount > 1 && (
                  <h3 className="font-semibold text-lg mb-2">Билет {index + 1}</h3>
                )}
                <CarNumberSelection
                  selectedLetter={data.selectedLetter}
                  setSelectedLetter={(value) => updateCarNumber(index, 'selectedLetter', value)}
                  firstNumbers={data.firstNumbers}
                  setFirstNumbers={(value) => updateCarNumber(index, 'firstNumbers', value)}
                  secondNumbers={data.secondNumbers}
                  setSecondNumbers={(value) => updateCarNumber(index, 'secondNumbers', value)}
                  thirdNumbers={data.thirdNumbers}
                  setThirdNumbers={(value) => updateCarNumber(index, 'thirdNumbers', value)}
                  onValidationChange={(isValid) => updateCarNumber(index, 'isValid', isValid)}
                />
              </div>
            ))}
          </div>
        )}

        {/* Секция покупки билета */}
        <div className="mt-6">
          <div className="flex gap-2 mb-4">
            <Button
              variant={paymentMethod === 'currency' ? 'default' : 'outline'}
              onClick={() => setPaymentMethod('currency')}
              disabled={lottery.price_currency <= 0}
              className="flex-1"
            >
              Валюта
            </Button>
            <Button
              variant={paymentMethod === 'credits' ? 'default' : 'outline'}
              onClick={() => setPaymentMethod('credits')}
              disabled={lottery.price_credits <= 0}
              className="flex-1"
            >
              Баллы
            </Button>
          </div>
          <Button
            onClick={handleBuyTicket}
            className="w-full"
            size="lg"
            disabled={
              lottery.lottery_type_id === 1
                ? selectedNumbers.length !== maxSelectionOptions
                : !areAllCarNumbersValid()
            }
          >
            {getBuyButtonText()}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BuyTicketTab;
