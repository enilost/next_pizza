import { cn } from "@/lib/utils";
import { FunctionComponent } from "react";
import Container from "@/components/Container/Container";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Image from "next/image";
import { ArrowRight, ShoppingCart, User } from "lucide-react";
interface HeaderProps {}

const Header: FunctionComponent<HeaderProps> = () => {
  return (
    <header className={cn("border border-b")}>
      <Container>
        <div className={cn(" flex justify-between items-center py-8")}>
          <div className={cn(" flex items-center gap-2")}>
            <Image src="/logo.png" width={35} height={35} alt="Logo" />
            <div>
              <h1 className={cn(" text-2xl uppercase font-black")}>
                NEXT pizza
              </h1>
              <p className={cn(" text-sm text-gray-400 leading-3")}>
                {" "}
                Вкусней уже некуда
              </p>
            </div>
          </div>
          <div className={cn("flex-grow-1")}>
            <Input type="search"></Input>
          </div>
          <div className={cn("flex items-center gap-2")}>
            <Button
              variant={"outline"}
              className={cn(" flex items-center gap-1")}
            >
              <User size={"22px"} />
              Войти
            </Button>
            <div>
                <Button className={cn("group relative")}>
                    <b>520 ₽</b>
                    <span className={cn("h-full w-[1px] bg-white/30 mx-2")}></span>
                    <div className={cn("flex items-center gap-1 transition duration-300 group-hover:opacity-0")}>
                    <ShoppingCart className={cn("h-4 w-4 relative")}></ShoppingCart>
                    <b>3</b>
                    </div>
                    <ArrowRight className="w-5 absolute right-5 transition duration-300 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0" />
                </Button>
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
