"use client";
import { FunctionComponent, useEffect } from "react";
import { Title } from "../Title/Title";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface RedirectFakePayProps {}

const RedirectFakePay: FunctionComponent<RedirectFakePayProps> = () => {
const router = useRouter();
  let count = 7;
  useEffect(() => {
    let span = document.getElementById('countSpan');
    if (!span) return;
    let intervalId = setInterval(function() {
    count--;
    if (span) {
      span.textContent = count.toString();
    }
    if(window.location.pathname !== "/payment") {
    clearInterval(intervalId);
    }
    if (count <= 0) {
      router.replace("/");
      clearInterval(intervalId);
    }
  }, 1000);

  }, []);

  return (
    <>
      <div className={"px-5 py-4 text-center"}>
        <Title size={"h3"}>
          Заказ уже оплачен,
          <br /> или больше недействителен
        </Title>
        <hr />
        возвращение{" "}
        <Link href="/" className="underline">
          на главную страницу
        </Link>{" "}
        через <span id="countSpan">{count}</span>
      </div>
      {/* <script
        dangerouslySetInnerHTML={{
          __html: `(
            function() {
              let count = 7;
              let span = document.getElementById('countSpan');
              if (!span) return;
              let intervalId = setInterval(function() {
              count--;
              if (span) {
                span.textContent = count.toString();
              }
              if(window.location.pathname !== "/payment") {
              clearInterval(intervalId);
              }
              if (count <= 0) {
                window.location.replace("/");
                clearInterval(intervalId);
              }
            }, 1000);
          })();
        `,
        }}
      /> */}
    </>
  );
};

export default RedirectFakePay;
