import { cn } from "@/lib/utils";
import { FunctionComponent } from "react";
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
            placeholder="o"
            min={0}
            max={30000}
            defaultValue={0}
          />
          <Input
            type="number"
            placeholder="o"
            min={100}
            max={30000}
            defaultValue={3000}
          />
        </div>
        <RangeCustom min={0} max={30000} step={1} />
      </div>

      <Title size="h4" className="mb-5 font-bold mt-5">
        Ингридиенты
      </Title>
      <CheckboxGroupCustom visibleLimit={3} items={[]} searchInputPlaceholder="Поиск..."/>
      <div className={cn("flex flex-col gap-4")}>
        
      </div>
    </div>
  );
};

export default Filters;
