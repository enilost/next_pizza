// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { verificationJwtToken } from "@/lib/utils";
import { decode } from "jsonwebtoken";
import { jwtVerify } from "jose";
import { JWT_TOKEN_NAME } from "./constants/constants";

let isRedirectAuth = false;
const cookieName = "middlewareRedirect";
export async function middleware(request: NextRequest) {
  // console.log("middleware");

  // стр логинов
  const authPages = [
    //
    // "/auth",
    "/login",
  ];
  // стр защищенные
  const protectedPages = ["/profile"];

  // Получаем путь, на который совершается переход
  const path = request.nextUrl.pathname;

  // путь ведет на логины?
  const isAuthPage = authPages.some(
    (page) => path === page || path.startsWith(page)
  );

  // путь ведет на защищенные страницы?
  const isProtectedPage = protectedPages.some(
    (page) => path === page || path.startsWith(page)
  );

  // Получаем токен из куки
  const token = request.cookies.get(JWT_TOKEN_NAME)?.value;

  // если путь ведет на логины
  if (isAuthPage) {
    return await authPagesHandler(request, token);
  } else if (isProtectedPage) {
    // если путь ведет на защищенные страницы
    return await protectedPagesHandler(request, token);
  }

  if (path === "/products") {
    // так как этой страницы нет
    return NextResponse.redirect(new URL("/", request.url), 307);
  }

  if (path === "/auth") {
    // так как эта страница только для переадресаций
    // return NextResponse.redirect(new URL("/", request.url), 307);
    if (request.cookies.get(cookieName)?.value === "true") {
      // если кука есть(она устанавливается тут в protectedPagesHandler), то пропускаем на ауз
      const response = NextResponse.next();
      response.cookies.delete(cookieName);
      return response;
    }
    return NextResponse.redirect(new URL("/", request.url), 307);
  }
  // if (path === "/auth" && isRedirectAuth) {
  // блок с флагом isRedirectAuth, а не с кукой
  //   // так как эта страница только для переадресаций
  //   // return NextResponse.redirect(new URL("/", request.url), 307);
  //   const response = NextResponse.next();
  //   isRedirectAuth = false;
  //   return response;
  // } else if (path === "/auth" && !isRedirectAuth) {
  //   return NextResponse.redirect(new URL("/", request.url), 307);
  // }

  // Если путь не ведет на логины и защищенные страницы
  // то пропускаем дальше без проверок
  const response = NextResponse.next();
  return response;
}

// Указываем, к каким маршрутам применять middleware
export const config = {
  matcher: [
    "/auth",
    "/auth/:path*",

    "/login",
    "/login/:path*",

    "/products/:path*",

    "/profile",
    "/profile/:path*",
  ],
};

const authPagesHandler = async (
  request: NextRequest,
  token: string | undefined
) => {
  if (!token) {
    // если токена нет, то пропускаем на стр авторизации
    const response = NextResponse.next();
    return response;
  }
  const decoded = await verificationJwtToken(
    token,
    process.env.NEXT_AUTH_SECRET_JWT!
  );
  if (!decoded) {
    // если токен неверный, то удаляем токен и пропускаем дальше на авторизацию
    const response = NextResponse.next();
    response.cookies.delete(JWT_TOKEN_NAME);
    return response;
  }
  // если токен верный, значит пользователь уже авторизован
  //  и не пускаем его на авторизацию, а редиректим на главную

  const response = NextResponse.redirect(new URL("/", request.url), 307);
  return response;
};

const protectedPagesHandler = async (
  request: NextRequest,
  token: string | undefined
) => {
  // console.log("protectedPagesHandler token", token);

  if (!token) {
    // если нет токена, то редиректим на авторизацию
    const response = NextResponse.redirect(new URL("/auth", request.url), 307);
    response.cookies.set(cookieName, "true", {
      maxAge: 11,
    });
    isRedirectAuth = true;
    return response;
  }
  const decoded = await verificationJwtToken(
    token,
    process.env.NEXT_AUTH_SECRET_JWT!
  );

  if (!decoded) {
    // если токен неверный, то удаляем токен и редиректим на авторизацию
    const response = NextResponse.redirect(new URL("/auth", request.url), 307);
    response.cookies.set(cookieName, "true", {
      maxAge: 11,
    });
    isRedirectAuth = true;
    response.cookies.delete(JWT_TOKEN_NAME);
    return response;
  }
  // если токен верный, то пропускаем на защищенную страницу
  const response = NextResponse.next();
  return response;
};
