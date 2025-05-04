"use client";
import { FunctionComponent, useEffect, useRef, useState } from "react";
import Container from "../Container/Container";
import { User, UserPen } from "lucide-react";
import Login from "../Login/Login";
import Registration from "../Registration/Registration";

interface LoginRegistrationProps {}
const LoginRegistration: FunctionComponent<LoginRegistrationProps> = () => {
  // выбор формы
  const [typeForm, setTypeForm] = useState<"login" | "registration">("login");
  // загрузка
  const [loading, setLoading] = useState(false);
  // контроллер для аборта при закрытии модалки
  const abortSignalref = useRef(new AbortController());
  // реф для изменения высоты вкладок
  const divHeightRef = useRef<HTMLDivElement>(null);
  // реф для сохранения значения прошлой высоты
  const prevHeightRef = useRef<number>(0);
  // обсервер за высотой формы
  const resizeObserverRef = useRef<ResizeObserver|null>(null);

  const updateHeight = () => {
    if (!divHeightRef.current || !divHeightRef.current.children[0]) return;
    overflowFunction("hidden"); // скрываем overflow
    const rect = divHeightRef.current.children[0].getBoundingClientRect();
    const pHeight = rect.height;
    if (prevHeightRef.current === pHeight) {
      //если высоты форм оказались одинаковы и транзишен не сработал, то сразу делаем видимым
      overflowFunction("visible");
    } else {
      divHeightRef.current.style.height = `${pHeight}px`;
    }
    prevHeightRef.current = pHeight;
  };

  // useEffect(() => {
  // этот юзэффект может понадобиться, если при изменении форм, условном рендеринге, тегам  добавить ключи
  // так как каждый раз надо будет подписываться на новый элемент
  //   if (!divHeightRef.current || !divHeightRef.current.children[0]) return;
  //   // Переподключаем ResizeObserver к новому элементу
  //   resizeObserverRef.current.disconnect();
  //   resizeObserverRef.current.observe(divHeightRef.current.children[0]);
  //   // Обновляем высоту сразу
  //   updateHeight();
  // }, [typeForm]);

  // Добавляем обработчики событий для transition
  useEffect(() => {
    //на всякий пожарный если анимация прервется до завершения, вернет оверфлоу в хидден
    // по окончании анимации без прерывания , вернет оверфлоу висибл
    resizeObserverRef.current = new ResizeObserver((entries) => {
      // Вызываем updateHeight при изменении размера
      updateHeight();
    })
    const divElement = divHeightRef.current;
    if (!divElement) return;

    const handleTransitionEnd = () => {
      overflowFunction("visible");
    };
    const handleTransitionCancel = () => {
      overflowFunction("hidden");
    };
    divElement.addEventListener("transitionend", handleTransitionEnd);
    divElement.addEventListener("transitioncancel", handleTransitionCancel);

    if (!divHeightRef.current || !divHeightRef.current.children[0]) return;
    resizeObserverRef.current.observe(divHeightRef.current.children[0]);
    return () => {
      abortSignalref.current.abort();
      divElement.removeEventListener("transitionend", handleTransitionEnd);
      divElement.removeEventListener(
        "transitioncancel",
        handleTransitionCancel
      );
      //
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, []);
  // эта функция нужна, чтоб изменять оверфлоу у модалки
  // так как выпадающие адреса ее перекрывают, и тогда оверфлов-хидден обрезает список адресов
  const overflowFunction = (flag: "hidden" | "visible") => {
    const modalWrapperElement = document.getElementById("modal_wrapper");
    const modalInnerElement = document.getElementById("modal_inner");
    if (!modalInnerElement || !modalWrapperElement || !divHeightRef.current) {
      return;
    }
    modalInnerElement.style.overflow = flag;
    modalWrapperElement.style.overflow = flag;
    divHeightRef.current.style.overflow = flag;
  };
  // divHeightRef

  return (
    <Container className={"w-[700px] max-w-[100%]"}>
      {/* Контейнер переключателей */}
      <div className="flex">
        <button
          onClick={() => setTypeForm("login")}
          className={`
            flex-1 py-2 text-center transition-all duration-500
            rounded-tl-lg border-0 text-gray-600 bg-gray-200
            hover:bg-[hsla(20,100%,96%,1)] font-[800]
          ${
            typeForm === "login"
              ? `text-[hsl(var(--primary-foreground))]
                shadow-[inset_-375px_-55px_55px_0_hsl(var(--primary))] 
                `
              : `
                duration-700
                shadow-[inset_0_-2px_0_0_hsl(var(--primary))]
                `
          }`}
        >
          <User size={"22px"} style={{ display: "inline-block" }} /> Вход
        </button>

        <button
          onClick={() => setTypeForm("registration")}
          className={`
            flex-1 py-2 text-center transition-all duration-500
            rounded-tr-lg border-0 text-gray-600 bg-gray-200
            hover:bg-[hsla(20,100%,96%,1)] font-[800]
          ${
            typeForm === "registration"
              ? `text-[hsl(var(--primary-foreground))]
                shadow-[inset_375px_-55px_55px_0_hsl(var(--primary))] 
              `
              : `duration-700
                shadow-[inset_0_-2px_0_0_hsl(var(--primary))] 
                `
          }`}
        >
          <UserPen size={"22px"} style={{ display: "inline-block" }} />{" "}
          Регистрация
        </button>
      </div>

      {/* логин и регистрация */}
      <div className="border-2 border-[hsl(var(--primary))] border-t-0 p-4 rounded-b-lg">
        <div
          ref={divHeightRef}
          className={`
            overflow-hidden transition-[height] duration-700 ease-in-out 
          `}
        >
          {/* //h-[85px] */}
          {typeForm === "login" ? (
            <div id="login">
              <Login
                loading={loading}
                setLoading={setLoading}
                abortSignalref={abortSignalref}
              />
            </div>
          ) : (
            <div id="registration">
              <Registration
                loading={loading}
                setLoading={setLoading}
                abortSignalref={abortSignalref}
              />
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default LoginRegistration;
