"use client";
import { FunctionComponent, useEffect, useRef, useState } from "react";
import style from "./FakePayStyle.module.css";
import Link from "next/link";
// import router from "next/router";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
interface FakePayProps {
  className?: string;
  children?: React.ReactNode;
  serverActionOrderSucceess: () => Promise<void>;
  serverActionOrderCancelled: () => Promise<void>;
}

const FakePay: FunctionComponent<FakePayProps> = ({
  serverActionOrderCancelled,
  serverActionOrderSucceess,
}) => {
  const [loading, setLoading] = useState(false);
  const isMountRef = useRef(true);
  useEffect(() => {
    return () => {
      isMountRef.current = false;
    };
  }, []);
  const router = useRouter();
  const cancelledOrder = (e: React.MouseEvent<HTMLDivElement>) => {
    if (loading) return;
    setLoading(true);
    serverActionOrderCancelled()
      .then((res) => {
        router.push("/");
        setTimeout(() => {
          toast.error("Заказ отменен");
        }, 700);
      })
      .catch((err) => {
        console.log("component FakePay cancelledOrder catch", err);
        router.refresh();
      })
      .finally(() => {
        if (isMountRef.current) setLoading(false);
      });
  };

  const successOrder = (e: React.MouseEvent<HTMLDivElement>) => {
    if (loading) return;
    setLoading(true);
    serverActionOrderSucceess()
      .then((res) => {
        router.push("/");
        setTimeout(() => {
          toast.success("Заказ успешно оплачен");
        }, 700);
      })
      .catch((err) => {
        console.log("component FakePay successOrder catch", err);
        router.refresh();
      })
      .finally(() => {
        if (isMountRef.current) setLoading(false);
      });
  };
  return (
    <>
      <div className={style["btn"]} onClick={cancelledOrder}>
        <Link href="https://ya.ru/" onClick={(e) => e.preventDefault()}>
          Отменить заказ
        </Link>
      </div>

      <div className={style["wrapper"]}>
        <div className={style["title"]}>Форма оплаты</div>
        <div className={style["checkout_form"]}>
          <div className={style["input_item"]}>
            <input type="text" placeholder="Card Holder Name" />
          </div>
          <div className={style["input_item"]}>
            <input
              type="text"
              placeholder="0000 0000 0000 0000"
              data-mask="0000 0000 0000 0000"
            />
          </div>
          <div className={style["input_grp"]}>
            <div className={style["input_item"]}>
              <input type="text" placeholder="MM / YY" data-mask="00 / 00" />
            </div>
            <div className={style["input_item"]}>
              <input type="text" placeholder="* * *" data-mask="0 0 0" />
            </div>
          </div>
          <div className={style["btn"]} onClick={successOrder}>
            <Link
              href="https://ya.ru/"
              id={"delCookie"}
              onClick={(e) => e.preventDefault()}
            >
              Оплатить
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default FakePay;
