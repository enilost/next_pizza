"use client";
import { IReturnUser } from "@/app/api/auth/route";
import { useStoreUser } from "@/store/user";
import { FunctionComponent, useEffect } from "react";
import { useStoreWithEqualityFn } from "zustand/traditional";
import apiClient from "../../../services/apiClient";
import { I_dadataAddress } from "../DadataAddress/DadataAddress";
import toast from "react-hot-toast";
import { usePathname, useRouter } from "next/navigation";
// import { useCookie } from "react-use";

interface CheckAuthProps {}

const CheckAuth: FunctionComponent<CheckAuthProps> = () => {
  console.log("CheckAuth render");

  const [
    setFirstName,
    setLastName,
    setAddress,
    setQueryInputAddress,
    setPhone,
    setEmail,
    setIsAuth,
  ] = useStoreWithEqualityFn(
    useStoreUser,
    (state) => [
      state.setFirstName,
      state.setLastName,
      state.setAddress,
      state.setQueryInputAddress,
      state.setPhone,
      state.setEmail,
      state.setIsAuth,
    ],
    (prev, next) => {
      return true;
    }
  );
  useEffect(() => {
    apiClient
      .isCheckAuth()
      .then((user) => {
        const [firstName, lastName] = user.fullName.split(" ");
        setFirstName(firstName);
        setLastName(lastName);
        if (user.address) {
          const typedAddress = user.address as unknown as I_dadataAddress;
          setAddress(typedAddress);
          setQueryInputAddress(typedAddress.value);
        }
        setPhone(user.phone);
        setEmail(user.email);
        setIsAuth(true);
        toast.success(`С возвращением , ${user.fullName}.`);
      })
      .catch((error) => {
        // console.log("CheckAuth error", error);
        // ни чего не делаем, просто пользователя нет
        // и не заполняем
      })
      .finally(() => {});
  }, []);

  return null;
};

export default CheckAuth;

interface routeGuardProps {}

export const RouteGuard: FunctionComponent<routeGuardProps> = () => {
  const isAuth = useStoreUser((state) => state.isAuth);
  const router = useRouter();
  const pathName = usePathname();
  console.log("RouteGuard pathName", pathName);
  console.log("RouteGuard router", router);
  const protectedRoutesForLogout = ["/profile"];
  const protectedRoutesForLogin = ["/auth", "/login"];
  useEffect(() => {
    if (isAuth) {
      if (protectedRoutesForLogin.includes(pathName)) {
          toast.success("Вы уже авторизованы");
        router.replace("/");
      }
    } else {
      if (protectedRoutesForLogout.includes(pathName)) {
          toast.error("Вы не авторизованы");
        router.replace("/auth");
      }
    }
  }, [isAuth, pathName]);
  return null;
};
