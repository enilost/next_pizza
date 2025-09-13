"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { FunctionComponent, useEffect, useRef } from "react";
// import { ArrowUpDown } from "lucide-react";
// import { useHash } from "react-use";
import { useStoreCategory } from "@/store/category";
import LoginButton from "../LoginButton/LoginButton";
import HeaderCart from "../HeaderCart/HeaderCart";
import style from "./style.module.css";

interface CatigoriesProps {
  className?: string;
  categories: { id: number; name: string }[];
  // activeIndex: number;
}

const Catigories: FunctionComponent<CatigoriesProps> = ({
  className,
  categories = [],
  // activeIndex = 0,
}) => {
  const [activeCategoryId, setActiveCategoryId] = useStoreCategory((state) => [
    state.activeCategoryId,
    state.setActiveCategoryId,
  ]);
  const btnsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // делает активным первый элемент списка
    activeCategoryId === "" && setActiveCategoryId(categories[0].name || "");

    // обсервер, чтоб показывать кнопки корзины и логина при скролле вниз
    // когда кнопки хедера пропадают из вида
    let headerBtns: HTMLElement | null = document.getElementById("header_btns");

    // настройки обзервера
    let options = {
      // root: document.querySelector("body"),
      rootMargin: "0px",
      threshold: [0], //, 0.5, 1
    };
    // функция обзервера
    let callback = function (
      entries: IntersectionObserverEntry[],
      observer: IntersectionObserver
    ) {
      if (!btnsRef.current) return;
      if (entries[0].isIntersecting) {
        // Скрываем кнопку в категориях
        if (btnsRef.current.classList.contains("hidden")) {
          return; // чтоб первая анимация не мигала первый раз
        }
        // почему то стили style иногда глючат при переходе назад по роутам не применяются
        // btnsRef.current.classList.remove(style["show_buttons"]);
        // btnsRef.current.classList.add(style["hide_buttons"]);

        btnsRef.current.classList.remove("show_buttons");
        btnsRef.current.classList.add("hide_buttons");
      } else {
        // Показываем кнопку в категориях
        if (btnsRef.current.classList.contains("hidden")) {
          btnsRef.current.classList.remove("hidden");
        }
        // btnsRef.current.classList.add(style["show_buttons"]);
        // btnsRef.current.classList.remove(style["hide_buttons"]);

        btnsRef.current.classList.add("show_buttons");
        btnsRef.current.classList.remove("hide_buttons");
      }
    };

    let observer = new IntersectionObserver(callback, options);
    headerBtns && observer.observe(headerBtns as Element);

    return () => {
      if (observer) {
        observer.unobserve(headerBtns as Element);
        observer.disconnect();
      }
    };
  }, []);
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-7 -mx-3 px-3",
        "sticky top-0 bg-white py-4 shadow-lg shadow-black/5 z-10"
      )}
      id="categories"
    >
      <div
        className={cn(
          " inline-flex gap-1 bg-gray-50 p-1 rounded-2xl flex-wrap z-10",
          className
        )}
      >
        {categories.map((el, idx) => {
          return (
            <Link
              href={{ hash: el.name }}
              // href={"#"}
              key={idx + el.name}
              className={cn(
                "flex items-center font-bold h-11 rounded-2xl px-5",
                activeCategoryId == el.name &&
                  "bg-white shadow-md shadow-gray-200 text-primary"
              )}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                document
                  .getElementById(el.name)
                  ?.scrollIntoView({ behavior: "smooth", block: "center" });
              }}
              target="_self"
              onAuxClick={(e) => {
                // if (e.button === 1 || e.button === 2) {
                e.preventDefault();
                e.stopPropagation();
                return false;
                // }
              }}
            >
              <button>{el.name}</button>
            </Link>
          );
        })}
      </div>
      <div>
        <div
          className={cn("items-center gap-2 flex-wrap justify-end hidden")}
          // flex
          ref={btnsRef}
        >
          <LoginButton />
          <HeaderCart mountRequestFindCart={false} />
        </div>
      </div>
      {/* <div
      // bg-gray-50
        className={cn(
          "inline-flex items-center gap-1  px-5 h-[52px] rounded-2xl cursor-pointer bg-gray-50"
        )}
      >
        <ArrowUpDown size={16} />
        <b>Сортировка:</b>
        <b className={cn("text-primary")}>Популярное</b>
      </div> */}
    </div>
  );
};

export default Catigories;
