import { FunctionComponent } from "react";
import prisma from "@/../../prisma/prisma-client";
import { notFound } from "next/navigation";
import Container from "@/components/Container/Container";
import { cn } from "@/lib/utils";
import { Title } from "@/components/Title/Title";
import RadioCustom from "@/components/RadioCustom/RadioCustom";
import ProductCardDetail from "@/components/ProductCardDetail/ProductCardDetail";
import ScrollTopPage from "./scrolltoppage";

interface ProductIdProps {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

const ProductId: FunctionComponent<ProductIdProps> = async ({
  params,
  searchParams,
}) => {
  console.log("searchParams", searchParams);
  console.log("params", params);
  const product = await prisma.product.findUnique({
    where: {
      id: +params.id,
    },
    include: {
      ingredients: true,
      items: true,
    },
  });

  // console.log("product", product);
  if (!product) {
    return notFound();
  }
  
  // product.items.push({
  //   id: 115,
  //   price: 123,
  //   size: 20,
  //   pizzaType: null,
  //   productId: 3,
  // });
  // product.items.push({
  //   id: 111,
  //   price: 123,
  //   size: null,
  //   pizzaType: 2,
  //   productId: 3,
  // });
  // if (typeof window !== "undefined") {

  //   window.scrollTo(0, 0);
  //   window.scrollY = 0;
  // }
  if (typeof window !== "undefined") {
    window.scrollTo(0, 1);
  }

  const script = (
    <script>
      {`
             window.scrollTo({ top: 1, left: 0, behavior: "auto" });
             window.scrollTo({ top: 1, left: 0, behavior: "instant" });
             window.scrollTo(0, 0);

            //  document.body.style.overflow = 'hidden';
            //  window.scrollTo({ top: 0, left: 0 });
            //  document.body.style.overflow = 'auto';
          `}
    </script>
  );
  return (
    <>
      <Container className={"flex flex-col my-20"}>
        <ProductCardDetail product={product} />
        {/* <ScrollTopPage /> */}
      </Container>
      <div>карточка продукта {params.id}</div>
      <pre>{JSON.stringify(product, null, 2)}</pre>
      {/* <pre>{JSON.stringify(product, null, 2)}</pre> */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
             window.scrollTo({ top: 1, left: 0, behavior: "auto" });
             window.scrollTo({ top: 1, left: 0, behavior: "instant" });
             window.scrollTo(0, 0);
          `,
        }}
      />
      {/* {script} */}
    </>
  );
};

export default ProductId;
