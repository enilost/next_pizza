import { ChangeEvent, FunctionComponent, memo } from "react";
import MaskedInput from "react-text-mask";
import { Input } from "../ui/input";

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    validError: string | null;
    label: string;
    mask?: (string | RegExp)[];
    regexpReplace?: RegExp;
  }
  const CustomInput: FunctionComponent<CustomInputProps> = memo(
    ({ mask, label, validError, regexpReplace, ...props }) => {

      return (
        <div>
          {props.value && (
            <label
              htmlFor={props.id}
              className="block text-sm font-medium text-gray-700 pl-3 cursor-pointer"
            >
              {label}
            </label>
          )}
          <MaskedInput
            mask={mask || false}
            // guide={false}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              if (regexpReplace) {
                let stringValue = e.target.value;
                stringValue = stringValue.replace(regexpReplace, "");
                const newEvent = {
                  ...e,
                  target: {
                    ...e.target,
                    value: stringValue,
                  },
                };
                props.onChange?.(newEvent);
                return;
              }
              props.onChange?.(e);
            }}
            onBlur={props.onBlur}
            render={(ref, renderProps) => {
              return (
                <Input
                  // @ts-ignore
                  ref={ref}
                  // value={value}
                  className={[
                    "text-base",
                    props.value ? "" : "mt-5",
                    validError ? "border-red-400" : "mb-6 ",
                  ].join(" ")}
                  {...props}
                  {...renderProps}
                />
              );
            }}
          />
          {validError && <p className="pl-3 text-red-400">{validError}</p>}
        </div>
      );
    },
    (prevProps, newProps) => {
      // return false;
      return (
        prevProps.value === newProps.value &&
        prevProps.validError === newProps.validError
      );
    }
  );
  CustomInput.displayName = "CustomInput";
  export default CustomInput;