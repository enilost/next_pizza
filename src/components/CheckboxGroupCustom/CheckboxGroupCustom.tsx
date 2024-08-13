"use client";
import { FunctionComponent, useState } from "react";
import CheckboxCustom, {
  CheckboxCustomProps,
} from "../CheckboxCustom/CheckboxCustom";
import { cn } from "@/lib/utils";
import { Title } from "../Title/Title";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

type Item = CheckboxCustomProps;
interface CheckboxGroupCustomProps {
  title?: string;
  items: Item[];
  defaultItems?: Item[];
  searchInputPlaceholder?: string;
  className?: string;
  visibleLimit?: number;
  onChange?: (val: string[]) => void;
  defaultValue?: string[];
}
const ingridienst = [
  "сырный соус",
  "сырный соус",
  "сырный соус",
  "сырный соус",
  "сырный соус",
  "сырный соус",
  "сырный соус",
  "чеснок",
  "соленые огурчики",
  "сырный соус",
  "чеснок",
  "соленые огурчики",
  "сырный соус",
  "чеснок",
  "соленые огурчики",
];
const CheckboxGroupCustom: FunctionComponent<CheckboxGroupCustomProps> = ({
  className,
  visibleLimit,
  title,
  items,
  defaultItems,
  searchInputPlaceholder,
  defaultValue,
  onChange,
}) => {
  const [isShowAll, setIsShowAll] = useState(false);
  const [searchInputVal, setSearchInputVal] = useState("");

  const showAll = () => {
    setIsShowAll(!isShowAll);
  };
  return (
    <div className={className}>
      {title && (
        <Title size="h4" className="mb-5 font-bold mt-5">
          {title}
        </Title>
      )}

      {searchInputPlaceholder && (
        <div className="mb-5">
          <Input
            placeholder={searchInputPlaceholder}
            className="bg-gray-50 border-none"
            value={searchInputVal}
            onChange={(e) => {
              setSearchInputVal(e.target.value);
            }}
          />
        </div>
      )}

      <div
        className={cn(
          "flex flex-col gap-4 max-h-96 pr-2 overflow-auto scrollbar"
        )}
      >
        {ingridienst
          .filter((el) =>
            el
              .trim()
              .toLowerCase()
              .includes(searchInputVal.trim().toLowerCase())
          )
          .map((el, idx) => {
            if (visibleLimit && idx + 1 > visibleLimit && !isShowAll) {
              return null;
            }
            return (
              <CheckboxCustom
                label={el}
                value={idx + el}
                key={idx + el}
                endAdornment
                checked
                onCheckedChange={(items) => {
                  console.log(items);
                }}
              />
            );
          })}

        {/* {visibleNumber != undefined && isShowAll && <p onClick={showAll}>свернуть список</p>} */}
      </div>
      {visibleLimit != undefined &&
        ingridienst.filter((el) =>
          el.trim().toLowerCase().includes(searchInputVal.trim().toLowerCase())
        ).length > visibleLimit && (
          <div className="border-t border-t-neutral-100 mt-4 pt-3">
            <Button onClick={showAll} variant={"secondary"}>
              {isShowAll ? "- свернуть список" : "+ показать все"}
            </Button>
          </div>
        )}
    </div>
  );
};

export default CheckboxGroupCustom;
