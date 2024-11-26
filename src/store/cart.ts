// import { ProductIngedientItem } from "@/components/ProguctCardGroup/ProguctCardGroup";
import { Cart } from "@prisma/client";

import { create } from "zustand";
import apiClient from "../../services/apiClient";
import { devtools } from "zustand/middleware";
import { ICart } from "../../services/cart";

export type CartAndItemsArg = "find" | "create" | "findOrCreate";
export interface State {
  cart: Cart | {};
  loading: boolean;
  isRequest: boolean;
  error: string | false;
  cartItems: ICart["items"];
  addCartItem: (item: ICart["items"][number]) => void;
  changeCount: (index: number, count: number) => void;
  deleteCartItem: (index: number) => void;
  getCartAndItems: (flag: CartAndItemsArg) => Promise<void>;
  sinhronizeCart: () => void;
  fetchGetCartAndItems: (
    flag: CartAndItemsArg,
    signal?: AbortSignal
  ) => Promise<{
    cart: State["cart"];
    items: State["cartItems"];
  }>;
  fetchSetItems: (
    items: State["cartItems"],
    signal?: AbortSignal
  ) => Promise<State["cart"] & { items: State["cartItems"] }>;
}

export let RequestSignal: AbortController | null = null;
// let isRequest: boolean = false;
export const useStoreCart = create<State>()(
  devtools((set, get) => {
    return {
      cart: {},
      loading: false,
      isRequest: false,
      error: false,
      cartItems: [],
      addCartItem:  (item) => {
        //добавить товар
        const getCart = get().cart;
        let idx = findItemIndex(item, get().cartItems);

        if (idx === undefined) {
          // если товар уникальный - добавляем
          const quantity = 1;
          set((state) => {
            return {
              cartItems: [
                ...get().cartItems,
                {
                  ...item,
                  quantity,
                  //если есть id корзины то передаем его, а если нет, то 0
                  //тогда в синхронизации будет создана корзина на бэке
                  //и в итемах перезаписан cartId на id созданной корзины
                  cartId: "id" in getCart ? getCart.id : 0,
                },
              ],
            };
          });
        } else {
          // если не уникальный, то изменяем количество
          const cartItems = get().cartItems;
          set((state) => {
            return {
              cartItems: cartItems.map((cartItem, index) => {
                if (index === idx) {
                  return { ...cartItem, quantity: cartItem.quantity + 1 };
                }
                return cartItem;
              }),
            };
          });
        }
        console.log("addCartItem", get().cartItems);

        get().sinhronizeCart();
      },
      changeCount:  (index: number, count: number) => {
        //  изменяем количество определенного товара
        set((state) => {
          let cartItems = [...get().cartItems];
          cartItems[index] = {
            ...cartItems[index],
            quantity: count,
          };
          return {
            cartItems: cartItems,
          };
        });
        get().sinhronizeCart();
      },
      deleteCartItem:  (index: number) => {
        //  удаляем определенный товар
        set((state) => {
          let cartItems = [...get().cartItems];
          cartItems.splice(index, 1);
          return {
            cartItems: cartItems,
          };
        });

        get().sinhronizeCart();
      },
      fetchGetCartAndItems: async (flag) => {
        try {
          const cartAndItems = await apiClient.getCartAndItems(flag);
          const cart: Cart = { ...cartAndItems };
          // @ts-ignore
          delete cart.items;
          const items = cartAndItems.items;
          // const {items:items2, ...cart2} = cartAndItems
          return { cart, items };
        } catch (error) {
          throw error;
        }
      },
      getCartAndItems: async (flag) => {
        try {
          const { cart: getCart, items: getItems } =
            await get().fetchGetCartAndItems(flag);
          set((state) => {
            return {
              cart: getCart,
              cartItems: getItems,
            };
          });
        } catch (error: unknown) {
          if (error instanceof Error) {
            set((state) => {
              return {
                cart: {},
                items: [],
                error: error.message,
              };
            });
          }
        }
      },
      fetchSetItems: async (items) => {
        try {
          const Response = await apiClient.setCartAndItems(items);
          return Response;
        } catch (error) {
          throw error;
        }
      },
      sinhronizeCart: async () => {
        // запускается после любого изменения стейта корзины
        // отправляет корзину на сервер
        // в конце он сравнивает корзину стейта с корзиной бэка

        // если за время выполнения этой ф-и корзина стейта еще изменилась
        // функция запускается заново отправляя актуальную корзину
        // и так до тех пор, пока корзина бэка и стейта не синхронизируются
        if (get().isRequest === true) {
          return;
        }
        set((state) => {
          return {
            isRequest: true,
          };
        });
        if (get().loading === false) {
          set((state) => {
            return {
              loading: true,
            };
          });
        }

        try {
          if (
            !("id" in get().cart)
            // || get().cartItems.some((item) => item.cartId === 0)
          ) {
            // если нет корзины на бэке или у любого итема cartId === 0
            // знач на бэке не нашлась корзина по кукисам при открытии сайта и нужно ее создать
            // а потом всем итемам корзины присвоить cartId созданной корзины

            // сохранить итемы, тк при создании корзины они потруться
            const saveItems = get().cartItems;
            // создать корзину с пустыми итемами
            await get().getCartAndItems("findOrCreate");
            // созданная корзина
            const newCart = get().cart;

            if ("id" in newCart) {
              // вписать в корзину сохраненные итемы с новым cartId
              set((state) => {
                return {
                  cartItems: saveItems.map((item) => {
                    return { ...item, cartId: newCart.id };
                  }),
                };
              });
            } else {
              throw new Error("создать корзину не удалось, sinhronizeCart");
            }
          }
          const response = await get().fetchSetItems(get().cartItems);
          console.log("sinhronizeCart response - ", response);

          const { items: fetchItems, ...fetchCart } = response;

          // сравнивает полученную корзину с хронящейся в стейте
          const isSinhronized = isSinhronizedCartAndItems(
            { cart: fetchCart, items: fetchItems },
            { cart: get().cart, items: get().cartItems }
          );
          // если они не равны и за время запроса пользователь еще что то добавил в корзину
          // то функция запускается заново
          if (!isSinhronized) {
            set((state) => {
              return {
                isRequest: false,
              };
            });
            await get().sinhronizeCart();
          }
        } catch (error) {
          console.log("sinhronizeCart error", error);
          if (error instanceof Error) {
            set((state) => {
              return {
                error: error.message,
                cart: {},
                cartItems: [],
              };
            });
          }
        } finally {
          console.log("sinhronizeCart finally ");

          if (get().loading) {
            set((state) => {
              return {
                loading: false,
              };
            });
          }
          if (get().isRequest === true) {
            set((state) => {
              return {
                isRequest: false,
              };
            });
          }
        }
      },
    };
  })
);

