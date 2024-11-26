"use client";
import { cn } from "@/lib/utils";
import {
  FunctionComponent,

  useEffect,
  useRef,

} from "react";
import { Title } from "../Title/Title";
import ProductCard, { ProductCardProps } from "../ProductCard/ProductCard";
import {  useIntersection } from "react-use";
import { useStoreCategory } from "@/store/category";
import {  Ingredient, Product, ProductItem } from "@prisma/client";
// import useSetAncor from "@/hooks/useSetAncor";

interface ProductCardGroupProps {
  className?: string;
  // items: ProductItem[];
  items: ProductIngedientItem[];
  title: string;
  categoryId: number;
  listClassName?: string;
}

export interface ProductIngedientItem extends Product {
  items: ProductItem[];
  ingredients: Ingredient[];
}
const ProguctCardGroup: FunctionComponent<ProductCardGroupProps> = ({
  className,
  title,
  items,
  categoryId,
  listClassName,
}) => {
  const intersectionRef = useRef(null);

  //   const [ancor, setAncor] = useHash();
  const intersection = useIntersection(intersectionRef, {
    // root: null,
    rootMargin: "-456px 0px",
    threshold: 0,
    // threshold: 0.8,
  });
  const intersectionRefDelay = useRef<IntersectionObserverEntry>(null);
  //   @ts-ignore
  intersectionRefDelay.current = intersection;
  const setActiveCategoryId = useStoreCategory(
    (state) => state.setActiveCategoryId
  );
  // useSetAncor({intersection,ancorName:title + categoryId,ref:intersectionRef})
  useEffect(() => {
    // console.log(title + categoryId);

    if (intersection && intersection.isIntersecting) {
      setActiveCategoryId(title);

    }
  }, [intersection, intersection?.isIntersecting]);

  return (
    <div
      className={cn(" relative", className)}
      // id={title + categoryId.toString()}
      ref={intersectionRef}
    >
      <span
        className="anc"
        // id={title + categoryId.toString()}
        id={title}
        style={{
          visibility: "hidden",
          position: "absolute",
          zIndex: "-1",
          top: "-456px",
        }}
      ></span>
      {title && (
        <Title size="h3" className="font-extrabold mb-5">
          {title}
        </Title>
      )}

      <div className="grid grid-cols-3 gap-[50px]">
        {items.map((el, idx) => {
          return (
            // <div className="" >
            <ProductCard
              key={el.id}
              id={el.id}
              name={el.name}
              // price={el.items[0].price}
              price={(()=>{
                const pricesArr = el.items.map((el)=>el.price)
                const index = pricesArr.indexOf(Math.min(...pricesArr))
                return el.items[index].price
              })()}
              imageUrl={el.imageUrl}
            ></ProductCard>
            // </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProguctCardGroup;
