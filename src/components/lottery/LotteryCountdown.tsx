
import { useState, useEffect } from "react";
import { Timer } from "lucide-react";

interface CountdownProps {
  nextDraw: string;
}

const LotteryCountdown = ({ nextDraw }: CountdownProps) => {
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const nextDrawDate = new Date(nextDraw);
      const diff = nextDrawDate.getTime() - now.getTime();
      
      if (diff <= 0) {
        clearInterval(timer);
        setCountdown({ hours: 0, minutes: 0, seconds: 0 });
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setCountdown({ hours, minutes, seconds });
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [nextDraw]);

  return (
    <span className="font-mono font-bold">
      {String(countdown.hours).padStart(2, '0')}:
      {String(countdown.minutes).padStart(2, '0')}:
      {String(countdown.seconds).padStart(2, '0')}
    </span>
  );
};

export default LotteryCountdown;
