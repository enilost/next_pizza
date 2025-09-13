import { ChangeEvent, FunctionComponent, useRef, useState } from "react";
import DadataAddress, { I_dadataAddress } from "../DadataAddress/DadataAddress";
import PersonalInfo from "../PersonalInfo/PersonalInfo";
import { Button } from "../ui/button";
import CustomInput from "../CustomInput/CustomInput";
import { useStoreWithEqualityFn } from "zustand/traditional";
import { useStoreUser } from "@/store/user";
import toast from "react-hot-toast";
// import { registration } from "../../../services/auth";
import { AxiosError } from "axios";
import { IReturnUser } from "@/app/api/auth/route";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";

interface RegistrationProps {
  // loading: boolean;
  // setLoading: (value: boolean) => void;
  abortSignalref?: React.MutableRefObject<AbortController>;
}

const Registration: FunctionComponent<RegistrationProps> = ({
  // loading,
  // setLoading,
  abortSignalref,
}) => {
  const [password, setPassword] = useState("");
  const [validErrorPassword, setValidErrorPassword] = useState<string | null>(
    null
  );

  const Router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const { registration, loading } = useAuth();
  const [validError] = useStoreWithEqualityFn(
    useStoreUser,
    (state) => [state.validError],
    (prev, next) => true
  );
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

  const validErrorAndToast = () => {
    let isError = false;
    // валидация полей personalInfo, которая проходит в store и сама вызывает свой тост
    const validErrPersonalInfo = validError();
    // если не трогали инпут пароля, триггерим его валидацию
    if (!password && !validErrorPassword) {
      const e = {
        target: { value: password },
      } as ChangeEvent<HTMLInputElement>;
      handlePassword(e);
      // если валидация полей personalInfo прошла без ошибок, тогда вызываем тост
      // на ошибку пустого пароля
      !validErrPersonalInfo &&
        toast.error("Заполните правильно все необходимые поля.");
    }
    // если ошибка в пароле и нет ошибки в personalInfo, то вызываем тост
    validErrorPassword &&
      !validErrPersonalInfo &&
      toast.error("Заполните правильно все необходимые поля.");
    if (
      validErrPersonalInfo ||
      validErrorPassword ||
      (!password && !validErrorPassword)
    ) {
      isError = true;
    }
    return isError;
  };

  const submitForm = async () => {
    if (loading) return;
    if (validErrorAndToast()) return;

    try {
      // setLoading(true);
      const userState = useStoreUser.getState();
      if (!userState.address) return;
      const newUser = {
        email: userState.email,
        password: password,
        // fullName: userState.firstName + " " + userState.lastName,
        firstName: userState.firstName,
        lastName: userState.lastName,
        phone: userState.phone,
        address: userState.address,
      };

      const resUser = await registration(
        newUser
        // abortSignalref?.current.signal
      );
      // setUserState(resUser);
      // toast.success("Регистрация прошла успешно");

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
    }
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submitForm();
      }}
      ref={formRef}
    >
      <DadataAddress />
      <PersonalInfo />
      <div className="grid grid-cols-2 gap-x-5 gap-y-1">
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

      <div className="flex flex-col items-center mt-3">
        <Button
          className="max-w-[350px] w-[100%] h-12 text-base mb-2"
          disabled={loading}
          loading={loading}
        >
          Зарегистрироваться
        </Button>
      </div>
    </form>
  );
};

export default Registration;
