import { cn } from "@/lib/utils";
import { FunctionComponent } from "react";
import { Button } from "../ui/button";
import { Minus, Plus } from "lucide-react";

interface CountButtonProps {
  value: number;
  size?: "h4" | "h5";
  className?: string;
  onClick?: (operation: "Plus" | "Minus") => void;
}

const CountButton: FunctionComponent<CountButtonProps> = ({
  className,
  size,
  value,
  onClick,
}) => {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-between gap-3",
        className
      )}
    >
      <Button
        type="button"
        variant="outline"
        className={cn(
          "p-0 hover:bg-primary hover:text-white",
          size === "h4"
            ? "w-[30px] h-[30px] rounded-sm"
            : "w-[38px] h-[38px] rounded-se-md"
        )}
        disabled={value <= 1}
        onClick={
          onClick
            ? () => {
                onClick("Minus");
              }
            : undefined
        }
      >
        <Minus className={size === "h4" ? "h-4" : "h-5"} />
      </Button>
      <b className={size === "h4" ? "text-sm" : "text-md"}>{value}</b>
      <Button
        type="button"
        variant="outline"
        className={cn(
          "p-0 hover:bg-primary hover:text-white",
          size === "h4"
            ? "w-[30px] h-[30px] rounded-sm"
            : "w-[38px] h-[38px] rounded-md"
        )}
        onClick={
          onClick
            ? () => {
                onClick("Plus");
              }
            : undefined
        }
      >
        <Plus className={size === "h4" ? "h-4" : "h-5"} />
      </Button>
    </div>
  );
};

export default CountButton;
