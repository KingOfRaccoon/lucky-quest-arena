import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Lottery } from "@/LotteriesContext.tsx";
import { Coins, Banknote, CreditCard } from "lucide-react";

interface TicketQuantityProps {
  lottery: Lottery;
  ticketCount: number;
  handleTicketCountChange: (increment: number) => void;
  paymentMethod?: 'currency' | 'credits';
  setPaymentMethod?: (method: 'currency' | 'credits') => void;
}

const TicketQuantity = ({
  lottery,
  ticketCount,
  handleTicketCountChange,
  paymentMethod = 'currency',
  setPaymentMethod
}: TicketQuantityProps) => {

  const showPaymentSelector = lottery.price_currency > 0 && lottery.price_credits > 0 && setPaymentMethod;
  const canPayWithCurrency = lottery.price_currency > 0;
  const canPayWithCredits = lottery.price_credits > 0;

  // Расчет итоговой суммы в зависимости от способа оплаты
  const calculateTotal = () => {
    if (paymentMethod === 'currency' && canPayWithCurrency) {
      return `${lottery.price_currency * ticketCount} ₽`;
    } else if (paymentMethod === 'credits' && canPayWithCredits) {
      return `${lottery.price_credits * ticketCount} баллов`;
    } else if (lottery.bonus_credit) {
      return `${lottery.bonus_credit * ticketCount} бонусов`;
    } else {
      return "Бесплатно";
    }
  };

  // Отображение цены за один билет
  const getTicketPrice = () => {
    if (paymentMethod === 'currency' && canPayWithCurrency) {
      return `${lottery.price_currency} ₽`;
    } else if (paymentMethod === 'credits' && canPayWithCredits) {
      return `${lottery.price_credits} баллов`;
    } else if (lottery.bonus_credit) {
      return `${lottery.bonus_credit} бонусов`;
    } else {
      return "Бесплатно";
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-6">
      <h3 className="font-semibold mb-4">Количество билетов</h3>
      <div className="flex items-center justify-center space-x-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleTicketCountChange(-1)}
          disabled={ticketCount <= 1}
        >
          -
        </Button>
        <span className="text-xl font-semibold w-10 text-center">{ticketCount}</span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleTicketCountChange(1)}
          disabled={ticketCount >= 10}
        >
          +
        </Button>
      </div>

      {showPaymentSelector && (
        <div className="mt-6 mb-4">
          <h4 className="text-sm font-medium mb-3">Способ оплаты</h4>
          <div className="grid grid-cols-2 gap-3">
            <div
              className={`border rounded-lg p-3 text-center cursor-pointer transition-colors ${
                paymentMethod === 'currency' 
                  ? 'bg-primary text-white border-primary' 
                  : 'bg-white border-gray-200 hover:border-primary/50'
              }`}
              onClick={() => setPaymentMethod?.('currency')}
            >
              <div className="flex flex-col items-center justify-center h-full">
                <CreditCard className={`h-6 w-6 mb-2 ${paymentMethod === 'currency' ? 'text-white' : 'text-primary'}`} />
                <div className="font-medium">Рубли</div>
                <div className="text-sm mt-1">{lottery.price_currency} ₽</div>
              </div>
            </div>

            <div
              className={`border rounded-lg p-3 text-center cursor-pointer transition-colors ${
                paymentMethod === 'credits' 
                  ? 'bg-primary text-white border-primary' 
                  : 'bg-white border-gray-200 hover:border-primary/50'
              }`}
              onClick={() => setPaymentMethod?.('credits')}
            >
              <div className="flex flex-col items-center justify-center h-full">
                <Coins className={`h-6 w-6 mb-2 ${paymentMethod === 'credits' ? 'text-white' : 'text-primary'}`} />
                <div className="font-medium">Баллы</div>
                <div className="text-sm mt-1">{lottery.price_credits} баллов</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 p-4 bg-white rounded-md">
        <div className="flex justify-between mb-2">
          <span>Цена за билет:</span>
          <span className="font-medium">{getTicketPrice()}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Количество билетов:</span>
          <span className="font-medium">× {ticketCount}</span>
        </div>
        <Separator className="my-2" />
        <div className="flex justify-between font-semibold">
          <span>Итого к оплате:</span>
          <span className="text-primary">{calculateTotal()}</span>
        </div>
      </div>
    </div>
  );
};

export default TicketQuantity;
