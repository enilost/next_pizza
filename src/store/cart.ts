// import { ProductIngedientItem } from "@/components/ProguctCardGroup/ProguctCardGroup";
import { Cart } from "@prisma/client";

import { create } from "zustand";
import apiClient from "../../services/apiClient";
import { devtools, persist } from "zustand/middleware";
import { ICart } from "../../services/cart";
import toast from "react-hot-toast";

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
  broadcastChannelSyncCart: (data: {
    cart?: State["cart"];
    cartItems?: State["cartItems"];
    loading?: State["loading"];
    isRequest?: State["isRequest"];
    error?: State["error"];
  }) => void;
}

//блок для синхронизации корзины между вкладками
// проверка, поддерживается ли BroadcastChannel
const isBroadcastSupported =
  typeof window !== "undefined" && "BroadcastChannel" in window;
// если BroadcastChannel поддерживается, то создается канал
const cartChannel =
  typeof window !== "undefined" && isBroadcastSupported
    ? new BroadcastChannel("cart_sync")
    : null;
// если BroadcastChannel не поддерживается, то уведомление через локалсторадж
const STORAGE_KEY_NAME = "broadcastNotSupportedPizza" as const;

function synchronizeBrowserTab() {
  if (typeof window === "undefined") return;

  if (cartChannel) {
    // если BroadcastChannel поддерживается
    // то каждое изменение в стейте будет отправляться в канал
    cartChannel.onmessage = (event: MessageEvent<State>) => {
      useStoreCart.setState(event.data);
    };
  } else {
    // если BroadcastChannel не поддерживается
    // то создается переменная в локалсторадже
    localStorage.getItem(STORAGE_KEY_NAME) == undefined &&
      localStorage.setItem(STORAGE_KEY_NAME, "0");

    // слушатель для фокуса на вкладке
    const focusListener = (event: FocusEvent) => {
      const conf = confirm(
        "Корзина была изменена из другой вкладки браузера. Нажмите OK для перезагрузки страницы"
      );
      if (conf) {
        window.location.reload();
      }
    };

    const storageListener = (event: StorageEvent) => {
      // console.log("storageListener - event", event);
      window.removeEventListener("focus", focusListener);
      if (event.key === STORAGE_KEY_NAME) {
        window.addEventListener("focus", focusListener, { once: true });
      }
    };

    window.addEventListener("storage", storageListener);

    window.addEventListener("beforeunload", () => {
      window.removeEventListener("focus", focusListener);
      window.removeEventListener("storage", storageListener);
    });
  }
}
synchronizeBrowserTab();

