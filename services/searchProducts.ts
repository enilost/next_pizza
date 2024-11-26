import { Product, ProductItem } from "@prisma/client";
import { axiosInst } from "./axios";
import CONSTANTS_API from "./constantsApi";

export async function searchProducts(search?: { name: string }) {
  // const params = search?.name ? { name: search.name } : undefined;
  const data = await axiosInst.get<Product[]>("/"+CONSTANTS_API.products, {
    params: search?.name ? search : undefined,
    // params,
  });

  return data.data;
}

export async function getProductItems() {
    const data = await axiosInst.get<ProductItem[]>("/"+CONSTANTS_API.productItems);
  
    return data.data;
  }