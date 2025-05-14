import axios from "axios";
import { useStoreUser } from "@/store/user";
import * as auth from "./auth"; // Ваш модуль авторизации

export const axiosInst = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Настройки для проверки токена
let lastTokenCheck = 0; // Время последней проверки токена (timestamp)
// const tokenCheckInterval = 5 * 60 * 1000; // 5 минут между проверками (в миллисекундах)
const tokenCheckInterval = 1234; // 5 минут между проверками (в миллисекундах)
let tokenCheckPromise: Promise<any> | null = null; // Хранит текущий промис проверки токена

/**
 * Проверяет JWT токен, вызывая API-метод isCheckAuth
 * Обновляет состояние авторизации в глобальном сторе
 * Возвращает промис, который разрешается данными пользователя или отклоняется с ошибкой
 */

async function checkToken() {
  // Если проверка уже идет, возвращаем существующий промис
  // Это предотвращает множественные параллельные проверки токена
  if (tokenCheckPromise) {
    return tokenCheckPromise;
  }

  console.log("Checking auth token..."); // Для отладки

  // Создаем новый промис для проверки токена
  tokenCheckPromise = auth
    .isCheckAuth()
    .then((user) => {
      console.log("Token check successful, user is authenticated:", user);

      // Обновляем состояние авторизации в сторе
      const store = useStoreUser.getState();
      store.setIsAuth(true);

      // Если нужно, можно обновить и другие данные пользователя
      // Например, имя, email и т.д.

      return user;
    })
    .catch((error) => {
      console.log("оштбка токена", error);

      // Если проверка не удалась, обновляем состояние в сторе
      const store = useStoreUser.getState();
      store.setIsAuth(false);

      throw error;
    })
    .finally(() => {
      // Обновляем время последней проверки и сбрасываем промис
      lastTokenCheck = Date.now();
      tokenCheckPromise = null;
    });

  return tokenCheckPromise;
}

/**
 * Проверяет, нужно ли проверять токен для данного запроса
 * @param url URL запроса
 * @returns true, если токен нужно проверить, false в противном случае
 */
function shouldCheckToken(url: string | undefined): boolean {
  if (!url) return false;

  // Список URL, для которых нужно проверять токен
  const checkedUrls = [
    // "/auth/login",
    "/profile",
    // "/auth",
    // // "/",
    // "/products",
  ];

  // Проверяем, содержит ли URL один из исключенных путей
  return checkedUrls.some((excluded) => url.includes(excluded));
}

/**
 * Настраивает Axios interceptors для проверки токена
 * Вызывается один раз при инициализации приложения
 */
export function setupAxiosInterceptors() {
    console.log('setupAxiosInterceptors');

    
  // Interceptor для запросов (выполняется перед отправкой запроса)
  axiosInst.interceptors.request.use(async (config) => {
    const now = Date.now();
    console.log('config', config);
    // Проверяем, нужно ли проверить токен:
    // 1. Прошло достаточно времени с последней проверки
    // 2. URL в списке исключений
    // 3. Нет специального флага skipTokenCheck
    if (
      now - lastTokenCheck > tokenCheckInterval &&
      shouldCheckToken(config.url) &&
      !(config as any).skipTokenCheck
    ) {
      try {
        // Проверяем токен перед отправкой запроса
        console.log('Проверяем токен перед отправкой запроса ' , config.url);
        
        await checkToken();
      } catch (error) {
        // Если проверка не удалась, продолжаем запрос
        // Он может завершиться ошибкой авторизации, что нормально
        console.error(
          "ошибка, setupAxiosInterceptors",
          error
        );
      }
    }

    return config;
  });
}
// интерцептор не устанавливается, это на всяк случай
// setupAxiosInterceptors()