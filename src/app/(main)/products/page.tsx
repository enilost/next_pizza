import { redirect } from "next/navigation";
import { FunctionComponent } from "react";

interface ProductsProps {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

const Products: FunctionComponent<ProductsProps> = async ({
  params,
  searchParams,
}) => {
  redirect("/");
  return null;
};
export default Products;