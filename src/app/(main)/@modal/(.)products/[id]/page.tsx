import { FunctionComponent } from "react";
import prisma from "@/../../prisma/prisma-client";
import { notFound } from "next/navigation";
import Container from "@/components/Container/Container";
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

  const product = await prisma.product.findUnique({
    where: {
      id: +params.id,
    },
    include: {
      ingredients: true,
      items: true,
    },
  });

  if (!product) {
    return notFound();
  }
  
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
