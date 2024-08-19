import { cn } from "@/lib/utils";
import Link from "next/link";
import { FunctionComponent } from "react";
import Image from "next/image";
import { Title } from "../Title/Title";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
export interface  ProductCardProps {
    id:number
    name:string
    price:number
    className?:string,
    imageURL:string,
    description:string
}
 
const ProductCard: FunctionComponent<ProductCardProps> = ({className,imageURL,id,name,price,description}) => {
    return ( <div className={cn('',className)}>
        <Link href={`/proguct/${id}`}>
        <div className="flex justify-center p-6 bg-secondary rounded-lg h-[260px]">
            <Image src={imageURL ||''} alt={name} className="" width={215} height={215}></Image>
        </div>
        <Title size="h4" className="mb-1 mt-3 font-bold">{name}</Title>
        <p className="text-sm text-gray-400">
        {description}
        </p>
        <div className="flex justify-between items-center mt-4">
            <span className="text-[20px]">
                от <b>{price} ₽</b>
            </span>
            <Button variant={'secondary'} className="text-base font-bold">
                <Plus className="w-5 h-5 mr-1"></Plus>
                добавить
            </Button>
        </div>
        </Link>
    </div> );
}
 
export default ProductCard;