"use client";
import { cn } from "@/lib/utils";
import {
  ChangeEvent,
  ChangeEventHandler,
  FunctionComponent,
  useState,
} from "react";
import { Title } from "../Title/Title";
import { Checkbox } from "../ui/checkbox";
import CheckboxCustom from "../CheckboxCustom/CheckboxCustom";
import { Input } from "../ui/input";
import { RangeCustom } from "../RangeCustom/RangeCustom";
import CheckboxGroupCustom from "../CheckboxGroupCustom/CheckboxGroupCustom";

interface FiltersProps {
  className?: string;
}

const Filters: FunctionComponent<FiltersProps> = ({ className }) => {
  const [price, setPrice] = useState<[number, number]>([0, 3000]);
  const minMaxRange = [0, 3000];

  const changePrice = (event: ChangeEvent<HTMLInputElement>, idx: number) => {
    const value = event.target.value//.replace(/[^0-9]/g, "");
    setPrice((prev): [number, number] => {
      const newVal = [...prev];
      newVal[idx] = +value;
      return newVal as [number, number];
    });
  };
  return (
    <div className={cn("", className)}>
      <Title size="h4" className="mb-5 font-bold">
        Фильтрация
      </Title>
      <div className={cn("flex flex-col gap-4")}>
        <CheckboxCustom label={"Можно собирать"} value="1" />
        <CheckboxCustom label={"Новинки"} value={"2"} />
      </div>

      <div className={cn("mt-5 border-y border-y-neutral-100 py-6 pb-7")}>
        <Title size="h5" className="mb-5 font-bold">
          Цена от и до
        </Title>
        <div className={cn("flex gap-3 mb-5")}>
          <Input
            type="number"
            placeholder={minMaxRange[0]+''}
            min={minMaxRange[0]}
            max={minMaxRange[1]}
            value={price[0]}
            // defaultValue={price[0]}
            onChange={(e) => {
              changePrice(e, 0);
            }}
          />
          <Input
            type="number"
            placeholder={minMaxRange[1]+''}
            min={100}
            max={minMaxRange[1]}
            value={price[1]}
            // defaultValue={price[1]}
            onChange={(e) => {
              changePrice(e, 1);
            }}
          />
        </div>
        <RangeCustom
          min={minMaxRange[0]}
          max={minMaxRange[1]}
          step={1}
          value={price}
          onValueChange={setPrice}
        />
      </div>

      <Title size="h4" className="mb-5 font-bold mt-5">
        Ингридиенты
      </Title>
      <CheckboxGroupCustom
        visibleLimit={3}
        items={[]}
        searchInputPlaceholder="Поиск..."
      />
      <div className={cn("flex flex-col gap-4")}></div>
    </div>
  );
};

export default Filters;
