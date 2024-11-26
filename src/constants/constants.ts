const error = { error: "Ошибка, нет такого типа в файле constants.ts" } as const;
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
      : SIZE_TYPES[JSON.stringify(size) as keyof typeof SIZE_TYPES] ?? SIZE_TYPES["error"]
  }${
    PRODUCT_TYPES[JSON.stringify(type) as keyof typeof PRODUCT_TYPES ]?.length > 0
      ? ", " + PRODUCT_TYPES[JSON.stringify(type) as keyof typeof PRODUCT_TYPES]
      : PRODUCT_TYPES[JSON.stringify(type) as keyof typeof PRODUCT_TYPES] ?? PRODUCT_TYPES["error"]
  }.`;
};

export const detailsTextIngredients = (ingredients: {name:string}[]) => {
    return ingredients.length
    ? `Добавки: ${ingredients.map((el) => el.name.toLowerCase()).join(", ")}.`
    : "";
}
