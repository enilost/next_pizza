"use client";
import {
  ChangeEvent,
  FunctionComponent,
  useEffect,
  useRef,
  useState,
} from "react";
import CustomInput from "../CustomInput/CustomInput";
import { useStoreWithEqualityFn } from "zustand/traditional";
import { useStoreUser } from "@/store/user";
import { Button } from "../ui/button";
import toast from "react-hot-toast";

import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";

interface LoginProps {
  // loading: boolean;
  // setLoading: (value: boolean) => void;
  abortSignalref?: React.MutableRefObject<AbortController>;
}

const Login: FunctionComponent<LoginProps> = ({
  // loading,
  // setLoading,
  abortSignalref,
}) => {
  const [phoneOrEmail, setPhoneOrEmail] = useState<"phone" | "email">("email");
  const [password, setPassword] = useState("");
  const [validErrorPassword, setValidErrorPassword] = useState<string | null>(
    null
  );
  const Router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

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
  const [
    email,
    setEmail,
    validErrorEmail,
    phone,
    setPhone,
    validErrorPhone,
    setFirstName,
    setLastName,
    setAddress,
    setQueryInputAddress,
    setIsAuth,
  ] = useStoreWithEqualityFn(
    useStoreUser,
    (state) => [
      state.email,
      state.setEmail,
      state.validErrorEmail,

      state.phone,
      state.setPhone,
      state.validErrorPhone,

      state.setFirstName,
      state.setLastName,
      state.setAddress,
      state.setQueryInputAddress,
      state.setIsAuth,
    ],
    (prev, next) =>
      prev[0] === next[0] && //email
      prev[2] === next[2] && //validEmail
      prev[3] === next[3] && //phone
      prev[5] === next[5] //validPhone
  );
  const { auth, loading } = useAuth();
  const handleEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handlePhone = (e: ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
  };
  const handlePassword = (e: ChangeEvent<HTMLInputElement>) => {
    const valid = handleValidPassword(e.target.value);
    setPassword(e.target.value);
    setValidErrorPassword(valid);
  };
  const handleValidPassword = (password: string) => {
    if (password.length < 3) {
      return "Пароль должен быть не менее 3 символов";
    }
    return null;
  };

  const submitForm = async () => {
    if (loading) return;
    if (isValidErrors()) {
      const notify = () =>
        toast.error("Правильно заполните все необходимые поля");
      notify();
      return;
    }
    try {
      // setLoading(true);
      // let user: IReturnUser | null = null;
      if (phoneOrEmail === "phone") {
        // console.log("вход по телефону");
        await auth({ phone, password });
      } else {
        // console.log("вход по почте");
        await auth({ email, password });
      }
      // setUserState(user);
      // есть ли история для шага назад(излишняя проверка можно удалить)
      const hasPreviousPage = window.history.length > 1;
      // это происходит в модальном окне?
      const modalWrapper = document.getElementById("modal_wrapper");
      const isModal = modalWrapper?.contains(formRef.current);
      // если есть история и мы в модалке, значит роут перехвачен
      // то возвращаемся на предыдущую страницу
      // иначе переходим на главную страницу
      if (hasPreviousPage && isModal) {
        Router.back();
      } else {
        Router.push("/");
      }
    } catch (error) {
      console.log("Login.tsx error ", error);
    } finally {
      // setLoading(false);
    }
  };

  const isValidErrors = () => {
    let isError = false;
    // если не трогали инпут пароля, триггерим его валидацию
    if (!password && !validErrorPassword) {
      const e = {
        target: { value: password },
      } as ChangeEvent<HTMLInputElement>;
      handlePassword(e);
      isError = true;
    }
    // вход по телефонуъ
    if (phoneOrEmail === "phone") {
      // если не трогали инпут телефона, триггерим его валидацию
      if (!phone && !validErrorPhone) {
        setPhone(phone);
        isError = true;
      }
      // если есть ошибки валидации
      if (validErrorPassword || validErrorPhone) {
        isError = true;
      }
    }
    // вход по почте
    else if (phoneOrEmail === "email") {
      // если не трогали инпут емайла, триггерим его валидацию
      if (!email && !validErrorEmail) {
        setEmail(email);
        isError = true;
      }
      // если есть ошибки валидации
      if (validErrorPassword || validErrorEmail) {
        isError = true;
      }
    }
    return isError;
  };
  useEffect(() => {
    setEmail("user@test.ru");
    setPassword("123123");
  }, []);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submitForm();
      }}
      ref={formRef}
    >
      <div className="grid grid-cols-2 gap-x-5 gap-y-1 mb-3">
        {phoneOrEmail === "phone" ? (
          <CustomInput
            name="phone"
            value={phone}
            onChange={handlePhone}
            mask={PHONE_MASK}
            validError={validErrorPhone}
            label={"Tелефон"}
            placeholder={"Tелефон"}
            id={"modalPhone"}
            type={"tel"}
            onBlur={handlePhone}
            key={"phone"}
            autoComplete="tel"
          />
        ) : (
          <CustomInput
            name="email"
            value={email}
            onChange={handleEmail}
            validError={validErrorEmail}
            label={"Email"}
            placeholder={"Email"}
            id={"modalEmail"}
            type={"email"}
            onBlur={handleEmail}
            key={"email"}
            autoComplete="email"
          />
        )}
        <CustomInput
          name="pass"
          value={password}
          onChange={handlePassword}
          validError={validErrorPassword}
          label={"Пароль"}
          placeholder={"Пароль"}
          id={"modalPass"}
          type={"password"}
          onBlur={handlePassword}
          autoComplete="current-password"
        />
      </div>
      <div className="flex flex-col items-center">
        <Button
          className="max-w-[350px] w-[100%] h-12 text-base mb-4"
          type="submit"
          disabled={loading}
          loading={loading}
        >
          Войти
        </Button>
        <span
          className="text-md hover:text-[hsl(var(--primary))] cursor-pointer"
          onClick={() => {
            setPhoneOrEmail(phoneOrEmail === "phone" ? "email" : "phone");
          }}
        >
          войти по {phoneOrEmail === "phone" ? "почте" : "телефону"}
        </span>
      </div>
    </form>
  );
};

export default Login;
