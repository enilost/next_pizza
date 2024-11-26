import {
  Cart,
  CartItem,
  Ingredient,
  Product,
  ProductItem,
} from "@prisma/client";
import { axiosInst } from "./axios";
import CONSTANTS_API from "./constantsApi";
import { CartAndItemsArg } from "@/store/cart";
export interface ICart extends Cart {
  items: (CartItem & {
    productItem: ProductItem & { product: Product };
    ingredients: Ingredient[];
  })[];
}
export async function getCartAndItems(
  flag: CartAndItemsArg,
  signal?: AbortSignal
) {
  try {
    const data = await axiosInst.get<ICart>("/" + CONSTANTS_API.cart, {
      params: typeof flag === "string" && flag ? { type: flag } : null,
    });
    return data.data;
  } catch (error) {
    throw error;
  }
}

export async function setCartAndItems(
  cartItems: ICart["items"]
  // signal?: AbortSignal
) {
  try {
    const data = await axiosInst.post<ICart>("/" + CONSTANTS_API.cart, {
      items: cartItems,
    });

    return data.data;
  } catch (error) {
    console.log("setCartAndItems catch error", error);

    throw error;
  }
}

// export async function findCartByCookieToken() {
//   try {
//     const data = await axiosInst.get<ICart>("/" + CONSTANTS_API.cart, {
//       params: {
//         find: true,
//       },
//     });
//     return data.data;
//   } catch (error) {
//     throw error;
//   }
// }
////////////////неиспользуемые///////////////

export async function upgradeCartItemQuantity(
  itemId: number,
  quantity: number
): Promise<ICart> {
  const data = await axiosInst.patch<ICart>(
    "/" + CONSTANTS_API.cart + "/" + itemId,
    { quantity }
  );
  return data.data;
}

// export async function findOrCreateCart() {
//   try {
//     const data = await axiosInst.post<ICart>("/" + CONSTANTS_API.cart, {});

//     return data.data;
//   } catch (error) {
//     console.log("findOrCreateCart catch error", error);

//     throw error;
//   }
// }
