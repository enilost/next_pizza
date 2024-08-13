// 'use client'
import { cn } from "@/lib/utils";
import Link from "next/link";
import { FunctionComponent } from "react";
import { Button } from "../ui/button";
import { ArrowUpDown } from "lucide-react";
// import { usePathname } from "next/navigation";

interface CatigoriesProps {
  className?: string;
  categories: string[];
  activeIndex: number;
}
const cat = [
  "Пиццы",
  "Комбо",
  "Дессерты",
  "Кофе",
  "Коктейли",
  "Пиццы",
  "Пиццы",
  "Напитки",
];
const activeIdx: number = 0;
const Catigories: FunctionComponent<CatigoriesProps> = ({
  className,
  categories = cat,
  activeIndex = activeIdx,
}) => {
  //   const pathName = usePathname();
  return (
    <div className={cn("flex items-center justify-between gap-7 ","sticky top-0 bg-white py-5 shadow-lg shadow-black/5 z-10")}>
      <div
        className={cn(
          " inline-flex gap-1 bg-gray-50 p-1 rounded-2xl flex-wrap",
          className
        )}
      >
        {categories.map((el, idx) => {
          return (
            <Link
              href={"/"}
              key={idx}
              className={cn(
                "flex items-center font-bold h-11 rounded-2xl px-5",
                activeIndex == idx &&
                  "bg-white shadow-md shadow-gray-200 text-primary"
              )}
              //   onClick={()=>{console.log('onclick ',activeIndex);
              //   ;activeIndex = idx;return}}
            >
              <button>{el}</button>
            </Link>
            // <div key={idx}>{el}</div>
          );
        })}
      </div>

      <div
        className={cn(
          "inline-flex items-center gap-1 bg-gray-50 px-5 h-[52px] rounded-2xl cursor-pointer"
        )}
      >
        <ArrowUpDown size={16}/>
        <b>Сортировка:</b>
        <b className={cn('text-primary')}>Популярное</b>
      </div>
    </div>
  );
};

export default Catigories;
