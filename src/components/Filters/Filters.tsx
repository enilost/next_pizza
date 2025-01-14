"use client";
import { cn } from "@/lib/utils";
import {
  ChangeEvent,
  FunctionComponent,
  memo,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { Title } from "../Title/Title";
import { Input } from "../ui/input";
import { RangeCustom } from "../RangeCustom/RangeCustom";
import CheckboxGroupCustom from "../CheckboxGroupCustom/CheckboxGroupCustom";
import apiClient from "../../../services/apiClient";
import { Ingredient, ProductItem } from "@prisma/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { FILTER_PARAMS, PRODUCT_TYPES } from "@/constants/constants";

interface FiltersProps {
  className?: string;
}
export interface SizeItem {
  id: number;
  name: string;
  size: number;
  // pizzaType: Record<
  //   string | number,
  //   { productIds: number[]; productItemsIds: number[] }
  // >;
  checked: boolean;
}
export interface PizzaTypeItem {
  id: number;
  name: string;
  // size: number;
  pizzaType: number;
  // productIds: number[];
  // productItemsIds: number[];
  checked: boolean;
}
//у компонента двойной рендер на каждое измнение
// из-за того что, при изменении чеков пересчитывается строка фильтра в юзэффекте
// чек-ререндер-пересчетСтроки-ререндер
// можно строку searchString переделать в реф, чтоб этого не было
const Filters: FunctionComponent<FiltersProps> = ({ className }) => {
  // максимальный и минимальный рэйндж цены в фильтре
  const minMaxRange = [0, 1500] as [number, number];
  // выбранный рэйндж цены
  const [price, setPrice] = useState<[number, number]>(minMaxRange);

  // ингредиенты в фильтре по которым чекать чекбоксом
  // и их лоадер для селетона
  const [ingredients, setIngredients] = useState<
    ({ checked: boolean } & Ingredient)[]
  >([]);
  const [loadingIngredients, setLoadingIngredients] = useState(false);

  // размеры пиццы в фильтре и их лоадер для скелетона
  const [sizesArr, setSizesArr] = useState<SizeItem[]>([]);
  const [loadingSizesArr, setLoadingSizesArr] = useState(false);

  // типы пиццы в фильтре (тонкое и традиционное)
  const [pizzaTypesArr, setPizzaTypesArr] = useState<PizzaTypeItem[]>([]);

  // ОСНОВНАЯ СТРОКА, серчпараметров, которую генерирует этот компонент
  const [searchString, setSearchString] = useState(""); //SearchParams.toString()

  const Router = useRouter();
  const [firstLoading, setFirstLoading] = useState(true);

  const searchParams = useSearchParams();
  const pathName = usePathname();

  // // все серчпараметры для основной строки этого компонента
  // const FILTER_PARAMS:I_FILTER_PARAMS = {
  //   INGREDIENTS: "ingredients",
  //   SIZE: "sizes",
  //   PIZZA_TYPE: "pizza-types",
  //   PRICE_FROM: "price-from",
  //   PRICE_TO: "price-to",
  // } as const;

  // таймаут для перехода и время
  let timeouRouterPush = useRef<NodeJS.Timeout | false>(false);
  const TIMEOUT_DELAY = 2000;

  // меняет цену инпутами
  const changePrice = (event: ChangeEvent<HTMLInputElement>, idx: number) => {
    // в значении удаляю все кроме цифр
    const value = event.target.value.replace(/[^0-9]/g, "");

    if (!inRange(+value)) {
      // если новое значение не входит в диапазон
      if (price[idx] != minMaxRange[idx]) {
        // если старое значение не равно границе диапазона
        // то устанавливаю значение на границу
        setPrice((prev) => {
          const newVal = [...prev];
          newVal[idx] = minMaxRange[idx];
          return newVal as [number, number];
        });
      }
      return;
    }

    if (price[idx] != +value) {
      // если старое значение не равно новому
      setPrice((prev): [number, number] => {
        const newVal = [...prev];
        newVal[idx] = +value;
        return newVal as [number, number];
      });
    }
  };

  // проверяет входит ли число в диапазон
  function inRange(num: number) {
    return num >= minMaxRange[0] && num <= minMaxRange[1];
  }

  // заполняет массив размеров исходя из данных полученных продуктов
  // используется в маунте компонента(первый юзэфект)
  const fillSizesArr = (productItem: ProductItem, accum: SizeItem[]): void => {
    if (!productItem.size) {
      // если у продукта нет размера - выходим
      return;
    }
    // ищем, есть ли уже такой размер
    const sizesIdx = accum.findIndex((el) => el.size == productItem.size);
    if (sizesIdx > -1) {
      // если есть - ни чего не делаем
    } else {
      // если нет - добавляем итем в массив с размерами
      const sizeItem = {
        id: productItem.size,
        name: `${productItem.size} см`,
        size: productItem.size,
        checked: searchParamsChecked(FILTER_PARAMS.SIZE, productItem.size),
      };
      accum.push(sizeItem);
    }
  };

  // заполняет массив типов теста исходя из данных полученных продуктов
  // используется в маунте компонента(первый юзэфект)
  const fillPizzaTypesArr = (
    productItem: ProductItem,
    accum: PizzaTypeItem[]
  ): void => {
    if (!productItem.pizzaType) {
      // если у продукта нет типа теста - выходим
      return;
    }
    // ищем, есть ли уже такой тип теста
    const pizzaTypesIdx = accum.findIndex(
      (el) => el.pizzaType == productItem.pizzaType
    );
    if (pizzaTypesIdx > -1) {
      // если есть - ни чего не делаем
    } else {
      // если нет - добавляем итем в массив с типами теста
      const pizzaTypeItem = {
        id: productItem.pizzaType,
        name:
          PRODUCT_TYPES[
            JSON.stringify(productItem.pizzaType) as keyof typeof PRODUCT_TYPES
          ] ?? PRODUCT_TYPES["error"],
        pizzaType: productItem.pizzaType,
        checked: searchParamsChecked(
          FILTER_PARAMS.PIZZA_TYPE,
          productItem.pizzaType
        ),
      };
      accum.push(pizzaTypeItem);
    }
  };

  // заполняет инпуты цен исходя из серчпараметров урла
  // используется в маунте компонента(первый юзэфект)
  const fillPriceArr = () => {
    // начало цены
    const fromValue = searchParams.get(FILTER_PARAMS.PRICE_FROM)?.trim() || "";
    // если оно есть, оно число и оно в рэйндже, выставляю его,
    // иначе ставлю нижнюю границу
    const priceFrom =
      fromValue !== "" && !isNaN(+fromValue) && inRange(+fromValue)
        ? +fromValue
        : minMaxRange[0];

    // конец цены
    const toValue = searchParams.get(FILTER_PARAMS.PRICE_TO)?.trim() || "";
    // если оно есть, оно число и оно в рэйндже, выставляю его,
    // иначе ставлю верхнюю границу
    const priceTo =
      toValue !== "" && !isNaN(+toValue) && inRange(+toValue)
        ? +toValue
        : minMaxRange[1];
    return [priceFrom, priceTo] as [number, number];
  };

  // принимает серчпараметр и его значение
  // возвращает true если этот серчпараметр с этим значениеместь в урле
  // используется для установки чекбоксов в маунте компонента (первый юзэфект)
  const searchParamsChecked = (searchparam: string, value: number) => {
    if (searchParams.has(searchparam)) {
      if (searchParams.get(searchparam)?.split(",").includes(String(value))) {
        return true;
      }
      return false;
    } else {
      return false;
    }
  };
  useEffect(() => {
    console.log("useEffect 1 filter mounted", searchString);
    //маунтед компонента
    // загружает все списки, типы галочек
    // и устанавливает чекбоксы, если они есть в серчпараметрах урла

    // список ингредиентов для фильтра
    async function getIngredients() {
      try {
        // состояние загрузки для скелетона
        setLoadingIngredients((prev) => true);
        // ингредиенты с бэка
        const getIngredients = await apiClient.getIngredients();
        // добавление чеков для связывания с чекбоксами
        const ingredientsCheked = getIngredients.map((el) => ({
          ...el,
          // проверяем есть ли этот ингредиент в строке юрл(тру\фолс)
          checked: searchParamsChecked(FILTER_PARAMS.INGREDIENTS, el.id),
        }));
        // записываем полученные ингредиенты в стейт
        setIngredients(ingredientsCheked);
      } catch (error) {
        console.log("filters getIngredients", error);
        setIngredients([]);
      } finally {
        setLoadingIngredients(false);
      }
    }

    // список продуктов
    async function getProductItems() {
      // получает список продуктов
      // и из полученного списка заполняет массивы размеров и типов теста для фильтра
      try {
        setLoadingSizesArr((prev) => true);
        const productItems = await apiClient.getProductItems();

        // заполняет сюда все уникальные размеры и типы теста
        const sizes: SizeItem[] = [];
        const pizzaTypes: PizzaTypeItem[] = [];

        productItems.forEach((productItem) => {
          fillSizesArr(productItem, sizes);
          fillPizzaTypesArr(productItem, pizzaTypes);
        });
        setSizesArr(sizes);
        setPizzaTypesArr(pizzaTypes);
      } catch (error) {
        console.log("filters getProductItems", error);
        setSizesArr([]);
        setPizzaTypesArr([]);
      } finally {
        setLoadingSizesArr(false);
      }
    }
    // заполняет инпуты цены в фильтре
    setPrice(fillPriceArr());

    Promise.all([getIngredients(), getProductItems()]).finally(() => {
      setTimeout(() => {
        //блочит выполнение остальных юзэффектов во время исполнения маунтед
        setFirstLoading(false);
      }, 0);
    });
  }, []);

  // ФОРМИРУЕТ ОСНОВНУЮ СТРОКУ КОМПОНЕНТА!!!
  useEffect(() => {
    // пересчитывает строку серчпараметров в зависимости от фильтров
    if (firstLoading) {
      return;
    }
    // console.log("useEffect 2 createSearchParamsString");

    const newsearchParams = createSearchParamsString();
    // console.log("newsearchParams", newsearchParams);

    setSearchString((prev) => newsearchParams);
  }, [price, ingredients, sizesArr, pizzaTypesArr, firstLoading]);

  // функция генерирует основную строку
  const createSearchParamsString = () => {
    const newsearchParams = new URLSearchParams();
    // если цена не равна дефолтному значению
    if (price[0] != minMaxRange[0] && inRange(price[0])) {
      newsearchParams.append(FILTER_PARAMS.PRICE_FROM, price[0].toString());
    }
    if (price[1] != minMaxRange[1] && inRange(price[1])) {
      newsearchParams.append(FILTER_PARAMS.PRICE_TO, price[1].toString());
    }
    // собирает список id выбранных ингредиентов
    const checkedIngredients = ingredients
      .filter((el) => el.checked)
      .map((el) => el.id);
    // собирает список size выбранных размеров
    const checkedSizes = sizesArr
      .filter((el) => el.checked)
      .map((el) => el.size);
    // собирает список pizza-types выбранных типов теста
    const checkedPizzaTypes = pizzaTypesArr
      .filter((el) => el.checked)
      .map((el) => el.pizzaType);

    if (checkedIngredients.length > 0) {
      // если есть выбранные ингредиенты, то добавляет их в строку
      newsearchParams.append(
        FILTER_PARAMS.INGREDIENTS,
        checkedIngredients.toString()
      );
    }
    if (checkedSizes.length > 0) {
      // если есть выбранные размеры, то добавляет их в строку
      newsearchParams.append(FILTER_PARAMS.SIZE, checkedSizes.toString());
    }
    if (checkedPizzaTypes.length > 0) {
      // если есть выбранные типы теста, то добавляет их в строку
      newsearchParams.append(
        FILTER_PARAMS.PIZZA_TYPE,
        checkedPizzaTypes.toString()
      );
    }
    // возвращает сгенерированную строку серчпараметров
    return newsearchParams.toString();
  };
  useEffect(() => {
    // если сгенерированная с помощью фильтров серч-строка не равна серч-строке в урле
    // то перестраивает стейт в соответствии с урлом
    // срабатывает при изменении урла не через фильтр, а например при переходе по ссылке
    if (firstLoading) {
      return;
    }
    // console.log("useEffect 3 searchParams.toString()");

    if (searchString !== searchParams.toString()) {
      // setAllCheckUrl();
    }
  }, [searchParams.toString()]); //срабатывает после пуша
  // }, [window.location.search]); //срабатывает сразу после 2 до пуша

  useEffect(() => {
    // пушит на страницу с новыми серчпараметрами
    if (firstLoading) {
      return;
    }
    // console.log("useEffect 4 searchString - ", searchString);
    // если сгенерированная с помощью фильтров серч-строка не равна серч-строке в урле
    // то переходим на новую страницу через setTimeout
    if (searchString !== searchParams.toString()) {
      timeouRouterPush.current = setTimeout(() => {
        // таймаут удаляется в ретерне
        // console.log("timeouRouterPush");
        Router.replace(
          //push replace
          "/" + searchString.length ? "?" + searchString : "",
          // pathName + `${searchString.length ? "?" + searchString : ""}`,
          {
            scroll: false,
          }
        );
        timeouRouterPush.current = false;
      }, TIMEOUT_DELAY);
    }
    return () => {
      // удаляем таймаут, если буфер не закончился
      if (timeouRouterPush.current) {
        clearTimeout(timeouRouterPush.current);
        timeouRouterPush.current = false;
      }
    };
  }, [searchString]);

  useEffect(() => {
    if (firstLoading) {
      return;
    }
    // допустим пользователь нажал на роутинг до срабатывания таймаута
    // тогда при возвращении у него в урле не будет той строки серчпараметров, которую он выбрал

    // тут сравнивается сгенерированная стейтом серчстрока с серчстрокой в урле
    // и выставляется серчстрока на основе стейта
    if (timeouRouterPush.current !== false) {
      clearTimeout(timeouRouterPush.current);
      timeouRouterPush.current = false;
    }
    if (pathName === "/") {
      if (searchString !== searchParams.toString()) {
        const newsearchParams = createSearchParamsString();
        // history.replaceState({},'',newsearchParams? '/'+'?'+newsearchParams:'/')
        Router.replace(
          "/" + newsearchParams.length ? "?" + newsearchParams : "",
          {
            scroll: false,
          }
        );
      }
    }
  }, [pathName]);

  const setAllCheckUrl = () => {
    console.log("setAllCheckUrl");
    // заполняет стейт из юрл строки,
    // просто альтернативныцй неиспользуемый метод

    // карта сеттеров части стейта
    const mapSetStatesCheck = {
      [FILTER_PARAMS.SIZE]: setSizesArr,
      [FILTER_PARAMS.INGREDIENTS]: setIngredients,
      [FILTER_PARAMS.PIZZA_TYPE]: setPizzaTypesArr,
    };

    // объект из серчпараметров урла {серч:значение}
    const objSearch = Object.fromEntries(searchParams);

    // type stateTypes = PizzaTypeItem[] | SizeItem[] | typeof ingredients;
    type stateTypes = {
      [K in keyof typeof mapSetStatesCheck]: Parameters<
        (typeof mapSetStatesCheck)[K]
      >[0] extends SetStateAction<infer T>
        ? T
        : never;
    }[keyof typeof mapSetStatesCheck];

    type setType<T> = (func: (arg: T) => T) => void;

    // устанавливает чекбоксы считывая их из строки урла
    Object.keys(mapSetStatesCheck).forEach((key) => {
      // typedKey - это серчпараметр урла
      const typedKey = key as keyof typeof mapSetStatesCheck;
      // setState - это сеттер стейта, который устанавливает чекбоксы
      const setState = mapSetStatesCheck[typedKey] as setType<stateTypes>;
      setState((prev) => {
        if (typedKey in objSearch) {
          // если в урле есть такой серчпараметр(ключ)
          // то беру его значение, разделяю по запятой, получая массив значений arrValues
          const arrValues = objSearch[typedKey].split(",");
          // формирую новый стейт
          const returnState = prev.map((el) => {
            if (arrValues.includes(el.id.toString())) {
              arrValues.splice(arrValues.indexOf(el.id.toString()), 1);
              return { ...el, checked: true };
            }
            return { ...el, checked: false };
          });
          return returnState as stateTypes;
        }
        const returnState = prev.map((el) => {
          return { ...el, checked: false };
        });
        return returnState as stateTypes;
      });
    });

    //вторая карта сеттеров части стейта
    // на цену другая логика
    const mapSetStatePrice = {
      [FILTER_PARAMS.PRICE_FROM]: setPrice,
      [FILTER_PARAMS.PRICE_TO]: setPrice,
    };

    Object.keys(mapSetStatePrice).forEach((key) => {
      // typedKey - это серчпараметр урла
      const typedKey = key as keyof typeof mapSetStatePrice;
      // setState - это сеттер стейта, который устанавливает цену в диапазон
      const setState = mapSetStatePrice[typedKey];
      setState((prev) => {
        if (typedKey in objSearch) {
          // если в урле есть такой серчпараметр(ключ)
          if (typedKey === FILTER_PARAMS.PRICE_FROM) {
            // если начало цены
            const priceFrom = Number(objSearch[typedKey]);
            return !isNaN(priceFrom) &&
              typeof priceFrom === "number" &&
              inRange(priceFrom)
              ? [priceFrom, prev[1]]
              : [minMaxRange[0], prev[1]];
          }
          if (typedKey === "price-to") {
            // если конец цены
            const priceTo = Number(objSearch[typedKey]);
            return !isNaN(priceTo) &&
              typeof priceTo === "number" &&
              inRange(priceTo)
              ? [prev[0], priceTo]
              : [prev[0], minMaxRange[1]];
          }
        }
        // return prev;
        return minMaxRange as [number, number];
      });
    });
  };
  // console.log('render FILTRES');

  return (
    <div className={cn("", className)}>
      <Title size="h4" className="mb-5 font-bold">
        Фильтрация
      </Title>
      {/* <div className={cn("flex flex-col gap-4")}>
             <CheckboxCustom label={"Можно собирать"} value="1" />
        <CheckboxCustom label={"Новинки"} value={"2"} />
      </div> */}
      <CheckboxGroupCustom
        loading={loadingSizesArr}
        title="Тип теста"
        visibleLimit={3}
        // items={ingredients}
        items={pizzaTypesArr}
        // searchInputPlaceholder="Поиск..."
        onCheckedChange={(checked, id) => {
          setPizzaTypesArr((perev) => {
            return perev.map((el) => {
              return el.id == id ? { ...el, checked: checked } : el;
            });
          });
        }}
      />
      <CheckboxGroupCustom
        loading={loadingSizesArr}
        title="Размеры"
        visibleLimit={5}
        // items={ingredients}
        items={sizesArr}
        // searchInputPlaceholder="Поиск..."
        onCheckedChange={(checked, id) => {
          setSizesArr((perev) => {
            return perev.map((el) => {
              return el.id == id ? { ...el, checked: checked } : el;
            });
          });
        }}
      />

      <div className={cn("mt-5 border-y border-y-neutral-100 py-6 pb-7")}>
        <Title size="h5" className="mb-5 font-bold">
          Цена от и до
        </Title>
        <div className={cn("flex gap-3 mb-5")}>
          <Input
            type="number"
            placeholder={minMaxRange[0] + ""}
            min={minMaxRange[0]}
            max={minMaxRange[1]}
            value={price[0]}
            // defaultValue={price[0]}
            onChange={(e) => {
              changePrice(e, 0);
            }}
          />
          <Input
            type="number"
            placeholder={minMaxRange[1] + ""}
            min={100}
            max={minMaxRange[1]}
            value={price[1]}
            // defaultValue={price[1]}
            onChange={(e) => {
              changePrice(e, 1);
            }}
          />
        </div>
        <RangeCustom
          min={minMaxRange[0]}
          max={minMaxRange[1]}
          step={1}
          value={price}
          onValueChange={setPrice}
        />
      </div>

      {/* <Title size="h4" className="mb-5 font-bold mt-5">
            Ингридиенты
          </Title> */}
      <CheckboxGroupCustom
        loading={loadingIngredients}
        title="Ингредиенты"
        visibleLimit={5}
        items={ingredients}
        searchInputPlaceholder="Поиск..."
        onCheckedChange={(checked, id) => {
          setIngredients((perev) => {
            return perev.map((el) => {
              return el.id == id ? { ...el, checked: checked } : el;
            });
          });
        }}
      />

      {/* <Title size="h4" className="mb-5 font-bold mt-5">
        Ингридиенты
      </Title>
      <CheckboxGroupCustom
        visibleLimit={3}
        items={[]}
        searchInputPlaceholder="Поиск..."
      /> */}
      <div className={cn("flex flex-col gap-4")}></div>
    </div>
  );
};

export default Filters;
