import { Prisma } from "@prisma/client";
import { unknown } from "zod";
// /////////////////////////////////////////
const error = {
  error: "Ошибка, нет такого типа в файле constants.ts",
} as const;
// /////////////////////////////////////////
export const PRODUCT_TYPES = {
  "1": "тонкое тесто",
  "2": "традиционное тесто",
  null: "",
  ...error,
} as const;
// /////////////////////////////////////////
export const SIZE_TYPES = {
  "20": "Маленький размер",
  "30": "Средний размер",
  "40": "Большой размер",
  null: "Стандартная порция",
  ...error,
} as const;
// /////////////////////////////////////////
export const detailsTextSize = (size: number | null, type: number | null) => {
  return `${
    size
      ? "Размер " + size + " см"
      : SIZE_TYPES[JSON.stringify(size) as keyof typeof SIZE_TYPES] ??
        SIZE_TYPES["error"]
  }${
    PRODUCT_TYPES[JSON.stringify(type) as keyof typeof PRODUCT_TYPES]?.length >
    0
      ? ", " + PRODUCT_TYPES[JSON.stringify(type) as keyof typeof PRODUCT_TYPES]
      : PRODUCT_TYPES[JSON.stringify(type) as keyof typeof PRODUCT_TYPES] ??
        PRODUCT_TYPES["error"]
  }.`;
};
// /////////////////////////////////////////
export const detailsTextIngredients = (ingredients: { name: string }[]) => {
  return ingredients.length
    ? `Добавки: ${ingredients.map((el) => el.name.toLowerCase()).join(", ")}.`
    : "";
};
// /////////////////////////////////////////
export interface I_FILTER_PARAMS {
  INGREDIENTS: "ingredients";
  SIZE: "sizes";
  PIZZA_TYPE: "pizza-types";
  PRICE_FROM: "price-from";
  PRICE_TO: "price-to";
}
// все серчпараметры для основной строки этого компонента
export const FILTER_PARAMS: I_FILTER_PARAMS = {
  INGREDIENTS: "ingredients",
  SIZE: "sizes",
  PIZZA_TYPE: "pizza-types",
  PRICE_FROM: "price-from",
  PRICE_TO: "price-to",
};
type SINGLE_PARAM = {
  [K in keyof I_FILTER_PARAMS]: {
    [P in I_FILTER_PARAMS[K]]: string;
  };
}[keyof I_FILTER_PARAMS];

type homePageFilterType = {
  items: {
    some: {
      pizzaType?: {
        in: number[];
        not: null;
      };
      size?: {
        in: number[];
        not: null;
      };
      price?: {
        gte?: number;
        lte?: number;
      };
    };
  };
  ingredients?: {
    some: {
      id: {
        in: number[];
      };
    };
  };
};

// Класс принимает объек серчпараметров {ключ:значение ... }
// и создает объект для передачи в prisma
export class CreatePrismaFilter {
  public homePageFilter: homePageFilterType = {
    items: {
      some: {},
    },
  };

  public prismaHomePageFilter: Prisma.CategoryFindManyArgs = {};

  constructor(serchParams: {
    [key in I_FILTER_PARAMS[keyof I_FILTER_PARAMS]]?: string;
  }) {
    // принимает объект всех параметров
    Object.keys(serchParams).forEach((param) => {
      // перебирает его
      const typedParam = param as keyof typeof serchParams;
      if (serchParams[typedParam]) {
        // разделяет на отдельные параметры {ключ:значение}
        const paramObj = {
          [typedParam]: serchParams[typedParam],
        } as SINGLE_PARAM;
        // создает фильтр для каждого отдельного параметра
        this.createFilter(paramObj);
      }
    });
    // создает фильтр для призмы prismaHomePageFilter на основе промежуточного объекта homePageFilter
    this.createPrismaHomePageFilter();
  }

