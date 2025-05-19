
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface MiniGameCardProps {
  id: number;
  title: string;
  description: string;
  image: string;
}

const MiniGameCard = ({ id, title, description, image }: MiniGameCardProps) => {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video bg-muted relative">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="pt-4">
        <h3 className="font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {description}
        </p>
        <Button className="w-full" asChild>
          <Link to={`/mini-game/${id}`}>
            Играть
            <ChevronRight size={16} className="ml-1" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default MiniGameCard;
