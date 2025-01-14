import { Prisma } from "@prisma/client";

const error = {
  error: "Ошибка, нет такого типа в файле constants.ts",
} as const;
// : Record<string, string>
export const PRODUCT_TYPES = {
  "1": "тонкое тесто",
  "2": "традиционное тесто",
  null: "",
  ...error,
} as const;
export const SIZE_TYPES = {
  "20": "Маленький размер",
  "30": "Средний размер",
  "40": "Большой размер",
  null: "Стандартная порция",
  ...error,
} as const;

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

export const detailsTextIngredients = (ingredients: { name: string }[]) => {
  return ingredients.length
    ? `Добавки: ${ingredients.map((el) => el.name.toLowerCase()).join(", ")}.`
    : "";
};

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
    Object.keys(serchParams).forEach((param) => {
      const typedParam = param as keyof typeof serchParams;
      if (serchParams[typedParam]) {
        const paramObj = {
          [typedParam]: serchParams[typedParam],
        } as SINGLE_PARAM;

        this.createFilter(paramObj);
      }
    });

    this.createPrismaHomePageFilter();
  }

  private createFilter(param: SINGLE_PARAM) {
    const key = Object.keys(param)[0] as I_FILTER_PARAMS[keyof I_FILTER_PARAMS];
    if (!key) return;

    switch (key) {
      case FILTER_PARAMS.INGREDIENTS:
        if (!(key in param)) return;
        const ingredients = param[key].split(",").map((str) => Number(str));
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
        this.homePageFilter.items.some.size = {
          in: sizes,
          not: null,
        };
        break;
      case FILTER_PARAMS.PIZZA_TYPE:
        if (!(key in param)) return;
        const pizzaTypes = param[key].split(",").map((str) => Number(str));
        this.homePageFilter.items.some.pizzaType = {
          in: pizzaTypes,
          not: null,
        };
        break;
      case FILTER_PARAMS.PRICE_FROM:
        if (!(key in param)) return;
        const priceFrom = param[key].split(",").map((str) => Number(str));
        if (this.homePageFilter.items.some.price !== undefined) {
          this.homePageFilter.items.some.price.gte = priceFrom[0];
        } else {
          this.homePageFilter.items.some.price = {
            gte: priceFrom[0],
          };
        }
        break;
      case FILTER_PARAMS.PRICE_TO:
        if (!(key in param)) return;
        const priceTo = param[key].split(",").map((str) => Number(str));
        if (this.homePageFilter.items.some.price !== undefined) {
          this.homePageFilter.items.some.price.lte = priceTo[0];
        } else {
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