  // создает фильтр для каждого отдельного серчпараметра
  private createFilter(param: SINGLE_PARAM) {
    const key = Object.keys(param)[0] as I_FILTER_PARAMS[keyof I_FILTER_PARAMS];
    if (!key) return;

    switch (key) {
      case FILTER_PARAMS.INGREDIENTS:
        if (!(key in param)) return;
        const ingredients = param[key].split(",").map((str) => Number(str));
        // разбивает ингридиенты в массив чисел и добавляет их в промежуточный объект
        this.homePageFilter.ingredients = {
          some: {
            id: {
              in: ingredients,
              // not: null,
            },
          },
        };
        break;
      case FILTER_PARAMS.SIZE:
        if (!(key in param)) return;
        const sizes = param[FILTER_PARAMS.SIZE]
          .split(",")
          .map((str) => Number(str));
        // разбивает размеры в массив чисел и добавляет их в промежуточный объект  
        this.homePageFilter.items.some.size = {
          in: sizes,
          not: null,
        };
        break;
      case FILTER_PARAMS.PIZZA_TYPE:
        if (!(key in param)) return;
        const pizzaTypes = param[key].split(",").map((str) => Number(str));
        // разбивает типы пицц в массив чисел и добавляет их в промежуточный объект
        this.homePageFilter.items.some.pizzaType = {
          in: pizzaTypes,
          not: null,
        };
        break;
      case FILTER_PARAMS.PRICE_FROM:
        if (!(key in param)) return;
        const priceFrom = param[key].split(",").map((str) => Number(str));
        // разбивает начальную цену в массив с одним числом
        if (this.homePageFilter.items.some.price !== undefined) {
          // если в промежуточномобъекте уже есть цена, то добавляет минимальную цену
          this.homePageFilter.items.some.price.gte = priceFrom[0];
        } else {
          // если в промежуточномобъекте нет цены, то создает ее и добавляет минимальную цену
          this.homePageFilter.items.some.price = {
            gte: priceFrom[0],
          };
        }
        break;
      case FILTER_PARAMS.PRICE_TO:
        if (!(key in param)) return;
        const priceTo = param[key].split(",").map((str) => Number(str));
        // разбивает начальную цену в массив с одним числом
        if (this.homePageFilter.items.some.price !== undefined) {
          // если в промежуточномобъекте уже есть цена, то добавляет максимальную цену
          this.homePageFilter.items.some.price.lte = priceTo[0];
        } else {
          // если в промежуточномобъекте нет цены, то создает ее и добавляет максимальную цену
          this.homePageFilter.items.some.price = {
            lte: priceTo[0],
          };
        }
        break;
      default:
        let n: never = key;
        break;
    }
  }

  // черт ногу сломит вэтой сраной структуре призмы
  // не помню как ее составлял
  // ищет категории и прикрепляет к ним продукты из серчпараметров
  private createPrismaHomePageFilter() {
    this.prismaHomePageFilter = {
      where: {
        products: {
          some: {
            items: this.homePageFilter.items,
            // ingredients: filter.ingredients ,
            AND:
              this.homePageFilter.ingredients?.some.id.in.map((id) => ({
                ingredients: {
                  some: {
                    id: id,
                  },
                },
              })),
          },
        },
      },
      include: {
        products: {
          where: {
            items: this.homePageFilter.items,
            // ingredients: filter.ingredients,
            AND:
              this.homePageFilter.ingredients?.some.id.in.map((id) => ({
                ingredients: {
                  some: {
                    id: id,
                  },
                },
              })),
          },
          include: {
            items: {
              where: {
                ...this.homePageFilter.items.some,
              },
            },
            ingredients: true,
          },
        },
      },
    };
  }
}
// /////////////////////////////////////////
export const JWT_TOKEN_NAME = "NextPizzaJwtToken";
export const CART_TOKEN_NAME = "cartNextPizzaToken";
export const ORDER_NAME = "NextPizzaOrderId";
export const LOCALSTORAGE_USER_NAME = "NextPizzaUser";

