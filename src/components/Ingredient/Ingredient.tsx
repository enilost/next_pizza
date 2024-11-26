import { cn } from "@/lib/utils";
import { CircleCheck } from "lucide-react";
import { FunctionComponent } from "react";

interface IngredientProps {
  className?: string;
  imageUrl: string;
  name: string;
  price: number;
  active?: boolean;
  onClick?: VoidFunction;
}

const Ingredient: FunctionComponent<IngredientProps> = ({
  className,
  imageUrl,
  name,
  price,
  active ,
  onClick,
}) => {
  return (
    <div
      className={cn(
        "flex items-center flex-col p-1 rounded-3xl w-32 text-center relative cursor-pointer shadow-md bg-white border border-transparent",
        { "border border-primary ": active },
        className
      )}
      onClick={onClick}
    >
      {active && (
        <CircleCheck className="absolute top-2 right-2 text-primary" />
      )}
      <img src={imageUrl} alt="picture" width={110} height={110} />
      <span className="text-xs mb-1">{name}</span>
      <span className="font-bold">{price} ₽</span>
    </div>
  );
};

export default Ingredient;
