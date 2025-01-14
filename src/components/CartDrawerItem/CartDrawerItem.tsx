import { cn } from "@/lib/utils";
import { FunctionComponent } from "react";
import CountButton from "../CountButton/CountButton";
import { Trash2Icon } from "lucide-react";
import { Ingredient } from "@prisma/client";
// import { memo } from "react";

interface CartDrawerItemProps {
  style?: Record<string, string>;
  className?: string;
  index?: number;
  name?: string;
  size?: number | null;
  price: number;
  type?: number | null;
  ingredients: Ingredient[];
  count: number;
  imageUrl?: string;
  changeCount?: (operation: "Plus" | "Minus") => void;
  deleteCartItem?: (index: number) => void;
  textDetails?: string;
  textIngredients?: string;
}

const CartDrawerItem: FunctionComponent<CartDrawerItemProps> = ({
  className,
  style,
  count,
  name,
  imageUrl,
  price,
  ingredients,
  size,
  type,
  index,
  changeCount,
  deleteCartItem,
  textDetails,
  textIngredients,
}) => {
  return (
    <div
      className={cn("flex bg-white rounded-lg p-5 gap-6", className)}
      style={style}
    >
      <img className="w-[65px] h-[65px]" src={imageUrl} alt="Logo" />

      <div className="flex-1">
        <h2 className="text-lg font-bold">{name}</h2>

        {textDetails && textDetails.length > 0 && (
          <p className="text-sm text-gray-400">{textDetails}</p>
        )}

        {textIngredients && textIngredients.length > 0 && (
          <p className="text-sm text-gray-400">{textIngredients}</p>
        )}

        <hr className="my-3" />

        <div className="flex items-center justify-between">
          <CountButton
            value={count}
            onClick={
              changeCount
                ? (flag) => {
                    changeCount(flag);
                  }
                : undefined
            }
          />

          <h2 className="font-bold">
            {(price +
              ingredients.reduce((ingrAccum, ingredient) => {
                return ingrAccum + ingredient.price;
              }, 0)) *
              count}{" "}
            ₽
          </h2>
          <Trash2Icon
            className="w-6 h-6 text-gray-400 hover:text-red-500 cursor-pointer"
            onClick={
              deleteCartItem && index !== undefined
                ? () => {
                    deleteCartItem(index);
                  }
                : undefined
            }
            // aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
};

export default CartDrawerItem;
