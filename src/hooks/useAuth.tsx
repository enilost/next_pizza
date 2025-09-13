import { HookCallbacks } from "async_hooks";
import { FunctionComponent, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import apiClient from "../../services/apiClient";
import { useStoreCart } from "@/store/cart";
import { LOCALSTORAGE_USER_NAME } from "@/constants/constants";
import { useStoreWithEqualityFn } from "zustand/traditional";
import { useStoreUser } from "@/store/user";
import { IReturnUser } from "@/app/api/auth/route";
import { AxiosError } from "axios";
import { I_dadataAddress } from "@/components/DadataAddress/DadataAddress";

type authArgs = {
  email: {
    email: string;
    password: string;
  };
  phone: {
    phone: string;
    password: string;
  };
};
export type authDataType = {
  [Key in keyof authArgs]: authArgs[Key] & {
    cart?: {
      id: number;
      userId: number | null;
    };
  };
};

type regT = {
  phone: string;
  email: string;
  password: string;
  address: I_dadataAddress;
};
export type regArgType = regT & {
  firstName: string;
  lastName: string;
};
export type regDataType = regT & {
  fullName: string;
  cart?: {
    id: number;
    userId: number | null;
  };
};
interface UseAuthProps {}

const useAuth = () => {
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
    clear,
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
      state.clear,
    ],
    (prev, next) =>
      prev[0] === next[0] && //email
      prev[2] === next[2] && //validEmail
      prev[3] === next[3] && //phone
      prev[5] === next[5] //validPhone
  );
  // получаем корзину и ее итемы
  const [getCartAndItems] = useStoreCart((state) => [state.getCartAndItems]);
  // загрузка
  const [loading, setLoading] = useState(false);

  // отмена запроса при размонтировании
  const abortSignalref = useRef(new AbortController());
  // выход из аккаунта
  const logout = async () => {
    try {
      // выходим удаляя кукуъ корзины и авторизации
      await apiClient.logout();
      //   удаляем данные профиля из локалстораджа
      localStorage.removeItem(LOCALSTORAGE_USER_NAME);
      // очищаем стейт юзера
      clear();
      // получаем корзину по куке,
      // так как куки уже нет, то вернет пустую корзину в стор, без создания ее на бэке
      // при добавлении итема в пустую корзину, она создастся на бэке
      await getCartAndItems("find");
      toast.success("Вы вышли из аккаунта");
      //   throw new Error("logout error");
    } catch (error) {
      console.log("useAuth logout catch error", error);
      toast.error("Ошибка при выходе из аккаунта");
      throw error;
    }
  };

  // вход в аккаунт

  const auth = async (data: authArgs[keyof authArgs]) => {

    
    try {
      setLoading(true);
      const cart = useStoreCart.getState().cart;
      switch (true) {
        case "email" in data: {
          // находим юзера по email
          // ответ записывает с ним куку юзера и корзины (если есть)
          const user = await apiClient.authEmail(
            "id" in cart
              ? { ...data, cart: { id: cart.id, userId: cart.userId } }
              : data,
            abortSignalref.current.signal
          );

          
          // вводим его данные из ответа
          setUserState(user); //в стор для автозаполнения полей
          setUserLocalStorage(user); //в локалсторадж для стр профиля
          // получаем корзину по полученной куке
          await getCartAndItems("find");
          toast.success("Вы успешно вошли в аккаунт");
          // return user;
          break;
        }
        case "phone" in data: {
          // находим юзера по email
          // ответ записывает с ним куку юзера и корзины (если есть)
          const user = await apiClient.authPhone(
            "id" in cart
              ? { ...data, cart: { id: cart.id, userId: cart.userId } }
              : data,
            abortSignalref.current.signal
          );
          // вводим его данные из ответа
          setUserState(user); //в стор для автозаполнения полей
          setUserLocalStorage(user); //в локалсторадж для стр профиля
          // получаем корзину по полученной куке
          await getCartAndItems("find");
          toast.success("Вы успешно вошли в аккаунт");
          // return user;
          break;
        }
        default: {
          const n: never = data;
          // return n;
          break;
        }
      }
    } catch (error) {
      console.log("useAuth.tsx auth catch error", error);
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
      throw error;
    } finally {
      setLoading(false);
    }
  };
  const isCheckAuth = async () => {
    // const isAuth = useStoreUser.getState().isAuth;
    // if(isAuth !== null) return;
    try {
      const user = await apiClient.isCheckAuth();
      setUserState(user); //в стор для автозаполнения полей
      setUserLocalStorage(user); //в локалсторадж для стр профиля
      setIsAuth(true);
      // toast.success(`С возвращением , ${user.fullName}.`);
    } catch (error) {
      localStorage.removeItem(LOCALSTORAGE_USER_NAME);
      setIsAuth(false);
      // console.log("useAuth.tsx isCheckAuth error", error);
    } finally {
      () => {};
    }
  };
  // регистрация
  const registration = async (data: regArgType) => {
    try {
      setLoading(true);
      const { firstName, lastName, ...rest } = data;
      const cart = useStoreCart.getState().cart;
      const cartData =
        "id" in cart ? { cart: { id: cart.id, userId: cart.userId } } : {};
      const regData = {
        ...rest,
        fullName: firstName + " " + lastName,
        ...cartData,
      };
      const user = await apiClient.registration(
        regData,
        abortSignalref.current.signal
      );
      // вводим его данные из ответа
      setUserState(user); //в стор для автозаполнения полей
      setUserLocalStorage(user); //в локалсторадж для стр профиля
      // получаем корзину по полученной куке
      getCartAndItems("find");
      toast.success("Вы успешно зарегистрировались");
    } catch (error) {
      console.log("useAuth.tsx registration catch error", error);
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
  const setUserState = (user: IReturnUser) => {
    const [firstName, lastName] = user.fullName.split(" ");
    setFirstName(firstName);
    setLastName(lastName);
    setPhone(user.phone);
    setEmail(user.email);
    const typedAddress = user.address as unknown as I_dadataAddress;
    setAddress(typedAddress);
    setQueryInputAddress(typedAddress.value);
    setIsAuth(true);
  };
  const setUserLocalStorage = (user: IReturnUser) => {
    const [firstName, lastName] = user.fullName.split(" ");
    const typedAddress = user.address as unknown as I_dadataAddress;
    const localStrUser = {
      firstName,
      lastName,
      email: user.email,
      phone: user.phone,
      address: typedAddress.value,
    };
    localStorage.setItem(LOCALSTORAGE_USER_NAME, JSON.stringify(localStrUser));
  };
  useEffect(() => {
    return () => {
      abortSignalref.current.abort();
    };
  }, []);
  return {
    logout,
    auth,
    loading,
    isCheckAuth,

    registration,
  };
};

export default useAuth;

type flagType = "email" | "phone";
