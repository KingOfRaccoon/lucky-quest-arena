
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface TicketQuantityProps {
  lottery: any;
  ticketCount: number;
  handleTicketCountChange: (increment: number) => void;
}

const TicketQuantity = ({ lottery, ticketCount, handleTicketCountChange }: TicketQuantityProps) => {
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
      
      <div className="mt-4 p-4 bg-white rounded-md">
        <div className="flex justify-between mb-2">
          <span>Цена за билет:</span>
          <span className="font-medium">{lottery.ticketPrice > 0 ? `${lottery.ticketPrice} ₽` : lottery.bonusCost ? `${lottery.bonusCost} бонусов` : "Бесплатно"}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Количество билетов:</span>
          <span className="font-medium">× {ticketCount}</span>
        </div>
        <Separator className="my-2" />
        <div className="flex justify-between font-semibold">
          <span>Итого к оплате:</span>
          <span className="text-primary">
            {lottery.ticketPrice > 0 
              ? `${lottery.ticketPrice * ticketCount} ₽` 
              : lottery.bonusCost 
                ? `${lottery.bonusCost * ticketCount} бонусов` 
                : "Бесплатно"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TicketQuantity;
