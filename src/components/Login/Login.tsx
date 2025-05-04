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
import {
  authEmail,
  authPhone,
  isCheckAuth,
  logout,
} from "../../../services/auth";
import { I_dadataAddress } from "../DadataAddress/DadataAddress";
import { AxiosError } from "axios";
import { IReturnUser } from "@/app/api/auth/route";
import { useRouter } from "next/navigation";
interface LoginProps {
  loading: boolean;
  setLoading: (value: boolean) => void;
  abortSignalref?: React.MutableRefObject<AbortController>;
}

const Login: FunctionComponent<LoginProps> = ({
  loading,
  setLoading,
  abortSignalref,
}) => {
  const [phoneOrEmail, setPhoneOrEmail] = useState<"phone" | "email">("email");
  const [password, setPassword] = useState("");
  const [validErrorPassword, setValidErrorPassword] = useState<string | null>(
    null
  );
  const Router = useRouter();
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
    ],
    (prev, next) =>
      prev[0] === next[0] && //email
      prev[2] === next[2] && //validEmail
      prev[3] === next[3] && //phone
      prev[5] === next[5] //validPhone
  );
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
  const setUserState = (user: IReturnUser) => {
    const [firstName, lastname] = user.fullName.split(" ");
    setFirstName(firstName);
    setLastName(lastname);
    setPhone(user.phone);
    setEmail(user.email);
    user.address && setAddress(user.address as unknown as I_dadataAddress);
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
      setLoading(true);
      if (phoneOrEmail === "phone") {
        console.log("вход по телефону");
        const user = await authPhone(
          {
            phone,
            password,
          },
          abortSignalref?.current.signal
        );

        setUserState(user);
        toast.success("Вы успешно вошли в аккаунт");
      } else if (phoneOrEmail === "email") {
        console.log("вход по почте");
        const user = await authEmail(
          {
            email,
            password,
          },
          abortSignalref?.current.signal
        );

        setUserState(user);
        // // есть ли история для шага назад
        // const hasPreviousPage = window.history.length > 1;
        // // прошлая страница была на этом же сайте
        // const isSameDomain =
        //   document.referrer &&
        //   new URL(document.referrer).hostname === window.location.hostname;
        // if (user._redirect) {
        //   Router.push(user._redirect);
        // } else if (hasPreviousPage && isSameDomain) {
        //   Router.back();
        // } else {
        //   Router.push("/");
        // }
        Router.push("/");
        toast.success("Вы успешно вошли в аккаунт");
      }
    } catch (error) {
      console.log("Login.tsx error ", error);
      if (error instanceof AxiosError) {
        if (error.response) {
          // Сервер вернул ответ со статусом, отличным от 2xx
          toast.error(
            error.response.data.message || `Ошибка: ${error.response.status}`
          );
        } else if (error.config?.signal?.aborted) {
          // если запрос отменен абортконтроллером
          toast.error("Запрос отменен");
        } else if (error.request) {
          // Запрос был сделан, но ответ не получен
          toast.error("Сервер не отвечает. Пожалуйста, попробуйте позже.");
        } else {
          // Что-то пошло не так при настройке запроса
          toast.error(`Ошибка: ${error.message}`);
        }
      } else {
        // Обработка не-Axios ошибок
        toast.error("Произошла неизвестная ошибка");
      }
    } finally {
      setLoading(false);
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
  }, []);
  const isCheckAuthFunc = async () => {
    // let decodet = await isCheckAuth();
    // console.log("decodet ", decodet);
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submitForm();
      }}
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
            // logout();
            // isCheckAuthFunc();
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