export let RequestSignal: AbortController | null = null;
// let isRequest: boolean = false;
export const useStoreCart = create<State>()(
  // persist(
  devtools((set, get) => {
    return {
      cart: {},
      loading: false,
      isRequest: false,
      error: false,
      cartItems: [],
      //для синхронизации корзины между вкладками
      broadcastChannelSyncCart: (data) => {
        // if (isBroadcastSupported) {
        //   // alert('перезагрузите страницу, корзина изменилась')
        //   return;
        // }
        if (cartChannel) {
          cartChannel.postMessage(data);
        }
      },

      addCartItem: (item) => {
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
        const notify = () =>
          toast.success(
            `${item.productItem.product.name} добавляется в корзину`
          );
        notify();

        get().sinhronizeCart();
      },
      changeCount: (index: number, count: number) => {
        //  изменяем количество определенного товара
        const prevCount = get().cartItems[index].quantity;
        const productName = get().cartItems[index].productItem.product.name;
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
        const action =
          count > prevCount ? "добавляется в корзину" : "удаляется из корзины";
        const notify = () => toast.success(`${productName} ${action}`);
        notify();
        get().sinhronizeCart();
      },
      deleteCartItem: (index: number) => {
        //  удаляем определенный товар
        const productName = get().cartItems[index].productItem.product.name;
        set((state) => {
          let cartItems = [...get().cartItems];
          cartItems.splice(index, 1);
          return {
            cartItems: cartItems,
          };
        });
        const action = "удаляется из корзины";
        const notify = () => toast.success(`${productName} ${action}`);
        notify();
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
          const notify = () =>
            toast.error(`${"error store/cart.ts/fetchGetCartAndItems"}`);
          notify();
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
                // cart: {},
                items: [],
                error: error.message,
              };
            });
            const notify = () =>
              toast.error(`${"error store/cart.ts/getCartAndItems"}`);
            notify();
          }
          throw error;
        }
      },
      fetchSetItems: async (items) => {
        try {
          const Response = await apiClient.setCartAndItems(items);
          return Response;
        } catch (error) {
          const notify = () =>
            toast.error(` ${"error store/cart.ts/fetchSetItems"}`);
          notify();
          throw error;
        }
      },
      sinhronizeCart: async () => {
        // console.log("синхронизация корзины");
        // если корзина на бэке не создана, то создает ее

        // запускается после любого изменения стейта корзины
        // отправляет корзину на сервер
        // в конце он сравнивает корзину стейта с корзиной ответа бэка

        // если за время выполнения этой ф-и корзина стейта еще изменилась
        // функция запускается заново отправляя актуальную корзину
        // и так до тех пор, пока корзина бэка и стейта не синхронизируются

        if (get().isRequest === false && get().loading === true) {
          // чтоб при запуске рекурсии не происходил 1 лишний ререндер
          // на другой вкладке при синхронизации вкладок через broadcastChannel
        } else {
          // во всех других случаях запускаем синхронизацию
          get().broadcastChannelSyncCart({
            // обновляю по broadcastChannel сразу весь стейт,
            //  хотя можно было бы обновлять только нужные поля
            cart: get().cart,
            cartItems: get().cartItems,
            loading: get().loading,
            isRequest: get().isRequest,
            error: get().error,
          });
        }

        if (get().isRequest === true) {
          return;
        }
        set((state) => ({ isRequest: true }));
        // get().broadcastChannelSyncCart({
        //   isRequest: get().isRequest,
        // });

        if (get().loading === false) {
          set((state) => ({ loading: true }));
          get().broadcastChannelSyncCart({
            loading: get().loading,
          });
        }

        try {
          if (
            !("id" in get().cart)
            // || get().cartItems.some((item) => item.cartId === 0)
          ) {
            // если нет корзины на бэке или у любого итема cartId === 0
            // значит на бэке не нашлась корзина по кукисам при открытии сайта и нужно ее создать
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
              const notify = () =>
                toast.error(`создать корзину не удалось, sinhronizeCart`);
              notify();
              throw new Error("создать корзину не удалось, sinhronizeCart");
            }
          }
          const response = await get().fetchSetItems(get().cartItems);
          // console.log("sinhronizeCart response - ", response);

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
          // console.log("sinhronizeCart error", error);
          if (error instanceof Error) {
            set((state) => {
              return {
                error: error.message,
                cart: {},
                cartItems: [],
              };
            });

            const notify = () =>
              toast.error(
                `${error.message} \n ${"store/cart.ts/sinhronizeCart"}`
              );
            notify();
          }
        } finally {

          if (get().loading === true || get().isRequest === true) {
            set((state) => ({ loading: false, isRequest: false }));
            if (!isBroadcastSupported) {
              // если нет поддержки broadcastChannel
              // то изменяются поле в localStorage
              // чтоб слшатель storage запустился и другие вкладки получили оповещение
              const storageVal = localStorage.getItem(STORAGE_KEY_NAME) || "0";
              if (storageVal) {
                const newVal = +storageVal + 1;
                localStorage.setItem(STORAGE_KEY_NAME, newVal.toString());
              }
            } else {
              // если синхронизация вкладок по broadcastChannel
              get().broadcastChannelSyncCart({
                // обновляю по broadcastChannel сразу весь стейт,
                //  хотя можно было бы обновлять только нужные поля
                cart: get().cart,
                cartItems: get().cartItems,
                loading: get().loading,
                isRequest: get().isRequest,
                error: get().error,
              });
            }
          }
        }
      },
    };
  })
  // { name: "cart" }
  // )
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
      // то достаточно длинны только итема === 0
      if (item.ingredients.length === 0) {
        return true;
      }
      // массив id ингредиентов итема
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
