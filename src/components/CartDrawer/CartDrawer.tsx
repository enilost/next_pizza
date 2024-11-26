// "use client";
// import { cn } from "@/lib/utils";
import { FunctionComponent, useEffect, useId } from "react";
// import { Sheet } from "../ui/sheet";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import Link from "next/link";
import { Button } from "../ui/button";
// import { Arrow } from "@radix-ui/react-popover";
import { ArrowRight } from "lucide-react";
import CartDrawerItem from "../CartDrawerItem/CartDrawerItem";
import { ProductIngedientItem } from "../ProguctCardGroup/ProguctCardGroup";
import { useStoreCart } from "@/store/cart";
import { CartItem, Ingredient, Product, ProductItem } from "@prisma/client";
import { detailsTextIngredients, detailsTextSize } from "@/constants/constants";
// import apiClient from "../../../services/apiClient";
// import { useStoreCart } from "@/store/cart";
interface CartDrawerProps {
  className?: string;
  children?: React.ReactNode;
  items: (CartItem & {
    productItem: ProductItem & { product: Product };
    ingredients: Ingredient[];
  })[];
  disabled?: boolean;
}

const CartDrawer: FunctionComponent<CartDrawerProps> = ({
  className,
  children,
  items,
  disabled,
}) => {
  const [changeCount, deleteCartItem] = useStoreCart((state) => [
    state.changeCount,
    state.deleteCartItem,
  ]);
  useEffect(() => {
    // console.log('CartDrawer');
  });
  const countClick = (
    index: number,
    count: number,
    operation: "Minus" | "Plus"
  ) => {
    switch (operation) {
      case "Minus":
        if (items[index].quantity > 1) {
          changeCount(index, count - 1);
        }
        break;
      case "Plus":
        changeCount(index, count + 1);
        break;
      default:
        const a: never = operation;
    }
  };
  // detailsTextSize
  const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);
  return (
    <Sheet>
      <SheetTrigger>{children}</SheetTrigger>
      <SheetContent className="flex flex-col justify-between pb-0 bg-[#fef9f4]">
        <SheetHeader>
          <SheetTitle>
            В корзине {""}
            <span className="font-bold">
              {totalCount}{" "}
              {totalCount == 1
                ? " товар"
                : totalCount > 4 || totalCount == 0
                ? "товаров"
                : "товара"}
            </span>
          </SheetTitle>
          <SheetDescription>
            Ваш список добавленных в корзину продуктов
          </SheetDescription>
        </SheetHeader>

        <div
          className="overflow-auto scrl_glbl -mx-6 p-0 "
          style={{ direction: "rtl" }}
        >
          {items.map((item, idx) => (
            <CartDrawerItem
              index={idx}
              key={item.id + "_" + idx}
              className={idx == items.length - 1 ? "mb-0" : "mb-3"}
              style={{ direction: "ltr" }}
              count={item.quantity}
              name={item.productItem.product.name}
              imageUrl={item.productItem.product.imageUrl}
              price={item.productItem.price}
              ingredients={item.ingredients}
              size={item.productItem.size}
              type={item.productItem.pizzaType}
              changeCount={(flag) => {
                countClick(idx, item.quantity, flag);
              }}
              deleteCartItem={(index) => {
                deleteCartItem(index);
              }}
              textDetails={detailsTextSize(
                item.productItem.size,
                item.productItem.pizzaType
              )}
              textIngredients={detailsTextIngredients(item.ingredients)}
            />
          ))}
        </div>

        <SheetFooter className="-mx-6 bg-white p-8 ">
          <div className="w-full">
            <div className="flex mb-4">
              <span className="flex flex-1 text-lg text-neutral-500 items-center w-full">
                Итого
                <div className="flex-1 border-b border-dashed border-b-neutral-200  h-0 items-center"></div>
              </span>
              <span className="text-lg text-neutral-500 font-bold">
                {items.reduce((acc, item) => {
                  const ingrPrice = item.ingredients.reduce(
                    (ingrAccum, ingredient) => {
                      return ingrAccum + ingredient.price;
                    },
                    0
                  );
                  return (
                    acc + (item.productItem.price + ingrPrice) * item.quantity
                  );
                }, 0)}{" "}
                ₽
              </span>
            </div>

            <Link href={"/cart"}>
              <Button
                type="submit"
                className="w-full h-12 text-base"
                disabled={disabled}
              >
                Оформить заказ
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
