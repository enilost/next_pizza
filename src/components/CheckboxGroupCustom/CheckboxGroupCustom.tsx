"use client";
import { FunctionComponent, useState ,memo} from "react";
import CheckboxCustom, {
  CheckboxCustomProps,
} from "../CheckboxCustom/CheckboxCustom";
import { cn } from "@/lib/utils";
import { Title } from "../Title/Title";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Ingredient } from "@prisma/client";
import { Skeleton } from "../ui/skeleton";
// import { sizeItem } from "../Filters/Filters";

type Item = CheckboxCustomProps;
type Item2 = { id: number; name: string; checked: boolean };
interface CheckboxGroupCustomProps {
  title?: string;
  // items: Item[];
  // items: ({ checked: boolean } & Ingredient)[] | sizeItem[];
  items:  Item2[];
  defaultItems?: Item[];
  searchInputPlaceholder?: string;
  className?: string;
  visibleLimit?: number;
  // onChange?: (val: string[]) => void;
  onCheckedChange?: (val: boolean, id: number) => void;
  defaultValue?: string[];
  loading?: boolean;
}
const MemoCheckboxCustom= memo(CheckboxCustom, (prevProps, nextProps) => {
  return prevProps.checked == nextProps.checked;
});
const CheckboxGroupCustom: FunctionComponent<CheckboxGroupCustomProps> = ({
  className,
  visibleLimit,
  title,
  items,
  defaultItems,
  searchInputPlaceholder,
  defaultValue,
  onCheckedChange,
  loading
}) => {
  const [isShowAll, setIsShowAll] = useState(false);
  const [searchInputVal, setSearchInputVal] = useState("");

  const showAll = () => {
    setIsShowAll(!isShowAll);
  };

  if (loading) {
    return (
      <div className={className}>
        {title && (
          <Title size="h4" className="mb-5 font-bold mt-5">
            {title}
          </Title>
        )}
        <div
          className={cn(
            "flex flex-col gap-4 max-h-96 pr-2 overflow-auto scrollbar"
          )}
        >
          {searchInputPlaceholder && <Skeleton  className="h-9 mb-1"></Skeleton>}
          {Array.from({ length: visibleLimit||3 }).map((el, idx) => {
            return (<Skeleton key={idx} className="h-5 mb-1"></Skeleton>)
          })}
        </div>
      </div>
    );
  }
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
        {items
          .filter((el) =>
            el.name
              .trim()
              .toLowerCase()
              .includes(searchInputVal.trim().toLowerCase())
          )
          .map((el, idx) => {
            if (visibleLimit && idx + 1 > visibleLimit && !isShowAll) {
              return null;
            }
            return (
              <MemoCheckboxCustom
                label={el.name}
                value={el.name}
                key={el.id}
                endAdornment
                checked={el.checked}
                // value={el.checked}
                onCheckedChange={(checked) => {
                  if (typeof onCheckedChange == "function") {
                    onCheckedChange(checked, el.id);
                  }
                }}
              />
            );
          })}

        {/* {visibleNumber != undefined && isShowAll && <p onClick={showAll}>свернуть список</p>} */}
      </div>
      {visibleLimit != undefined &&
        items.filter((el) =>
          el.name
            .trim()
            .toLowerCase()
            .includes(searchInputVal.trim().toLowerCase())
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
