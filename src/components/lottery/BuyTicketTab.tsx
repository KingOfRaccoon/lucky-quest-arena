import { useState } from "react";
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

  // Состояния для выбора автомобильного номера (только для лотереи типа "special")
  const [selectedLetter, setSelectedLetter] = useState<string>('');
  const [firstNumbers, setFirstNumbers] = useState<string>('');
  const [secondNumbers, setSecondNumbers] = useState<string>('');
  const [thirdNumbers, setThirdNumbers] = useState<string>('');
  const [isCarNumberValid, setIsCarNumberValid] = useState<boolean>(false);

  const { toast } = useToast();

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

  const handleBuyTicket = () => {
    // Для лотереи "АвтоНомер" проверяем валидность номера
    if (lottery.lottery_type_id === 2) {
      if (!isCarNumberValid) {
        toast({
          title: "Неверный формат номера",
          description: "Введите корректный автомобильный номер в формате А123-45-67",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Билет приобретён!",
        description: `Вы купили билет с номером ${selectedLetter}${firstNumbers}-${secondNumbers}-${thirdNumbers} за ${getCurrentPrice() * ticketCount} ${paymentMethod === 'currency' ? '₽' : 'баллов'}`,
      });

      // Сброс выбора после покупки
      setSelectedLetter('');
      setFirstNumbers('');
      setSecondNumbers('');
      setThirdNumbers('');
      setIsCarNumberValid(false);
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
    <div className="mb-6">
      {lottery.lottery_type_id === 2 ? (
        <CarNumberSelection
          selectedLetter={selectedLetter}
          setSelectedLetter={setSelectedLetter}
          firstNumbers={firstNumbers}
          setFirstNumbers={setFirstNumbers}
          secondNumbers={secondNumbers}
          setSecondNumbers={setSecondNumbers}
          thirdNumbers={thirdNumbers}
          setThirdNumbers={setThirdNumbers}
          onValidationChange={setIsCarNumberValid}
        />
      ) : (
        <NumberSelection
          numberOptions={numberOptions}
          maxSelectionOptions={maxSelectionOptions}
          selectedNumbers={selectedNumbers}
          setSelectedNumbers={setSelectedNumbers}
        />
      )}

      <TicketQuantity 
        lottery={lottery} 
        ticketCount={ticketCount} 
        handleTicketCountChange={handleTicketCountChange}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
      />
      
      <Button variant="primary" className="w-full" size="lg" onClick={handleBuyTicket}>
        {getBuyButtonText()}
      </Button>
    </div>
  );
};

export default BuyTicketTab;
