"use client";
import { cn } from "@/lib/utils";
import { FunctionComponent } from "react";
interface Variant {
  id: number;

  name: string;
  value: string;
  disabled?: boolean;
}
interface RadioCustomProps {
  items: readonly Variant[];
  //   defaultValue?: string;
  onClick?: (value: Variant) => void;
  selectedValue?: Variant["value"];
  // selectedValue?: Variant["id"];
  className?: string;
}

const RadioCustom: FunctionComponent<RadioCustomProps> = ({
  selectedValue,
  onClick,
  items,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex justify-between bg-gray-100 rounded-3xl p-1 select-none",
        className
      )}
    >
      {items.map((el, index) => (
        <button
          key={index}
          onClick={() => onClick?.(el)}
          className={cn(
            "flex items-center justify-center cursor-pointer h-[30px] px-5 flex-1 rounded-3xl transition-all duration-400 text-sm py-5",
            {
              "bg-white shadow": el.value == selectedValue,
              // "bg-white shadow": el.id+"" == selectedValue,
              "text-gray-500 opacity-50 pointer-events-none": el.disabled,
            }
          )}
        >
          {el.name}
        </button>
      ))}
    </div>
  );
};

export default RadioCustom;
