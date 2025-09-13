"use client";
import Link from "next/link";
import { FunctionComponent } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Loader2, User } from "lucide-react";
import { useStoreUser } from "@/store/user";

interface LoginButtonProps {}

const LoginButton: FunctionComponent<LoginButtonProps> = () => {
  const isAuth = useStoreUser((state) => state.isAuth);

  return (
    <>
      {isAuth ? (
        <Link
          href={"/profile"}
          key={"profile"}
          onClick={(e) => {
            isAuth === null && e.preventDefault();
          }}
          scroll={false}
        >
          <Button variant={"outline"} className={cn("flex items-center gap-1")}>
            {isAuth === null ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin ml-2" />
                {" ".repeat(11)}
              </>
            ) : (
              <>
                <User size={"22px"} />
                Профиль
              </>
            )}
          </Button>
        </Link>
      ) : (
        <Link
          href={"/login"}
          key={"login"}
          onClick={(e) => {
            isAuth === null && e.preventDefault();
          }}
          scroll={false}
        >
          <Button variant={"outline"} className={cn("flex items-center gap-1")}>
            {isAuth === null ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin ml-2" />
                {"\u00A0".repeat(11)}
              </>
            ) : (
              <>
                <User size={"22px"} />
                Войти
              </>
            )}
          </Button>
        </Link>
      )}
    </>
  );
};

export default LoginButton;
