import { cn } from "@/lib/utils";
import { FunctionComponent, Suspense } from "react";
import Container from "@/components/Container/Container";
// import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Image from "next/image";
import { ArrowRight, ShoppingCart, User } from "lucide-react";
import HeaderSearch from "../HeaderSearch/HeaderSearch";
import Link from "next/link";
import HeaderCart from "../HeaderCart/HeaderCart";
// import CartDrawer from "../CartDrawer/CartDrawer";
interface HeaderProps {}

const Header: FunctionComponent<HeaderProps> = (props) => {
  // console.log("Header", props);

  return (
    <header className={cn("border border-b border-x-0")}>
      
      <Container>
        <div className={cn(" flex justify-between items-center py-8")}>
          <Link href={"/?price-to=14341&pizza-types=2"}>
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
          </Link>

          <Suspense>
            <HeaderSearch className="mx-10 flex-1"></HeaderSearch>
          </Suspense>

          <div className={cn("flex items-center gap-2")}>
            <Button
              variant={"outline"}
              className={cn(" flex items-center gap-1")}
            >
              <User size={"22px"} />
              Войти
            </Button>

            <div>
            {/* <Suspense> */}
              <HeaderCart />
              {/* </Suspense> */}
            </div>
            
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
