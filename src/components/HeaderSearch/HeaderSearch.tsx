"use client";
import { FunctionComponent, useEffect, useId, useState } from "react";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
// import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import Link from "next/link";
import apiClient from "@/../services/apiClient";
import { Product } from "@prisma/client";
import CONSTANTS_API from "../../../services/constantsApi";

// import fetch from 'next'
interface HeaderSearchProps {
  className?: string;
}

const HeaderSearch: FunctionComponent<HeaderSearchProps> = ({ className }) => {
  const id = useId();
  const [search, setSearch] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (isFocused) {
    }
  }, [isFocused]);

  useEffect(() => {
    setLoading(true);
    const delay = setTimeout(async () => {
      try {
        const product = await apiClient.searchProducts({ name: search.trim() });
        // console.log('product',product);

        setSearchResults(product);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    }, 500);
    return () => {
      if (delay) {
        clearTimeout(delay);
      }
    };
  }, [search]);
  //   const submit = () => {
  //     // const newSearchparams = new URLSearchParams(searchParams.toString());
  //     // newSearchparams.set("name", search);
  //     // router.push(`${pathname}${search ? "?" + newSearchparams.toString() : ""}`);
  //   };
  return (
    <>
      {isFocused && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black/50 bg-slate-400/80 z-30"></div>
      )}
      <div className={cn("relative", isFocused ? "z-30" : "", className)}>
        <form
          //   action={submit}
          className="flex rounded-2xl flex-1 justify-between relative h-11 items-center"
        >
          <label
            htmlFor={id}
            className="absolute top-1/2 translate-y-[-50%] left-3 h-5"
          >
            <Search className="h-5 text-gray-400 cursor-pointer" />
          </label>
          <Input
            id={id}
            className=" rounded-2xl outline-none w-full bg-gray-200 pl-11"
            placeholder="Поиск продукта"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            autoComplete="off"
          />
        </form>

        <div
          className={cn(
            "absolute w-full bg-white rounded-xl  top-14 shadow-md transition-all duration-300 invisible opacity-0 z-30 min-h-11 max-h-[500px] flex flex-col overflow-hidden",
            isFocused ? "visible opacity-100 top-12" : ""
          )}
        >
          {/* h-11  max-h-full overflow-y-auto py-2   px-5 py-1*/}

          <div className=" max-h-inherit overflow-y-auto scrl_glbl">
          {/* <div className="scrollbar w-2 bg-gray-200">
    <div className="scrollbar-thumb bg-primary rounded"></div>
    <div className="scrollbar-track bg-gray-200"></div>
  </div> */}
            {searchResults.length ? (
              searchResults.map((item) => (
                <Link
                  href={"/" + CONSTANTS_API.products + "/" + item.id}
                  className={cn(
                    "px-4 py-2 hover:bg-primary/20 cursor-pointer flex items-center gap-2",
                    loading ? "opacity-50 cursor-wait" : ""
                  )}
                  key={item.id}
                >
                  <img src={item.imageUrl} alt="продукт" className="w-7 h-7" />
                  <span>{item.name}</span>
                </Link>
              ))
            ) : (
              <p className="px-11 py-3">ни чего не найдено</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default HeaderSearch;
