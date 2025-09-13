"use client";
import { ChangeEvent, FunctionComponent } from "react";
import { useStoreUser } from "@/store/user";
import { useStoreWithEqualityFn } from "zustand/traditional";
import CustomInput from "../CustomInput/CustomInput";
interface PersonalInfoProps {}

const PersonalInfo: FunctionComponent<PersonalInfoProps> = () => {
  const [
    firstName,
    setFirstName,
    validErrorFirstName,
    lastName,
    setLastName,
    validErrorLastName,
    phone,
    setPhone,
    validErrorPhone,
    email,
    setEmail,
    validErrorEmail,
  ] = useStoreWithEqualityFn(
    useStoreUser,
    (state) => [
      state.firstName,
      state.setFirstName,
      state.validErrorFirstName,

      state.lastName,
      state.setLastName,
      state.validErrorLastName,

      state.phone,
      state.setPhone,
      state.validErrorPhone,

      state.email,
      state.setEmail,
      state.validErrorEmail,
    ],
    (prev, next) => {
      return (
        prev[0] === next[0] && // firstName
        prev[2] === next[2] && // validErrorFirstName
        prev[3] === next[3] && // lastName
        prev[5] === next[5] && // validErrorLastName
        prev[6] === next[6] && // phone
        prev[8] === next[8] && // validErrorPhone
        prev[9] === next[9] && // email
        prev[11] === next[11] // validErrorEmail
      );
    }
  );
  const PHONE_MASK: Array<string | RegExp> = [
    "+",
    "7",
    " ",
    "(",
    /\d/,
    /\d/,
    /\d/,
    ")",
    " ",
    /\d/,
    /\d/,
    /\d/,
    "-",
    /\d/,
    /\d/,
    "-",
    /\d/,
    /\d/,
  ];

  const setValueAndValid = (
    // value: string,
    setValue: (value: string) => void
  ) => {
    return (e: ChangeEvent<HTMLInputElement>) => {
      const txtValue = e.target.value;
      // const txtError = Schema.safeParse(txtValue).error?.errors[0].message || "";

      // txtError !== textError && setTextError(txtError);
      // value !== txtValue &&
      setValue(txtValue);
    };
  };
  const handleFirstName = setValueAndValid(setFirstName);
  const handleLastName = setValueAndValid(setLastName);
  const handlePhone = setValueAndValid(setPhone);
  const handleEmail = setValueAndValid(setEmail);

  // console.log("PersonalInfo ");

  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-1">
      <CustomInput
        name="firstName"
        value={firstName}
        onChange={handleFirstName}
        validError={validErrorFirstName}
        label={"Имя"}
        placeholder={"Имя"}
        id={"firstName"}
        regexpReplace={/[^a-zA-Zа-яА-Я\-]/g}
        onBlur={handleFirstName}
      />

      <CustomInput
        name="lastName"
        value={lastName}
        onChange={handleLastName}
        validError={validErrorLastName}
        label={"Фамилия"}
        placeholder={"Фамилия"}
        id={"lastName"}
        regexpReplace={/[^a-zA-Zа-яА-Я\-]/g}
        onBlur={handleLastName}
      />

      <CustomInput
        name="phone"
        value={phone}
        onChange={handlePhone}
        mask={PHONE_MASK}
        validError={validErrorPhone}
        label={"Tелефон"}
        placeholder={"Tелефон"}
        id={"phone"}
        type={"tel"}
        onBlur={handlePhone}
      />

      <CustomInput
        name="email"
        value={email}
        onChange={handleEmail}
        validError={validErrorEmail}
        label={"Email"}
        placeholder={"Email"}
        id={"email"}
        type={"email"}
        onBlur={handleEmail}
        autoComplete="email"
      />
    </div>
  );
};

export default PersonalInfo;

