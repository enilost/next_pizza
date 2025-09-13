"use client";
import { cn } from "@/lib/utils";
import { FunctionComponent, memo, useEffect, useRef } from "react";
import { Title } from "../Title/Title";
import ProductCard from "../ProductCard/ProductCard";
import { useIntersection } from "react-use";
import { useStoreCategory } from "@/store/category";
import { Ingredient, Product, ProductItem } from "@prisma/client";
import { detailsTextIngredients } from "@/constants/constants";
import { useRouter } from "next/navigation";
// import shallow from "zustand/shallow";
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
const ProguctCardGroup: FunctionComponent<ProductCardGroupProps> =
  // memo(
  ({ className, title, items, categoryId, listClassName }) => {
    const intersectionRef = useRef(null);
    const router = useRouter();
    const intersection = useIntersection(intersectionRef, {
      root: null,
      // rootMargin: "-456px 0px",
      rootMargin: "-69% 0px -30% 0px",
      threshold: 0,
      // threshold: 0.8,
    });
    // const intersection = useMemo(() => intersectionN, [
    //   intersectionN
    // ]);
    const intersectionRefDelay = useRef<IntersectionObserverEntry>(null);
    //   @ts-ignore
    intersectionRefDelay.current = intersection;

    const setActiveCategoryId = useStoreCategory(
      (state) => state.setActiveCategoryId
      // ,shallow
    );

    useEffect(() => {
      if (intersection && intersection.isIntersecting) {
        setActiveCategoryId(title);
        // router.replace(`#${title}`, { scroll: false });
      }
    }, [intersection, intersection?.isIntersecting]);
    // console.log('ProguctCardGroup itemss', items);

    return (
      <div className={cn(" relative pb-16", className)} ref={intersectionRef}>
        <span
          className="anc"
          id={title}
          style={{
            position: "absolute",
            top: "0px",
            left: "0px",
            zIndex: "-1",

            // visibility: "hidden",
            // position: "absolute",
            // zIndex: "-1",
            // top: "-456px",
          }}
        ></span>
        {title && (
          <Title size="h3" className="font-extrabold mb-5">
            {title}
          </Title>
        )}
        <div className="grid grid-cols-3 gap-[50px]">
          {items.length &&
            items.map((el, idx) => {
              return (
                <ProductCard
                  key={el.id}
                  id={el.id}
                  name={el.name}
                  price={(() => {
                    const pricesArr = el.items.map((el) => el.price);
                    const minPriceindex = pricesArr.indexOf(Math.min(...pricesArr));
                    return el.items[minPriceindex].price;
                  })()}
                  imageUrl={el.imageUrl}
                  description={
                    // el.ingredients.map((el) => el.name).join(", ")
                    detailsTextIngredients(el.ingredients)
                  }
                ></ProductCard>
              );
            })}
        </div>
      </div>
    );
  };
// ,(
//   prevProps,
//   nextProps
// ) => {
//   return prevProps.items === nextProps.items;
// })

export default ProguctCardGroup;
