import { FunctionComponent, useState } from "react";
// import prisma from "@/../../prisma/prisma-client";
// import { notFound } from "next/navigation";
import Container from "@/components/Container/Container";
// import ProductCardDetail from "@/components/ProductCardDetail/ProductCardDetail";
import { Modal } from "@/components/Modal/Modal";
import PersonalInfo from "@/components/PersonalInfo/PersonalInfo";
import LoginRegistration from "@/components/LoginRegistration/LoginRegistration";
import { cookies } from "next/headers";
import { JWT_TOKEN_NAME } from "@/constants/constants";

interface ProductIdProps {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

const ProductId: FunctionComponent<ProductIdProps> = async ({
  params,
  searchParams,
}) => {
  // console.log("searchParams", searchParams);
  // console.log("params", params);
  //   const product = await prisma.product.findUnique({
  //     where: {
  //       id: +params.id,
  //     },
  //     include: {
  //       ingredients: true,
  //       items: true,
  //     },
  //   });

  //   if (!product) {
  //     return notFound();
  //   }
    const token  = cookies().get(JWT_TOKEN_NAME)?.value;
    console.log('перехваченный роут токен', token);
  return (
    <>
      <Modal>
      <LoginRegistration></LoginRegistration>
        {/* <div>modal карточка продукта {params.id}</div>
        <pre>{JSON.stringify(product, null, 2)}</pre> */}
      </Modal>
    </>
  );
};

export default ProductId;
