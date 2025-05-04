import { useStoreCart } from "@/store/cart";
// import {  useEffect } from "react";

// interface useCartProps {}

const useCart = () => {
  const [items, getCartAndItems, loading,cart] = useStoreCart((state) => [
    state.cartItems,
    state.getCartAndItems,
    state.loading,
    state.cart
  ]);
  const [changeCount, deleteCartItem] = useStoreCart((state) => [
    state.changeCount,
    state.deleteCartItem,
  ]);
  const countClick = (
    index: number,
    count: number,
    operation: "Minus" | "Plus"
  ) => {
    switch (operation) {
      case "Minus":
        if (items[index].quantity > 1) {
          changeCount(index, count - 1);
          // тосты запускаются внутри стейта корзины зустанд
        }
        break;
      case "Plus":
        changeCount(index, count + 1);
        // const notify = () => toast.success(`${items[index].productItem.product.name} добавляется в корзину`);
        // notify();
        // тосты запускаются внутри стейта корзины зустанд
        break;
      default:
        const a: never = operation;
    }
  };
//   useEffect(() => {
//     if (items.length == 0) {
//       getCartAndItems("find");
//     }
//     // getCartAndItems("find");
//   }, []);
  return {
    cart,
    items,
    countClick,
    deleteCartItem,
    loading,
    changeCount,
    getCartAndItems,
  };
};

export default useCart;
