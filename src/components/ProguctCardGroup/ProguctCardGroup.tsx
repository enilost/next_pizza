"use client";
import { cn } from "@/lib/utils";
import {
  FunctionComponent,
  useDeferredValue,
  useEffect,
  useRef,
  useTransition,
} from "react";
import { Title } from "../Title/Title";
import ProductCard, { ProductCardProps } from "../ProductCard/ProductCard";
import { useHash, useIntersection } from "react-use";
import { useStoreCategory } from "@/store/category";
import useSetAncor from "@/hooks/useSetAncor";

interface ProguctCardGroupProps {
  className?: string;
  items: ProductCardProps[];
  title: string;
  categoryId: number;
  listClassName?: string;
}

const ProguctCardGroup: FunctionComponent<ProguctCardGroupProps> = ({
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
  const setActiveCategoryId = useStoreCategory((state) => state.setActiveCategoryId);
  // useSetAncor({intersection,ancorName:title + categoryId,ref:intersectionRef})
    useEffect(() => {
      console.log(title + categoryId);

      if (intersection && intersection.isIntersecting) {

          setActiveCategoryId(title);

      //   (async () => {
      //     const newVal = intersection && intersection.isIntersecting;
      //     await new Promise<void>((resolve, reject) => {
      //       setTimeout(() => {
      //         resolve();
      //       }, 710);
      //     });
      //     let oldVal =
      //       intersectionRefDelay.current &&
      //       intersectionRefDelay.current.isIntersecting;
      //     if (newVal && oldVal) {
      //       console.log("setAncor", title + categoryId);
      //       // setAncor(title + categoryId);
      //     } else {
      //       oldVal = false;
      //     }
      //   })();
      }
    }, [intersection, intersection?.isIntersecting]);

  // const [getHash, updateHash] = useSetAncor();
  //     useEffect(() => {
  //     // console.log(title + categoryId);

  //     if (intersection && intersection.isIntersecting) {
  //         setActiveCategoryId(title + categoryId);

  //       (async () => {
  //         const newVal = intersection && intersection.isIntersecting;
  //         await new Promise<void>((resolve, reject) => {
  //           setTimeout(() => {
  //             resolve();
  //           }, 0);
  //         });
  //         let oldVal =
  //           intersectionRefDelay.current &&
  //           intersectionRefDelay.current.isIntersecting;
  //         if (newVal && oldVal) {
  //           console.log("setAncor", title + categoryId);
  //           // setAncor(title + categoryId);
  //           updateHash(title + categoryId);
  //           if (title + categoryId=='Комбо1') {
  //             updateHash('');
  //           }
  //         } else {
  //           oldVal = false;
  //         }
  //       })();
  //     }
  //   }, [intersection, intersection?.isIntersecting]);
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
            <ProductCard {...el} key={idx}></ProductCard>
            // </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProguctCardGroup;
