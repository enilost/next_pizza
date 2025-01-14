"use client";
import { FunctionComponent, useEffect } from "react";
import { Title } from "../Title/Title";
import RadioCustom from "../RadioCustom/RadioCustom";
import { cn } from "@/lib/utils";
import { ProductIngedientItem } from "../ProguctCardGroup/ProguctCardGroup";
import React from "react";
import { Button } from "../ui/button";
import Ingredient from "../Ingredient/Ingredient";
import { Ingredient as IngredientType } from "@prisma/client";
import {
  detailsTextIngredients,
  detailsTextSize,
  PRODUCT_TYPES,
  SIZE_TYPES,
} from "@/constants/constants";
import { useStoreCart } from "@/store/cart";
import { ICart } from "../../../services/cart";


interface ProductCardDetailProps {
  product: ProductIngedientItem;
  className?: string;
  onClick?: VoidFunction;
}

const ProductCardDetail: FunctionComponent<ProductCardDetailProps> = ({
  product,
}) => {
  type radioMapType = {
    // disabled: boolean;
    name: string;
    value: string;
    id: number;
    price: number;
    size: number | null;
    pizzaType: number | null;
    productId: number;
  };

  const fillRadiomap = () => {
    // создает карту размеров продукта
    // исходя из значения свойства pizzaType:1,2,null... это тип теста
    // примерно так типТеста:[итемы с этим типом теста]
    // { 
    //  '1': [маленькая, средняя],
    //  '2': [большая, средняя, маленькая],
    //  'null': ['стандартная порция']... это не для пицц
    // }
    const radioMapRes: Record<string, [radioMapType]> = {};
    product.items.forEach((item) => {
      const keyStr = JSON.stringify(item.pizzaType);
      const el = {
        ...item,
        name:
          SIZE_TYPES[JSON.stringify(item.size) as keyof typeof SIZE_TYPES] ??
          SIZE_TYPES["error"],
        value: JSON.stringify(item.size),
      };
      radioMapRes[keyStr] !== undefined && Array.isArray(radioMapRes[keyStr])
        ? radioMapRes[keyStr].push(el)
        : (radioMapRes[keyStr] = [el]);
    });
    return radioMapRes;
  };
  //карта размеров продукта по pizzaType string:[итемы]
  const [radioMap, setRadioMap] = React.useState(fillRadiomap);

  //массив с типами теста
  const [uniqueItemTypes, setUniqueItemTypes] = React.useState(
    // на основании ключей radioMap делает массив для ряда кнопок выбора теста
    // сколько типов было найденов в продукте, 
    // столько кнопок выбора теста и появится
    Object.keys(radioMap).map((key, idx) => {
      return {
        id: idx,
        // disabled: false,
        name:
          PRODUCT_TYPES[key as keyof typeof PRODUCT_TYPES] === ""
            ? "Стандарт"
            : PRODUCT_TYPES[key as keyof typeof PRODUCT_TYPES] ??
              PRODUCT_TYPES["error"],
        value: key,
      };
    })
  );

  //выбранный тип теста, служит для навигации по карте типов [key]
  // radioMap[selectedItemType] - это массив вариантов выбора размера
  // с определенным типом теста, 
  const [selectedItemType, setSelectedItemType] = React.useState(
    // по умолчанию выбран первый элемент из массива
    uniqueItemTypes[0].value
  );
  //выбранный размер продукта в соответствии с выбранным типом теста
  const [selectedItem, setSelectedItem] = React.useState(
    // по умолчанию выбран первый элемент из массива
    radioMap[selectedItemType][0]
  );
  // выбранные ингредиенты
  const [selectedIngredients, setSelectedIngredients] = React.useState<
    IngredientType[]
  >([]);
  // добавляет выбранный вариант продукта в корзину стейта зустанд
  const addCartItem = useStoreCart((state) => state.addCartItem);
  useEffect(() => {
    // при изменении выбранного типа теста,
    // меняется выбранный размер продукта
    // на первый в списке
    setSelectedItem(radioMap[selectedItemType][0]);
  }, [selectedItemType]);

  const addToCart = () => {
    const cartItemStart = {
      id: 0,
      productItemId: selectedItem.id,
      cartId: 0,
      quantity: 1,
      createdAt: new Date().toString() as unknown as Date,
      updatedAt: new Date().toString() as unknown as Date,
    };

    const cartItem: ICart["items"][number] = {
      ...cartItemStart,
      productItem: {
        id: selectedItem.id,
        price: selectedItem.price,
        size: selectedItem.size,
        pizzaType: selectedItem.pizzaType,
        productId: selectedItem.productId,
        product: {
          id: selectedItem.productId,
          name: product.name,
          imageUrl: product.imageUrl,
          createdAt: product.createdAt as Date,
          updatedAt: product.updatedAt as Date,
          categoryId: product.categoryId,
        },
      },
      ingredients: selectedIngredients,
    };
    addCartItem(cartItem);
    // тосыты (уведомления) вызываются в store/cart.ts/addCartItem
  };

  const details1 = detailsTextSize(selectedItem.size, selectedItem.pizzaType);

  const details2 = detailsTextIngredients(selectedIngredients);

  const pRef = React.useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    if (!pRef.current) return;
    const rect = pRef.current.children[0].getBoundingClientRect();
    const pHeight = rect.height;
    if (details2.length > 0) {
      pRef.current.style.height = `${pHeight}px`;
    } else {
      pRef.current.style.height = `0`;
    }
  }, [details2]);

  return (
    <div className="flex flex-1  ">
      {/* justify-between */}
      {/* <Toaster /> */}
      <div
        // className="relative"
        className={cn(
          "flex items-center justify-center flex-1 relative  h-[500px] w-[500px] self-center",
          {}
        )}
      >
        <img
          src={product.imageUrl}
          alt="изображение продукта"
          className={cn(
            "relative left-2 top-2 transition-all z-10 duration-300",
            {
              "w-[300px] h-[300px]": selectedItem.size === 20,
              "w-[400px] h-[400px]": selectedItem.size === 30,
              "w-[500px] h-[500px]": selectedItem.size === 40,

              "w-[400px] h-[400px] ": selectedItem.size === null,
            }
          )}
        />
{/* если в pizzaType продукта нет null, то выводятся кружки с размерами
можно переделать на основе количества размеров, а не на основе типа теста */}
        {!uniqueItemTypes.every((el) => el.value == "null") && (
          <>
            <div
              className={cn(
                "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-dashed border-2 rounded-full border-gray-200 w-[450px] h-[450px]"
              )}
            ></div>
            <div
              className={cn(
                "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-dotted border-2 rounded-full border-gray-100 w-[370px] h-[370px]"
              )}
            ></div>
          </>
        )}
      </div>
      <div className="w-[480px] bg-gray-200 p-4 self-center rounded-3xl relative">
        <Title className="font-extrabold mb-1" size="h3">
          {product.name}
        </Title>

        <p
          className={cn(
            "text-gray-500 mb-2 whitespace-pre break-all my-0"
            // details.split("\n")[1].length > 0 ? "max-h-[100%]" : ""
          )}
          style={{ whiteSpace: "pre-wrap" }}
        >
          {details1}
        </p>

        <div
          className={cn("  transition-all duration-700 h-0 overflow-hidden")}
          ref={pRef}
        >
          <p
            className={cn("text-gray-500 mb-2 whitespace-pre break-all my-0")}
            style={{ whiteSpace: "pre-wrap", overflow: "hidden" }}
          >
            {details2}
          </p>
        </div>

        {radioMap[selectedItemType].some((el) => el.value !== "null") && (
          <RadioCustom
            className="my-2"
            selectedValue={selectedItem.value + ""}
            onClick={(value) => setSelectedItem(value as radioMapType)}
            items={radioMap[selectedItemType]}
          ></RadioCustom>
        )}

        {uniqueItemTypes.length > 1 && (
          <RadioCustom
            className="my-2"
            selectedValue={selectedItemType}
            onClick={(value) => setSelectedItemType(value.value)}
            items={uniqueItemTypes}
          ></RadioCustom>
        )}
        {product.ingredients.length > 0 && (
          <>
            <Title size="h4">Добавить по вкусу:</Title>
            <div className="parentshadow mb-5 relative ">
              <div className="grid grid-cols-3 gap-3  scrl_glbl  overflow-hidden overflow-y-auto py-3  max-h-[250px]   ">
                {product.ingredients.map((el) => (
                  <Ingredient
                    key={el.id}
                    imageUrl={el.imageUrl}
                    name={el.name}
                    price={el.price}
                    onClick={() => {
                      const idx = selectedIngredients.findIndex(
                        (ing) => el.id == ing.id
                      );
                      const newIngredients = [...selectedIngredients];
                      if (idx > -1) {
                        newIngredients.splice(idx, 1);
                      } else {
                        newIngredients.push(el);
                      }
                      setSelectedIngredients(newIngredients);
                    }}
                    active={selectedIngredients.some((ing) => ing.id == el.id)}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        <Button
          // loading={false}
          onClick={addToCart}
          className="h-[55px] px-10 text-base rounded-3xl w-full "
        >
          Добавить в корзину за{" "}
          {selectedItem.price +
            selectedIngredients.reduce((acc, el) => acc + el.price, 0)}{" "}
          ₽
        </Button>
      </div>
    </div>
  );
};

export default ProductCardDetail;