// функция сравнения объектов без вложений
type Primitive = string | number | null | undefined | boolean | Date;
type RecursiveObject = {
  [key: string]: Primitive | RecursiveObject;
};
function compareObjects(
  obj1: RecursiveObject | Primitive,
  obj2: RecursiveObject | Primitive
): boolean {
  if (obj1 === null && obj2 === null) return true;
  if (obj1 === undefined && obj2 === undefined) return true;
  if (obj1 === null || obj1 === undefined) return false;
  if (obj2 === null || obj2 === undefined) return false;

  if (obj1 instanceof Date || obj2 instanceof Date) {
    if (obj1 instanceof Date && obj2 instanceof Date) {
      return obj1.getTime() === obj2.getTime();
    }
    if (obj1 instanceof Date) {
      return obj1.getTime() === obj2;
    }
    if (obj2 instanceof Date) {
      return obj1 === obj2.getTime();
    }
  }

  if (typeof obj1 !== "object" || typeof obj2 !== "object") {
    return obj1 === obj2;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key)) return false;
    if (!compareObjects(obj1[key], obj2[key])) return false;
  }

  return true;
}

function timeBounceAwait(time: number, signal: AbortSignal) {
  console.log("timeBounceAwait", time);
  return new Promise((resolve, reject) => {
    const bounceTimeout = setTimeout(() => {
      // удаляем слушатель после завершения функции если он не сработал
      signal.removeEventListener("abort", abortListener);
      resolve(true);
    }, time);

    const abortListener = () => {
      clearTimeout(bounceTimeout);
      reject(new Error("AbortError"));
    };

    signal.addEventListener("abort", abortListener, { once: true });
  });
}

