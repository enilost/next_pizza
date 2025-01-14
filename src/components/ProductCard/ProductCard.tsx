import { cn } from "@/lib/utils";
import Link from "next/link";
import { FunctionComponent } from "react";
import Image from "next/image";
import { Title } from "../Title/Title";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
// import { Product, ProductItem } from "@prisma/client";
import CONSTANTS_API from "../../../services/constantsApi";
// import { useRouter } from "next/navigation";
export interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  className?: string;
  imageUrl: string;
  description?: string;
}

const ProductCard: FunctionComponent<ProductCardProps> = ({
  className,
  imageUrl,
  id,
  name,
  price = 0,
  description,
}) => {
  // const Router = useRouter();
  const path = `/${CONSTANTS_API.products}/${id}`;
  return (
    <div className={cn("flex flex-col h-[100%]", className)}>
      <Link
        href={path}
        scroll={false}
        // className="flex flex-col h-[100%]"
        className="flex justify-center p-6 bg-secondary rounded-lg h-[260px]"
      >
        <Image
          src={imageUrl || ""}
          alt={name}
          className=""
          width={215}
          height={215}
        ></Image>
      </Link>

      <Title
        size="h4"
        className={`mb-1 mt-3 font-bold ${!description && "flex-grow"} `}
      >
        {name}
      </Title>

      {description && (
        <p className="text-sm text-gray-400 flex-grow ">{description}</p>
      )}

      <div className="flex justify-between items-center mt-4">
        <span className="text-[20px]">
          от <b>{price} ₽</b>
        </span>

        <Link href={path} scroll={false}>
          <Button
            variant={"secondary"}
            className="text-base font-bold"
            // onClick={() => {
            //   Router.push(path, { scroll: false });
            // }}
          >
            <Plus className="w-5 h-5 mr-1"></Plus>
            добавить
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
