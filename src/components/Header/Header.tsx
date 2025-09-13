import { cn } from "@/lib/utils";
import { FunctionComponent, Suspense } from "react";
import Container from "@/components/Container/Container";
import Image from "next/image";
import HeaderSearch from "../HeaderSearch/HeaderSearch";
import Link from "next/link";
import HeaderCart from "../HeaderCart/HeaderCart";
import LoginButton from "../LoginButton/LoginButton";

// import CartDrawer from "../CartDrawer/CartDrawer";
interface HeaderProps {
  headerSeach?: boolean;
  headerCart?: boolean;
  headerLogin?: boolean;
  className?: string;
  isAuth?: boolean;
}

const Header: FunctionComponent<HeaderProps> = ({
  headerSeach = true,
  headerCart = true,
  headerLogin = true,
  isAuth = false,
  className,
}) => {
  const btns = (
    <div className={cn("flex items-center gap-2 ")} id="header_btns">
      {headerLogin && <LoginButton />}
      {headerCart && <HeaderCart />}
    </div>
  );

  return (
    <header
      // || ""
      className={cn(className, "border border-b border-x-0 border-t-0 ")}
      id="main_header"
    >
      <Container>
        <div
          className={cn(" flex justify-between items-center py-8")}
          id="main_header-inner"
        >
          <Link href={"/"}>
            <div className={cn(" flex items-center gap-2")}>
              <Image src="/logo.png" width={35} height={35} alt="Logo" />
              <div>
                <h1 className={cn(" text-2xl uppercase font-black")}>
                  NEXT pizza
                </h1>
                <p
                  className={cn(
                    " text-sm text-gray-400 leading-3 ",
                    className ? "text-white" : ""
                  )}
                >
                  {" "}
                  Вкусней уже некуда
                </p>
              </div>
            </div>
          </Link>
          {headerSeach && (
            <Suspense>
              <HeaderSearch className="mx-10 flex-1"></HeaderSearch>
            </Suspense>
          )}
          {btns}
        </div>
      </Container>
    </header>
  );
};

export default Header;