type argIsSinhronized = {
  cart: State["cart"];
  items: State["cartItems"];
};
const isSinhronizedCartAndItems = (
  fetchCart: argIsSinhronized,
  stateCart: argIsSinhronized
): boolean => {
  const isSinhronizedCart = compareObjects(fetchCart.cart, stateCart.cart);
  // если корзины не равны, то возвращаем false
  if (!isSinhronizedCart) return false;
  // если количество товаров в корзине не равно, то возвращаем false
  if (fetchCart.items.length !== stateCart.items.length) return false;
  // если количество равно 0, то возвращаем true
  if (fetchCart.items.length === 0 && stateCart.items.length === 0) return true;

  // если количество равно, то проходимируем по массиву и сравниваем итемы
  let isSinhronizedItems = false;
  //создам строковую карту одного из массивов
  const createString = (item: State["cartItems"][number]) => {
    // const cartItemId = item.id;
    const productId = item.productItem.productId;
    const productItemId = item.productItem.id;
    const quantity = item.quantity;
    const ingredients = item.ingredients
      .map((ingredient) => {
        return `${ingredient.id}`;
      })
      .sort()
      .join(",");
    const itemString = `${productId}:${productItemId}:${quantity}-${ingredients}`;
    return itemString;
  };

  const stateCartStringMap = stateCart.items.map((item) => {
    const itemString = createString(item);
    // ['1:5:3:1-1,2,3', '2:2:1:2-1,2,', '3:3:1:3-']
    return itemString;
  });
  isSinhronizedItems = fetchCart.items.every((item, index) => {
    const itemString = createString(item);
    // '1:5:3:1-1,2,3'
    if (stateCartStringMap.includes(itemString)) {
      stateCartStringMap.splice(stateCartStringMap.indexOf(itemString), 1);
      return true;
    }
    return false;
  });

  return isSinhronizedCart && isSinhronizedItems;
};

const findItemIndex = (
  item: State["cartItems"][number],
  cartItems: State["cartItems"]
) => {
  // const cartItems = get().cartItems;
  // если корзина пуста
  if (cartItems.length === 0) return undefined;

  let index = cartItems.findIndex((cartItem) => {
    // разное кол-во  ингредиентов, значит это 100% не совпадет
    if (cartItem.ingredients.length !== item.ingredients.length) {
      return false;
    }
    // сравнивает два объекта  productItem без вложений
    // если они равны, то возвращает true - знач такой продукт уже есть в корзине
    // осталось проверить (сравнить ингредиенты)
    const cartItemProduct = { ...cartItem.productItem, product: undefined }; // cartItem.productItem.product;
    const itemProduct = { ...item.productItem, product: undefined };
    const notUniqueItem = compareObjects(cartItemProduct, itemProduct); // && cartItem.id  === item.id;
    let notUniqueIngredients = false;
    if (notUniqueItem) {
      // тк выше есть проверка на равность кол-ва ингредиентов
      // то достаточно длинны только итема
      if (item.ingredients.length === 0) {
        return true;
      }
      // массив ингредиентов итема
      let itemIngrIds = item.ingredients.map((ingredient) => ingredient.id);
      // первый попавшийся ингредиент в картитеме
      // которого нет в ингредиентах итема
      // вернет фолс
      notUniqueIngredients = !cartItem.ingredients.some((ingredient) => {
        const result = itemIngrIds.includes(ingredient.id) === false;
        if (!result) {
          // если ингедиент есть в ингредиентах итема
          // то удаляем его. избыточная проверка, но пусть будет
          itemIngrIds.splice(itemIngrIds.indexOf(ingredient.id), 1);
        }
        return result;
      });
    }
    return notUniqueItem && notUniqueIngredients;
  });

  return index !== -1 ? index : undefined;
};
