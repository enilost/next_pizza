import { FunctionComponent } from "react";
import prisma from "@/../../prisma/prisma-client";
import { notFound } from "next/navigation";
import Container from "@/components/Container/Container";
import { cn } from "@/lib/utils";
import { Title } from "@/components/Title/Title";
import RadioCustom from "@/components/RadioCustom/RadioCustom";
import ProductCardDetail from "@/components/ProductCardDetail/ProductCardDetail";
import { Modal } from "@/components/Modal/Modal";

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
  // let qwe = product.ingredients.splice(2)
  // console.log("qwe", qwe);
  
  return (
    <>
      <Modal >
        <Container className={"flex flex-col "}> 
           <ProductCardDetail product={product} /> 
       </Container>
        {/* <div>modal карточка продукта {params.id}</div>
        <pre>{JSON.stringify(product, null, 2)}</pre> */}
      </Modal>
    </>
  );
};

export default ProductId;
