"use client";
import { cn } from "@/lib/utils";
import {
  ChangeEvent,
  FunctionComponent,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { Input } from "../ui/input";
import { useStoreUser } from "@/store/user";
import { useStoreWithEqualityFn } from "zustand/traditional";
const COUNT = 20;
const DELAY = 777;
// константы для валидаций////////////////////////////////////////////////////////////
const MIN = 2;
const FIAS_LEVELS = ["8", "9", "6", "7", "65"];
const requred = "Поле обязательно для заполнения";
const minLength = `Минимальное количество символов для поиска адреса - ${MIN}`;
const noChoice = "Выберите адрес из списка";
const catchError = "ошибка соединения с сервером адресов, попробуйте позже";
const notFullAddress =
  "Адрес должен быть полным, включая дом и квартиру(если есть)";
// //////////////////////////////////////////////////////////////////////////////////

export interface I_dadataAddress {
  value: string;
  unrestricted_value: string;
  data: {
    postal_code: string;
    country: string;
    region: string;
    city: string;
    street: string;
    house: string;
    flat: string;
    fias_level: string;
    fias_id: string;
  };
}
interface DadataAddressProps {
  className?: string;
}
const DadataAddress: FunctionComponent<DadataAddressProps> = ({
  className,
}) => {
  // фокус на инпуте
  const [isFocused, setIsFocused] = useState(false);
  // список полученных адесов дадаты
  const [dadataListAddresses, setDadataListAddresses] = useState<
    I_dadataAddress[]
  >([]);
  const [dadataCatchError, setDadataCatchError] = useState<Error | null>(null);
  // загрузка
  const [isLoading, setIsLoading] = useState(false);

  const firstRender = useRef(true);
  const addressesRef = useRef<HTMLDivElement>(null);

  const id = useId();
  const label = "(Обл./край),город, улица, дом, квартира(если есть)";

  // методы глобального стора юзера, для записи в него ыбранного адреса и ошибки валидации
  const [
    queryInputAddress,
    setQueryInputAddress,

    userSelectedAddress,
    setUserSelectedAddress,

    userValidErrorAddress,
    setUserValidErrorAddress,

    // triggerForGetAddressData,
  ] = useStoreWithEqualityFn(
    useStoreUser,
    (state) => [
      state.queryInputAddress,
      state.setQueryInputAddress,

      state.address,
      state.setAddress,

      state.validErrorAddress,
      state.setValidErrorAddress,
      // триггер для принудительного ререндера, если с инпутом не взаимодействовали
      // state.triggerForGetAddressData,
    ],
    (prev, next) =>// false
    prev[0] === next[0] &&
    next[2]?.value === prev[2]?.value &&
    next[4] === prev[4]
  );

  const getAddresses: (controller: AbortController) => Promise<{
    suggestions: I_dadataAddress[];
  }> = async (controller) => {
    // запрос для получения ип адреса и поиска адресов на его онове
    // fetch('https://api.ipify.org?format=json')
    // .then(response => response.json())
    // .then(data => {
    //   const userIP = data.ip;
    //   console.log(userIP);
    // });

    let url =
      "http://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";
    let token = process.env.NEXT_PUBLIC_DADATA_API_KEY;
    let query = queryInputAddress;
    const mode = "cors" as const;
    let options = {
      method: "POST",
      mode: mode,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Token " + token,
      },
      body: JSON.stringify({
        query: query,
        count: COUNT,
        // locations_boost: { kladr_id: "kladr_id" },
      }),
    };

    return new Promise((resolve, reject) => {
      // если в инпуте меньше 2 символов то не делать запрос
      if (queryInputAddress.length < MIN) {
        resolve({ suggestions: [] });
        return;
      }

      fetch(url, options)
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              "Ошибка сети, component DadataAddress-getAddresses"
            );
          }
          return response.json();
        })
        .then((result) => resolve(result))
        .catch((error) => reject(error));
    });
  };

  useEffect(() => {
    // делает запрос на подсказки при вводе адреса
    if (firstRender.current) return;

    const controller = new AbortController();
    const bounceTimeout = setTimeout(() => {
      setIsLoading(true);

      getAddresses(controller)
        .then((result) => {
          setDadataListAddresses(result.suggestions.map((item) => item));
        })
        .catch((error) => {
          console.log("component DadataAddress useEffect error - ", error);
          setDadataCatchError(error);
          setDadataListAddresses([]);
          // setSelectedAddress(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }, DELAY);
    return () => {
      controller.abort();
      clearTimeout(bounceTimeout);
    };
  }, [queryInputAddress]);

  // // цвет фона инпута валидации
  const bgColorInput = () => {
    let cssClass = "";
    if (userValidErrorAddress) {
      cssClass = "bg-red-200";
    } else if (userSelectedAddress && queryInputAddress == userSelectedAddress.value) {
      cssClass = "bg-green-200";
    }
    return cssClass;
  };

  // валидация, запускается в юзэффекте при смене инпута, выбранного адреса и ошибки соединения
  const validation = () => {
    // на обязательность
    if (queryInputAddress.length == 0) {
      userValidErrorAddress !== requred && setUserValidErrorAddress(requred);
      return;
    }
    // на мин длинну
    if (queryInputAddress.length < MIN) {
      userValidErrorAddress !== minLength &&
        setUserValidErrorAddress(minLength);
      return;
    }
    // на ошибку запроса
    if (dadataCatchError !== null) {
      userValidErrorAddress !== catchError &&
        setUserValidErrorAddress(catchError);
      return;
    }
    // если не выбран адрес из списка
    if (!userSelectedAddress) {
      userValidErrorAddress !== noChoice && setUserValidErrorAddress(noChoice);
      return;
    }
    // если адрес без дома и\или квартиры
    if (
      userSelectedAddress &&
      !FIAS_LEVELS.includes(userSelectedAddress.data.fias_level)
    ) {
      userValidErrorAddress !== notFullAddress &&
        setUserValidErrorAddress(notFullAddress);
      return;
    }
    userValidErrorAddress !== null && setUserValidErrorAddress(null);
  };

  // обработка инпута
  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setQueryInputAddress(e.target.value);
    if (userValidErrorAddress) {
      // при изменении инпута очищает ошибку валидации если она есть
      setUserValidErrorAddress(null);
    }
    if (dadataCatchError !== null) {
      // при изменении инпута очищает ошибку запроса если она есть
      setDadataCatchError(null);
    }
    if (userSelectedAddress) {
      // при изменении инпута очищает выбранный адрес если он есть
      setUserSelectedAddress(null);
    }
  };

  // // обработка выбора адреса из списка
  const handleChoiseAddress = (item: I_dadataAddress) => {
    setUserSelectedAddress(item);
    setQueryInputAddress(item.value);
    //   // setAddress(item);
  };

  // делает запрос на подсказки при вводе адреса

  // юзэффект валидации
  // срабатывает после изменения инпута, выбранного адреса и ошибки соединения
  useEffect(() => {
    // юзэффект валидации
    if (firstRender.current) return;
    validation();
  }, [queryInputAddress, userSelectedAddress, dadataCatchError]);
  // юзэффект для принудительного ререндера, если с инпутом не взаимодействовали

  
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
  }, []);
  return (
    <div
      className={cn(
        "relative border-t border-b border-transparent",
        isFocused ? "z-30" : "",
        className
      )}
    >
      {/* <p>{'строка дебага - '+ address?.value + " , " + address?.data.fias_level}</p> */}
      {queryInputAddress.length > 0 && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 pl-3 cursor-pointer"
        >
          {label}
        </label>
      )}
      {/* <form action=""> */}
      <Input
        name={"address"}
        id={id}
        className={cn(
          "rounded-2xl outline-none w-full bg-gray-200 pl-3",
          queryInputAddress.length > 0 ? "" : "mt-5",
          userValidErrorAddress ?? "mb-6",
          bgColorInput()
        )}
        placeholder={label}
        type="search"
        value={queryInputAddress}
        onChange={handleChangeInput}
        onFocus={(e) => {
          setIsFocused(true);
        }}
        onBlur={(e) => {
          // const target = e.relatedTarget as HTMLElement;
          // if (target && addressesRef.current?.contains(target)) {
          //   // при клике на выборе адреса в списке инпут не теряет фокус
          //   return;
          // }

          setIsFocused(false);
          // validation();
        }}
        autoComplete="off"
      />
      {/* </form> */}
      {userValidErrorAddress && (
        <p className="pl-3 text-red-400">{userValidErrorAddress}</p>
      )}

      {queryInputAddress.length > 0 && (
        <div
          ref={addressesRef}
          id="addresses"
          className={cn(
            "absolute w-full bg-white rounded-xl top-[100%] shadow-md transition-all duration-300 invisible opacity-0 z-30 min-h-11 max-h-[250px] overflow-hidden flex flex-col",
            isFocused ? "visible opacity-100  top-[100%]" : ""
          )}
        >
          <div className=" max-h-inherit overflow-y-auto scrl_glbl">
            {dadataListAddresses.length ? (
              dadataListAddresses.map((item, index) => (
                <p
                  tabIndex={0}
                  className={cn(
                    "px-11 py-3",
                    " hover:bg-primary/20 focus:bg-primary/20 cursor-pointer flex items-center gap-2",
                    isLoading ? "opacity-50 cursor-wait" : ""
                  )}
                  key={item.value + index}
                  onClick={() => {
                    handleChoiseAddress(item);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      // handleChoiseAddress(item);
                      // setIsFocused(false);
                    }
                  }}
                >
                  {item.value}
                </p>
              ))
            ) : (
              <p
                className={cn(
                  "px-11 py-3",
                  " hover:bg-primary/20 cursor-pointer flex items-center gap-2",
                  isLoading ? "opacity-50 cursor-wait" : ""
                )}
              >
                ни чего не найдено
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DadataAddress;
