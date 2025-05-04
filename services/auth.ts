import { User } from "@prisma/client";
import { axiosInst } from "./axios";
import { ICart } from "./cart";
import CONSTANTS_API from "./constantsApi";
import { I_dadataAddress } from "@/components/DadataAddress/DadataAddress";
import { IReturnUser } from "@/app/api/auth/route";

export async function authEmail(
  user: { email: string; password: string },
  signal?: AbortSignal
) {
  try {
    const data = await axiosInst.post<IReturnUser>("/" + CONSTANTS_API.auth, user, {
      params: { type: "email" },
      withCredentials: true,
      signal,
    });
    return data.data;
  } catch (error) {
    console.log("authEmail catch error", error);

    throw error;
  }
}

export async function authPhone(
  user: { phone: string; password: string },
  signal?: AbortSignal
) {
  try {
    const data = await axiosInst.post<IReturnUser>("/" + CONSTANTS_API.auth, user, {
      params: { type: "phone" },
      withCredentials: true,
      signal,
    });
    return data.data;
  } catch (error) {
    throw error;
  }
}

export async function registration(
  user: { fullName: string; email: string; phone: string; password: string ; address:I_dadataAddress},
  signal?: AbortSignal
) {
  try {
    const data = await axiosInst.post<IReturnUser>("/" + CONSTANTS_API.auth, user, {
      params: { type: "registration" },
      withCredentials: true,
      signal,
    });
    
    return data.data;
  } catch (error) {
    throw error;
  }
}

export async function logout(signal?: AbortSignal) {
  try {
    const data = await axiosInst.post<{ message: string }>(
      "/" + CONSTANTS_API.auth,
      {},
      {
        params: { type: "logout" },
        withCredentials: true,
        signal,
      }
    );
    return data.data;
  } catch (error) {
    throw error;
  }
}

export async function isCheckAuth( signal?: AbortSignal) {
    try {
      const data = await axiosInst.post<User>("/" + CONSTANTS_API.auth,{}, {
        params: { type: "is_check_auth" },
        withCredentials: true,
        signal,
      });
      return data.data;
    } catch (error) {
      throw error;
    }
}
//
// если у юзера нет корзины
// а в сторе она есть
// то при заходе нужно привязать текущую корзину к юзеру

// а если у юзера при заходе есть корзина
// и в сторе есть корзина, то нужно удалить корзину из стора и загрузить корзину юзера
