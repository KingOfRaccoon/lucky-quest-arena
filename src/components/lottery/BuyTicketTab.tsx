
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import NumberSelection from "./NumberSelection";
import TicketQuantity from "./TicketQuantity";

interface BuyTicketTabProps {
  lottery: any;
  maxSelectionOptions: number;
}

const BuyTicketTab = ({ lottery, maxSelectionOptions }: BuyTicketTabProps) => {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [ticketCount, setTicketCount] = useState(1);
  const [numberOptions, setNumberOptions] = useState<number[]>(() => {
    const max = lottery.type === "traditional" ? 36 : 20;
    return Array.from({ length: max }, (_, i) => i + 1);
  });
  const { toast } = useToast();

  const handleTicketCountChange = (increment: number) => {
    const newCount = ticketCount + increment;
    if (newCount > 0 && newCount <= 10) {
      setTicketCount(newCount);
    }
  };

  const handleBuyTicket = () => {
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
      description: "Проверьте свой профиль для деталей.",
    });
    
    // Reset selection after purchase
    setSelectedNumbers([]);
  };

  return (
    <div className="mb-6">
      <NumberSelection 
        numberOptions={numberOptions} 
        maxSelectionOptions={maxSelectionOptions} 
        selectedNumbers={selectedNumbers} 
        setSelectedNumbers={setSelectedNumbers} 
      />
      
      <TicketQuantity 
        lottery={lottery} 
        ticketCount={ticketCount} 
        handleTicketCountChange={handleTicketCountChange} 
      />
      
      <Button className="w-full" size="lg" onClick={handleBuyTicket}>
        Купить билет{ticketCount > 1 ? 'ы' : ''}
      </Button>
    </div>
  );
};

export default BuyTicketTab;
