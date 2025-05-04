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
  // значение из инпута
  const [queryAddress, setQueryAddress] = useState("");
  // фокус на инпуте
  const [isFocused, setIsFocused] = useState(false);
  // список полученных адесов дадаты
  const [dadataAddresses, setDadataAddresses] = useState<I_dadataAddress[]>([]);
  const [dadataCatchError, setDadataCatchError] = useState<Error | null>(null);
  // выбраннйы адресс из списка
  const [selectedAddress, setSelectedAddress] =
    useState<I_dadataAddress | null>(null);
  // загрузка
  const [isLoading, setIsLoading] = useState(false);
  // валидация
  const [validError, setValidError] = useState<null | string>(null);
  const firstRender = useRef(true);
  const addressesRef = useRef<HTMLDivElement>(null);

  const id = useId();
  const label = "(Обл./край),город, улица, дом, квартира(если есть)";

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
    let query = queryAddress;
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
      if (queryAddress.length < MIN) {
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
    if (userAddress) {
      setSelectedAddress(userAddress);
      setQueryAddress(userAddress.value);
    }
    if (userValidErrorAddress) setValidError(userValidErrorAddress);
  }, []);
  // делает запрос на подсказки при вводе адреса
  useEffect(() => {
    // делает запрос на подсказки при вводе адреса
    if (firstRender.current) return;

    const controller = new AbortController();
    const bounceTimeout = setTimeout(() => {
      setIsLoading(true);

      getAddresses(controller)
        .then((result) => {
          setDadataAddresses(result.suggestions.map((item) => item));
        })
        .catch((error) => {
          console.log("component DadataAddress useEffect error - ", error);
          setDadataCatchError(error);
          setDadataAddresses([]);
          setSelectedAddress(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }, DELAY);
    return () => {
      controller.abort();
      clearTimeout(bounceTimeout);
    };
  }, [queryAddress]);

  // цвет фона инпута валидации
  const bgColorInput = () => {
    let cssClass = "";
    if (validError) {
      cssClass = "bg-red-200";
    } else if (selectedAddress) {
      cssClass = "bg-green-200";
    }
    return cssClass;
  };

  // валидация, запускается в юзэффекте при смене инпута, выбранного адреса и ошибки соединения
  const validation = () => {
    // на обязательность
    if (queryAddress.length == 0) {
      validError !== requred && setValidError(requred);
      return;
    }
    // на мин длинну
    if (queryAddress.length < MIN) {
      validError !== minLength && setValidError(minLength);
      return;
    }
    // на ошибку запроса
    if (dadataCatchError !== null) {
      validError !== catchError && setValidError(catchError);
      return;
    }
    // если не выбран адрес из списка
    if (!selectedAddress) {
      validError !== noChoice && setValidError(noChoice);
      return;
    }
    // если адрес без дома и\или квартиры
    if (
      selectedAddress &&
      !FIAS_LEVELS.includes(selectedAddress.data.fias_level)
    ) {
      validError !== notFullAddress && setValidError(notFullAddress);
      return;
    }
    validError !== null && setValidError(null);
  };

  // обработка инпута
  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setQueryAddress(e.target.value);
    // if (validError) {
    //   // при изменении инпута очищает ошибку валидации если она есть
    //   setValidError(null);
    // }
    if (dadataCatchError !== null) {
      // при изменении инпута очищает ошибку запроса если она есть
      setDadataCatchError(null);
    }
    if (selectedAddress) {
      // при изменении инпута очищает выбранный адрес если он есть
      setSelectedAddress(null);
    }
  };

  // обработка выбора адреса из списка
  const handleChoiseAddress = (item: I_dadataAddress) => {
    setSelectedAddress(item);
    setQueryAddress(item.value);
    // setAddress(item);
  };

  // юзэффект валидации
  useEffect(() => {
    // юзэффект валидации
    if (firstRender.current) return;
    validation();
  }, [queryAddress, selectedAddress, dadataCatchError]);

  // методы глобального стора юзера, для записи в него ыбранного адреса и ошибки валидации
  const [
    setUserAddress,
    setUserValidErrorAddress,
    triggerForGetAddressData,
    userAddress,
    userValidErrorAddress,
  ] = useStoreWithEqualityFn(
    useStoreUser,
    (state) => [
      state.setAddress,
      state.setValidErrorAddress,
      // триггер для принудительного ререндера, если с инпутом не взаимодействовали
      state.triggerForGetAddressData,
      state.address,
      state.validErrorAddress,
    ],
    (prev, next) => prev[2] === next[2] && next[3]?.value === queryAddress
  );

  // юзэффект для принудительного ререндера, если с инпутом не взаимодействовали
  useEffect(() => {
    // юзэффект для принудительного ререндера, если с инпутом не взаимодействовали
    // он запустит валидацию, если с инпутом не взаимодействовали
    // а после валидации сработает юзэффект отправки данных в стор
    if (firstRender.current) return;
    validation();
  }, [triggerForGetAddressData]);

  // юзэффект для отправки адреса и ошибки в стор
  useEffect(() => {
    // юзэффект для отправки адреса и ошибки в стор
    // при изменении валидации или выбранного адреса он отправляет их в стор
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setUserAddress(selectedAddress);
    setUserValidErrorAddress(validError);
  }, [selectedAddress, validError]);


  useEffect(() => {
    // много костылей из-за собственного стейта
    // можно потом переделать компонент полностью на стейт зустанда
    // без собственного стейта
    if (userAddress && userAddress?.value !== queryAddress) {
      setQueryAddress(userAddress.value);
      setSelectedAddress(userAddress);
    }
  }, [userAddress]);
  return (
    <div
      className={cn(
        "relative border-t border-b border-transparent",
        isFocused ? "z-30" : "",
        className
      )}
    >
      {/* <p>{'строка дебага - '+ address?.value + " , " + address?.data.fias_level}</p> */}
      {queryAddress.length > 0 && (
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
          queryAddress.length > 0 ? "" : "mt-5",
          validError ?? "mb-6",
          bgColorInput()
        )}
        placeholder={label}
        type="search"
        value={queryAddress}
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
          validation();
        }}
        autoComplete="off"
      />
      {/* </form> */}
      {validError && <p className="pl-3 text-red-400">{validError}</p>}

      {queryAddress.length > 0 && (
        <div
          ref={addressesRef}
          id="addresses"
          className={cn(
            "absolute w-full bg-white rounded-xl top-[100%] shadow-md transition-all duration-300 invisible opacity-0 z-30 min-h-11 max-h-[250px] overflow-hidden flex flex-col",
            isFocused ? "visible opacity-100  top-[100%]" : ""
          )}
        >
          <div className=" max-h-inherit overflow-y-auto scrl_glbl">
            {dadataAddresses.length ? (
              dadataAddresses.map((item, index) => (
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
                      handleChoiseAddress(item);
                      setIsFocused(false);
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
