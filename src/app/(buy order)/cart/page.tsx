// "use client";
import CartOrderRegistration from "@/components/CartOrderRegistration/CartOrderRegistration";
import CommentOrderRegistration from "@/components/CommentOrderRegistration/CommentOrderRegistration";
import DadataAddress from "@/components/DadataAddress/DadataAddress";
import PersonalInfo from "@/components/PersonalInfo/PersonalInfo";
import { Title } from "@/components/Title/Title";
import { cn, createCookie } from "@/lib/utils";
import { MapPinHouse, MessageCircleMore, UserPen } from "lucide-react";
import { FunctionComponent, Suspense, use } from "react";
import prisma from "../../../../prisma/prisma-client";
import { ICart } from "../../../../services/cart";
import { UserObject } from "@/store/user";
import { OrderStatus } from "@prisma/client";
import { cookies } from "next/headers";
import { Cart as CartType } from "@prisma/client";
import { Resend } from "resend";
import EmailTemplate from "@/components/EmailTemplate/EmailTemplate";
import EmailFunc, {
  createUmoneyPay,
} from "@/components/EmailTemplate/EmailFunc";
import { ORDER_NAME } from "@/constants/constants";
interface CartProps {}

const Cart: FunctionComponent<CartProps> = () => {
  const servAct = async (data: {
    user: UserObject;
    cart: CartType;
    totalAmount: number;
    cartItems: ICart["items"];
    domain: string;
  }) => {
    "use server";
    try {
      if (!data.cart.token) {
        throw new Error("Ошибка, не найден карттокен");
      }

      const userCart = await prisma.cart.findFirst({
        where: {
          token: data.cart.token,
        },
        include: {
          user: true,
          items: {
            include: {
              ingredients: true,
              productItem: {
                include: {
                  product: true,
                },
              },
            },
          },
        },
      });

      if (!userCart || !userCart.items.length) {
        throw new Error("Ошибка, корзина не найдена или пуста");
      }

      const order = {
        token: userCart.token,
        totalAmount: data.totalAmount,
        status: OrderStatus.PENDING,
        items:userCart.items ,//JSON.stringify(userCart.items),
        fullName: data.user.firstName + " " + data.user.lastName,
        email: data.user.email,
        phone: data.user.phone,
        address: data.user.address,
        comment: data.user.comment,
        userId: userCart.userId,
      };

      const sendOrder = await prisma.order.create({
        data: {
          ...order,
        },
      });
      if (!sendOrder) {
        throw new Error("Ошибка, заказ не создан");
      }
      const updateCart = await prisma.cart.update({
        where: {
          id: userCart.id,
        },
        data: {
          totalAmount: 0,
        },
      });
      if (!updateCart) {
        throw new Error("Ошибка, корзина не сброшена");
      }
      const clearItems = await prisma.cartItem.deleteMany({
        where: {
          cartId: userCart.id,
        },
      });
      if (!clearItems) {
        throw new Error("Ошибка,итемы корзины не удалены");
      }

      // Создаем одноразовый токен
      const token = crypto.randomUUID();
      const order_id = sendOrder.id;

      // Устанавливаем куку с токеном
      // при оформлении или отмене она будет удалена
      // cookies().set(ORDER_NAME, order_id + "", {
      //   path: "/payment",
      //   httpOnly: true,
      //   maxAge: 36000, // 10часов
      //   // secure: process.env.NODE_ENV === "production",
      // });
      cookies().set(
        createCookie(ORDER_NAME, order_id + "", { path: "/payment" })
      );
      const url = `/payment?order_id=${order_id}`;

      // отправляет на емейл уведомление, отключил, чтоб не заспамлять ящик
      // const ef = await EmailFunc(
      //   data.user.email,
      //   `nextPizza / оплата заказа #${sendOrder.id}`,
      //   EmailTemplate({
      //     fullName: data.user.firstName + " " + data.user.lastName,
      //     orderId: order_id,
      //     totalAmount: data.totalAmount,
      //     url: `${data.domain + url}`,
      //   })
      // );

      const orderUpdate = await prisma.order.update({
        where: {
          id: order_id,
        },
        data: {
          paymentId: token,
        },
      });
      if (!orderUpdate) {
        throw new Error("Ошибка, (buy order)Cart page.tsx orderUpdate");
      }
      /////////////////////////////////////////////////////////////////
      // блок для юмани я его не использую, делаю без оплаты
      // const yookassaPayment = await createUmoneyPay({
      //   amount: data.totalAmount,
      //   description: `Оплата заказа #${sendOrder.id}`,
      //   order_id: sendOrder.id,
      //   url: `${data.domain + url}`,
      // })
      // if (!yookassaPayment) {
      //   throw new Error("Ошибка, оплатеж не создан");
      // }else{
      //   await prisma.order.update({
      //     where: {
      //       id: sendOrder.id,
      //     },
      //     data: {
      //       paymentId: yookassaPayment.id,
      //     },
      //   });
      // }

      return url;
    } catch (error) {
      console.log("app/(buy order)/cart/page.tsx", error);
      throw error;
    }
  };

  return (
    <>
      <div className="mt-5 mb-1">
        <Title size="h2">Оформление заказа</Title>
      </div>
      {/* action={qwe} */}
      {/* <form> */}
      <div className="flex gap-5 min-h-0 max-h-[calc(100vh-12rem)]">
        <div className="flex-[0_1_70%] overflow-y-auto scrl_glbl">
          <div className={cn("bg-white rounded-3xl p-3  mb-5")}>
            <div className="flex items-center justify-between pb-0 px-5 border-b border-gray-200">
              <Title size="h3"> Адрес доставки</Title>
              <div>
                <MapPinHouse />
              </div>
            </div>
            <div className={cn("px-5 py-4")}>
              <DadataAddress />
            </div>
          </div>

          <div className={cn("bg-white rounded-3xl p-3 mb-5")}>
            <div className="flex items-center justify-between pb-0 px-5 border-b border-gray-200">
              <Title size="h3"> Персональная информация</Title>
              <div>
                <UserPen />
              </div>
            </div>
            <div className={cn("px-5 py-4")}>
              <PersonalInfo />
            </div>
          </div>

          <div className={cn("bg-white rounded-3xl p-3 mb-5")}>
            <div className="flex items-center justify-between pb-0 px-5 border-b border-gray-200">
              <Title size="h3"> Комментарий к заказу </Title>
              <div>
                <MessageCircleMore />
              </div>
            </div>
            <div className={cn("px-5 py-4")}>
              <CommentOrderRegistration />
            </div>
          </div>
        </div>

        {/* flex-[0_1_30%] max-h-[100%]*/}
        <div className=" flex-[0_0_383px] ">
          <div
            className={cn(
              "bg-white rounded-3xl p-3 pb-5 mb-3 max-h-[100%] h-[100%]"
            )}
          >
            {/* <Suspense fallback={<div>LoadingLoadingLoading...</div>}> */}
            <CartOrderRegistration serverAction={servAct} />
            {/* </Suspense> */}
          </div>
        </div>
      </div>
      {/* </form> */}
    </>
  );
};

export default Cart;
