// import React, { ButtonHTMLAttributes } from "react";
import { FunctionComponent, useId } from "react";
import { Checkbox } from "../ui/checkbox";

export interface CheckboxCustomProps {
  label: string;
  value: string;
  endAdornment?: React.ReactNode;
  onCheckedChange?: (checked: boolean) => void;
  checked?: boolean;
}

const CheckboxCustom:  FunctionComponent<CheckboxCustomProps> = ({
  label,
  value,
  endAdornment,
  onCheckedChange,
  checked,
}) => {
  const id = useId()
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        onCheckedChange={onCheckedChange}
        checked={checked}
        value={value}
        className="rounded-[8px] w-6 h-6 border-none bg-gray-100"
        // id={`checkbox-${String(value)}`}
        id={`checkbox-${id}`}
      />
      <label
        // htmlFor={`checkbox-${String(value)}`}
        htmlFor={`checkbox-${id}`}
        className="leading-none cursor-pointer flex-1"
      >
        {label}
      </label>
      {endAdornment}
    </div>
  );
};

export default CheckboxCustom;
