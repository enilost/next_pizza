"use client";
import Link from "next/link";
import { FunctionComponent } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";
import { useStoreUser } from "@/store/user";
import { useStoreWithEqualityFn } from "zustand/traditional";

interface LoginButtonProps {}

const LoginButton: FunctionComponent<LoginButtonProps> = () => {
  // const [isAuth] = useStoreWithEqualityFn(
  //   useStoreUser,
  //   (state) => [state.isAuth],
  //   (prev, next) => prev[0] === next[0]
  // );
  const isAuth = useStoreUser((state) => state.isAuth);
  
  return (
    <>
      {isAuth ? (
        <Link href={"/profile"} key={"profile"}>
          <Button
            variant={"outline"}
            className={cn(" flex items-center gap-1")}
          >
            <User size={"22px"} />
            Профиль
          </Button>
        </Link>
      ) : (
        <Link href={"/login"} key={"login"}>
          <Button
            variant={"outline"}
            className={cn(" flex items-center gap-1")}
          >
            <User size={"22px"} />
            Войти
          </Button>
        </Link>
      )}
    </>
  );
};

export default LoginButton;
