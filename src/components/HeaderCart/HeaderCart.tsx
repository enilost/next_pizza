"use client";
import { FunctionComponent, useEffect } from "react";
// import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, ShoppingCart } from "lucide-react";
import CartDrawer from "../CartDrawer/CartDrawer";
import { useStoreCart } from "@/store/cart";
// import { findOrCreateCart } from "../../../services/cart";
// import apiClient from "../../../services/apiClient";

interface HeaderCartProps {}

const HeaderCart: FunctionComponent<HeaderCartProps> = () => {
  const [items, getCartAndItems, loading] = useStoreCart((state) => [
    state.cartItems,
    state.getCartAndItems,
    state.loading,
  ]);

  useEffect(() => {
    getCartAndItems("find");
  }, []);

  return (
    <CartDrawer items={items} disabled={loading}>
      <span
        // onClick={() => getCartAndItems()}
        className={cn(`inline-flex items-center justify-center 
          whitespace-nowrap rounded-md active:translate-y-[1px] 
          text-sm font-medium ring-offset-background transition-colors 
          focus-visible:outline-none focus-visible:ring-2 
          focus-visible:ring-ring focus-visible:ring-offset-2 
          disabled:pointer-events-none disabled:opacity-50 bg-primary 
          text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 group relative`)}
      >
        <b>
          {items.reduce((acc, item) => {
            const ingrPrice = item.ingredients.reduce(
              (ingrAccum, ingredient) => {
                return ingrAccum + ingredient.price;
              },
              0
            );
            return acc + (item.productItem.price + ingrPrice) * item.quantity;
          }, 0)}{" "}
          ₽
        </b>
        <span className={cn("h-full w-[1px] bg-white/30 mx-2")}></span>
        <div
          className={cn(
            "flex items-center gap-1 transition duration-300 group-hover:opacity-0"
          )}
        >
          <ShoppingCart className={cn("h-4 w-4 relative")}></ShoppingCart>
          <b>{items.reduce((acc, item) => acc + item.quantity, 0)}</b>
        </div>
        <ArrowRight className="w-5 absolute right-5 transition duration-300 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0" />
      </span>
    </CartDrawer>
  );
};

export default HeaderCart;

