import Link from "next/link";
import { FunctionComponent } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";

interface LoginButtonProps {}

const LoginButton: FunctionComponent<LoginButtonProps> = () => {
  let isAutorizeid = true;
  return (
    <>
      {isAutorizeid ? (
        <Link href={"/profile"}>
          <Button
            variant={"outline"}
            className={cn(" flex items-center gap-1")}
          >
            <User size={"22px"} />
            Профиль
          </Button>
        </Link>
      ) : (
        <Link href={"/login"}>
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
