import { useState, useContext, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import NumberSelection from "./NumberSelection";
import CarNumberSelection from "./CarNumberSelection";
import TicketQuantity from "./TicketQuantity";
import { Lottery } from "@/LotteriesContext";
import { post } from "@/services/api"; // Импортируем функцию для POST-запросов
import {UserContext, useUser} from "@/UserContext"; // Импортируем контекст пользователя
import { useLotteries } from "@/LotteriesContext"; // Импортируем контекст лотерей

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
  const [loading, setLoading] = useState<boolean>(false);

  // Состояния для выбора автомобильного номера (только для лотереи типа "special")
  const [selectedLetter, setSelectedLetter] = useState<string>('');
  const [firstNumbers, setFirstNumbers] = useState<string>('');
  const [secondNumbers, setSecondNumbers] = useState<string>('');
  const [thirdNumbers, setThirdNumbers] = useState<string>('');
  const [isCarNumberValid, setIsCarNumberValid] = useState<boolean>(false);

  // Получаем контексты пользователя и лотерей
  const { user, refreshUserData } = useUser();
  const { fetchUserTickets } = useLotteries();

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

  // Функция для покупки билетов через API
  const purchaseTickets = async (valueStr: string, isRealMoney: boolean) => {
    try {
      setLoading(true);

      // ID профиля пользователя (в продакшн версии брать из контекста пользователя)
      const profileId = user?.id || 1;

      // Подготавливаем данные для запроса
      const requestData = {
        id: lottery.id,
        profile_id: profileId,
        value_str: valueStr,
        real_price: isRealMoney
      };

      console.log('Отправляем запрос на покупку билета:', requestData);

      // Выполняем POST-запрос на покупку билета
      const response = await post('/tickets/purchase', requestData);

      console.log('Ответ от сервера:', response);

      // При успешной покупке обновляем данные пользователя и его билеты
      await refreshUserData();
      await fetchUserTickets(profileId);

      // Показываем уведомление об успешной покупке
      toast({
        title: `${ticketCount > 1 ? 'Билеты' : 'Билет'} приобретен!`,
        description: `Вы успешно купили билет ${valueStr} в лотерею "${lottery.name}"`,
        variant: "default",
      });

      // Сбрасываем выбранные значения
      resetSelections();

    } catch (error) {
      console.error('Ошибка при покупке билета:', error);

      // Показываем уведомление об ошибке
      toast({
        title: "Ошибка при покупке",
        description: "Не удалось приобрести билет. Пожалуйста, попробуйте еще раз.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Функция для сброса выбранных значений
  const resetSelections = () => {
    if (lottery.lottery_type_id === 1) { // Для автомобильных номеров
      setSelectedLetter('');
      setFirstNumbers('');
      setSecondNumbers('');
      setThirdNumbers('');
      setIsCarNumberValid(false);
    } else { // Для обычных лотерей
      setSelectedNumbers([]);
    }
  };

  const handleBuyTicket = async () => {
    // Для лотереи с автомобильными номерами
    if (lottery.lottery_type_id === 1) {
      if (!isCarNumberValid) {
        toast({
          title: "Неверный формат номера",
          description: "Пожалуйста, заполните корректно автомобильный номер",
          variant: "destructive",
        });
        return;
      }

      // Формируем строку номера
      const valueStr = `${selectedLetter}${firstNumbers}${secondNumbers}${thirdNumbers}`;

      // Покупаем билет (true для реальных денег, false для бонусов)
      await purchaseTickets(valueStr, paymentMethod === 'currency');

    } else {
      // Для обычных лотерей с выбором чисел
      if (selectedNumbers.length !== maxSelectionOptions) {
        toast({
          title: "Недостаточно чисел",
          description: `Выберите ${maxSelectionOptions} чисел для покупки билета`,
          variant: "destructive",
        });
        return;
      }

      // Формируем строку с выбранными числами
      const valueStr = selectedNumbers.sort((a, b) => a - b).join(',');

      // Покупаем билет
      await purchaseTickets(valueStr, paymentMethod === 'currency');
    }
  };

  return (
    <div className="mb-6">
      {lottery.lottery_type_id === 1 ? (
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

      <Button variant="primary" className="w-full" size="lg" onClick={handleBuyTicket} disabled={loading}>
        {getBuyButtonText()}
      </Button>
    </div>
  );
};

export default BuyTicketTab;
