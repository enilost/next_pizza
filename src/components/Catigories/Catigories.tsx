"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  FunctionComponent,
  useDeferredValue,
  useEffect,
  useState,
  useTransition,
} from "react";
import { Button } from "../ui/button";
import { ArrowUpDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useHash, useLocation } from "react-use";
import { useStoreCategory } from "@/store/category";
// import { usePathname } from "next/navigation";

interface CatigoriesProps {
  className?: string;
  categories: { categoryID: number; name: string }[];
  // activeIndex: number;
}

const Catigories: FunctionComponent<CatigoriesProps> = ({
  className,
  categories = [],
  // activeIndex = 0,
}) => {
  const [ancor, setAncor] = useHash();
  //   console.log('useHash',ancor);
  // const [activeIdx, setActiveIdx] = useState(activeIndex);
  // const [is,trans]=useTransition()
//  const Router = useRouter()
  const [activeCategoryId, setActiveCategoryId] = useStoreCategory((state) => [
    state.activeCategoryId,
    state.setActiveCategoryId,
  ]);
  // useEffect(() => {
  //   setActiveIdx(+ancor[ancor.length - 1]);
  // }, [ancor]);
  // useDeferredValue(ancor)
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
              // href={`#${el.name + el.categoryID}`}
              href={{hash:el.name}}
              key={idx}
              className={cn(
                "flex items-center font-bold h-11 rounded-2xl px-5",
                // activeIdx == idx &&
                activeCategoryId == el.name &&
                  "bg-white shadow-md shadow-gray-200 text-primary"
              )}
              // onClick={() => setActiveIdx(el.categoryID)}
              onClick={() => {
                // setTimeout(() => {
                  
                //   // setActiveCategoryId(el.categoryID.toString())
                // }, 500);
              }}

              //   ;activeIndex = idx;return}}
            >
              <button>{el.name}</button>
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
        <ArrowUpDown size={16} />
        <b>Сортировка:</b>
        <b className={cn("text-primary")}>Популярное</b>
      </div>
    </div>
  );
};

export default Catigories;
