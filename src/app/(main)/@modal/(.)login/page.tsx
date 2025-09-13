import { FunctionComponent, Suspense, useState } from "react";
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

}

const ProductId: FunctionComponent<ProductIdProps> = async () => {

  return (
    <>
      <Modal>
        <Suspense>
      <LoginRegistration></LoginRegistration></Suspense>
        {/* <div>modal карточка продукта {params.id}</div>
        <pre>{JSON.stringify(product, null, 2)}</pre> */}
      </Modal>
    </>
  );
};

export default ProductId;
