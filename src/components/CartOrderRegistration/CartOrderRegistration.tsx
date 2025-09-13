"use client";

import { FunctionComponent, useEffect, useState } from "react";
import CartDrawerItem from "../CartDrawerItem/CartDrawerItem";
import { detailsTextIngredients, detailsTextSize } from "@/constants/constants";
import useCart from "@/hooks/useCart";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import { useStoreWithEqualityFn } from "zustand/traditional";
import { UserObject, useStoreUser } from "@/store/user";
import { Title } from "../Title/Title";
import { ICart } from "../../../services/cart";
import toast from "react-hot-toast";
import { Cart } from "@prisma/client";
import { useRouter } from "next/navigation";
// import prisma from "../../../prisma/prisma-client";

interface CartOrderRegistrationProps {
  serverAction: (data: {
    user: UserObject;
    cart: Cart;
    totalAmount: number;
    cartItems: ICart["items"];
    domain: string;
  }) => Promise<string>;
}

const CartOrderRegistration: FunctionComponent<CartOrderRegistrationProps> = ({
  serverAction,
}) => {
  const { items, getCartAndItems, loading, countClick, deleteCartItem, cart } =
    useCart();
  useEffect(() => {
    if (items.length == 0) {
      getCartAndItems("find");
    }
  }, []);
  const router = useRouter();
  const [validError, createUserObject] = useStoreWithEqualityFn(
    useStoreUser,
    (state) => [state.validError, state.createUserObject],
    (prev, next) => true
  );

  const totalAmount = items.reduce((acc, item) => {
    const ingrPrice = item.ingredients.reduce((ingrAccum, ingredient) => {
      return ingrAccum + ingredient.price;
    }, 0);
    return acc + (item.productItem.price + ingrPrice) * item.quantity;
  }, 0);

  const [orderLoading, setOrderLoading] = useState(false);

  const handleCartOrder = () => {
    const inputError = validError();
    if (inputError) return;

    if (items.length == 0 || !("id" in cart) || !totalAmount) return;

    setOrderLoading(true);
    const user = createUserObject();
    const domain = window.location.origin;
    // if (!user) return;
    serverAction({
      user: user,
      cart: cart,
      totalAmount,
      cartItems: items,
      domain,
    })
      .then((url) => {
        toast.success("Заказ успешно оформлен \n Переход к оплате");

        useStoreUser.getState().setComment("");
        if (url) {
          // window.location.href = url;

          router.push(url);
        } else {
          window.location.reload();
        }
      })
      .catch((err) => {
        console.log("catch CartOrderRegistration component", err);

        toast.error("Ошибка сети при оформлении заказа");
      })
      .finally(() => {
        setOrderLoading(false);
      });
  };
  return (
    <div className="flex flex-col gap-1 justify-start h-[100%]">
      <div className="mb-3 flex-[0_0_auto]">
        <div>
          <div className=" mb-0 bg-white  flex items-center justify-center ">
            <Title size={"h3"}>Подробности заказа</Title>
          </div>
          <hr className="mb-3" />
          <div className="overflow-y-auto scrl_glbl bg-[hsla(20,100%,88%,1)] max-h-[15vh] mb-1 mx-3">
            {items.map((item, idx) => (
              <div
                className="flex mb-0 bg-white items-center"
                key={item.id + "_" + idx}
              >
                <span className="flex flex-1 text-base text-neutral-500 items-center w-full ">
                  {item.productItem.product.name} / кол-во: {item.quantity}
                  <div className="flex-1 border-b border-dashed border-b-neutral-400  h-0 items-center mx-2 px-2"></div>
                </span>
                <span className="text-base text-neutral-500 font-bold">
                  {(item.productItem.price +
                    item.ingredients.reduce((ingrAccum, ingredient) => {
                      return ingrAccum + ingredient.price;
                    }, 0)) *
                    item.quantity}{" "}
                  ₽
                </span>
              </div>
            ))}
          </div>

          <div className="flex mb-2">
            <span className="flex flex-1 text-xl text-neutral-700 items-center w-full font-bold">
              Итого
              <div className="flex-1 border-b border-dashed border-b-neutral-700  h-0 items-center mx-2"></div>
            </span>
            <span className="text-lg text-neutral-700 font-bold">
              {totalAmount} ₽
            </span>
          </div>

          <Button
            onClick={handleCartOrder} //{e:123}
            className="w-full h-12 text-base"
            disabled={loading || items.length == 0 || orderLoading}
            loading={loading}
            type="button"
          >
            {"Оформить заказ"}

            {!loading && <ArrowRight className="w-5 h-5 ml-2" />}
          </Button>
        </div>
      </div>
      <hr />
      {/* max-h-[100%] overflow-auto */}
      <div
        className=" mt-4 w-[383px] scrl_glbl flex-[0_1_auto] overflow-y-auto min-h-0 bg-[hsla(20,100%,88%,1)]"
        style={{
          direction: "rtl",
          // paddingLeft: "20px",
          // marginLeft: "-20px",
          width: "100%",
        }}
      >
        {/* <div className="flex "> */}
        <div>
          {items.map((item, idx) => (
            <CartDrawerItem
              index={idx}
              key={item.id + "_" + idx}
              className={idx == items.length - 1 ? "mb-0" : "mb-[1px]"}
              style={{ direction: "ltr", borderRadius: "0px" }}
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
        {/* </div> */}
      </div>
    </div>
  );
};

export default CartOrderRegistration;
