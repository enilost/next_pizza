"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { FunctionComponent } from "react";

import { ArrowUpDown } from "lucide-react";

import { useHash } from "react-use";
import { useStoreCategory } from "@/store/category";

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
  // const [ancor, setAncor] = useHash();
  console.log(categories);
  
  const [activeCategoryId, setActiveCategoryId] = useStoreCategory((state) => [
    state.activeCategoryId,
    state.setActiveCategoryId,
  ]);

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-7 ",
        "sticky top-0 bg-white py-5 shadow-lg shadow-black/5 z-10"
      )}
    >
      <div
        className={cn(
          " inline-flex gap-1 bg-gray-50 p-1 rounded-2xl flex-wrap",
          className
        )}
      >
        {categories.map((el, idx) => {
          return (
            <Link
              href={{ hash: el.name }}
              key={idx+el.name}
              className={cn(
                "flex items-center font-bold h-11 rounded-2xl px-5",
                activeCategoryId == el.name &&
                  "bg-white shadow-md shadow-gray-200 text-primary"
              )}
            >
              <button>{el.name}</button>
            </Link>
          );
        })}
      </div>

      <div
        className={cn(
          "inline-flex items-center gap-1 bg-gray-50 px-5 h-[52px] rounded-2xl cursor-pointer"
        )}
      >
        <ArrowUpDown size={16} />
        <b>Сортировка:</b>
        <b className={cn("text-primary")}>Популярное</b>
      </div>
    </div>
  );
};

export default Catigories;
