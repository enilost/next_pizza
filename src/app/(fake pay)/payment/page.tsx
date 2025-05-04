export const dynamic = "force-dynamic";
export const revalidate = 0;
import Container from "@/components/Container/Container";
import FakePay from "@/components/FakePay/FakePay";
import { Title } from "@/components/Title/Title";
import { cookies } from "next/headers";
import { FunctionComponent } from "react";
import prisma from "../../../../prisma/prisma-client";
import { OrderStatus } from "@prisma/client";
import RedirectFakePay from "@/components/FakePay/RedirectFakePay";

interface PaymentPageProps {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

const PaymentPage: FunctionComponent<PaymentPageProps> = ({
  params,
  searchParams,
}) => {
  const CartOrderId = cookies().get("NextPizzaOrderId")?.value;

  const SearchParamCartOrderId = searchParams["order_id"];
  
  const serverActionOrderSucceess = async () => {
    "use server";
    try {
      const CartOrderIdc = cookies().get("NextPizzaOrderId")?.value;

      if (!CartOrderIdc || CartOrderIdc != SearchParamCartOrderId) {
        throw new Error("неудалось найти ордер");
      }
      const successOrder = await prisma.order.update({
        where: {
          id: +CartOrderIdc,
        },
        data: {
          status: OrderStatus.SUCCEEDED,
        },
      });
      if (!successOrder) {
        throw new Error("неудалось изменить статус ордера");
      }
      // cookies().delete("NextPizzaOrderId");
      cookies().set("NextPizzaOrderId", "", {
        path: "/payment",
        httpOnly: true,
        maxAge: 0,
        expires: new Date(0),
      });
    } catch (error) {
      console.log(
        "app/fake pay/payment/page.tsx serverActionOrderSucceess",
        error
      );
      throw error;
    }
  };

  const serverActionOrderCancelled = async () => {
    "use server";
    try {
      const orderId = cookies().get("NextPizzaOrderId")?.value;
      
      if (!orderId || orderId != SearchParamCartOrderId) {
        throw new Error("неудалось найти ордер");
      }
      const cancelledOrder = await prisma.order.update({
        where: {
          id: +orderId,
        },
        data: {
          status: OrderStatus.CANCELLED,
        },
      });
      if (!cancelledOrder) {
        throw new Error("неудалось изменить статус ордера");
      }
      // cookies().delete("NextPizzaOrderId");
      cookies().set("NextPizzaOrderId", "", {
        path: "/payment",
        httpOnly: true,
        maxAge: 0,
        expires: new Date(0),
      });
    } catch (error) {
      console.log(
        "app/fake pay/payment/page.tsx serverActionOrderCanceled",
        error
      );
      throw error;
    }
  };


  
  if (!CartOrderId || CartOrderId != SearchParamCartOrderId) {

    return (
      <>
        <main className={" h-screen  bg-[hsla(20,100%,88%,1)]"}>
          <Container>
            <Title className="text-center">страничка фэйковой оплаты</Title>

            <div
              className={
                "bg-white rounded-3xl p-3 mb-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              }
            >
              <RedirectFakePay  />
            </div>
          </Container>
        </main>
      </>
    );
  }
  return (
    <>
      <main className={" h-screen  bg-[hsla(20,100%,88%,1)]"}>
        <Title className="text-center">страничка фэйковой оплаты</Title>
        <Title className="text-center">без функционала</Title>
        <Title className="text-center">
          после нажатия оплатить кука удалится, эта стр будет недоступна
        </Title>
        <Container>
          <div>
            <FakePay
              serverActionOrderSucceess={serverActionOrderSucceess}
              serverActionOrderCancelled={serverActionOrderCancelled}
            ></FakePay>
          </div>
        </Container>
      </main>
    </>
  );
};

export default PaymentPage;
