import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../prisma/prisma-client";
import { compareSync, hashSync } from "bcrypt";
import { User } from "@prisma/client";
import {
  createCookie,
  createJwtToken,
  deleteCookie,
  verifyTokenJWB as verificationJwtToken,
} from "@/lib/utils";
import { CART_TOKEN_NAME, JWT_TOKEN_NAME } from "@/constants/constants";
import { cookies } from "next/headers";
import { authDataType, regDataType } from "@/hooks/useAuth";


export type IReturnUser = Omit<
  User,
  | "password"
  | "createdAt"
  | "updatedAt"
  | "provider"
  | "providerId"
  | "verified"
> & { _redirect?: string };
// : Promise<NextResponse<User> | NextResponse<{ message: string }>>
export async function POST(
  req: NextRequest
): Promise<NextResponse<IReturnUser> | NextResponse<{ message: string }>> {
  function returnUserFunc(user: User): IReturnUser {
    const {
      password: pass,
      createdAt,
      updatedAt,
      provider,
      providerId,
      verified,
      ...returnUser
    } = user;
    return returnUser;
  }
  // console.log('res: NextResponse ', res);
  function jwtTok(user: IReturnUser) {
    if (!process.env.NEXT_AUTH_SECRET_JWT) {
      throw new Error("JWT_SECRET не определен в переменных окружения");
    }
    const data = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      phone: user.phone,
      // address: user.address,
    };
    const token = createJwtToken(data, process.env.NEXT_AUTH_SECRET_JWT, {
      expiresIn: "7d",
    });
    return token;
  }
  async function createUniqueCart(user: User) {
    let cartToken = crypto.randomUUID();
    while (true) {
      const cartWhile = await prisma.cart.findFirst({
        where: {
          token: cartToken,
        },
      });
      if (!cartWhile) {
        break;
      }
      cartToken = crypto.randomUUID();
    }
    const newCart = await prisma.cart.create({
      data: {
        token: cartToken,
        userId: user.id,
      },
    });
    return newCart;
  }
  const bounce = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(true);
      }, 1000);
    });
  };
  try {
    const type = req.nextUrl.searchParams.get("type");
    switch (type) {
      case "email": {
        // await bounce();
        // const reqToken = cookies().get(JWT_TOKEN_NAME)?.value;
        const reqToken = req.cookies.get(JWT_TOKEN_NAME)?.value;
        if (reqToken) {
          return NextResponse.json(
            { message: "Пользователь уже авторизован" },
            { status: 401 }
          );
        }
        const {
          email,
          password,
          cart: reqCart,
        } = (await req.json()) as authDataType["email"];
        const user = await prisma.user.findUnique({
          where: {
            email: email,
          },
        });
        if (!user) {
          return NextResponse.json(
            { message: "Пользователь с такими данными не найден" },
            { status: 401 }
          );
        }
        if (!compareSync(password, user.password)) {
          return NextResponse.json(
            { message: "Неверный пароль" },
            { status: 401 }
          );
        }
        if (!user.verified) {
          return NextResponse.json(
            { message: "Пользователь не верифицирован" },
            { status: 401 }
          );
        }
        // если до логина пользователь уже использовал корзину
        if (reqCart) {
          // значит он создал на бэке корзину без привязки к юзеру
          // и ее надо удалить
          if (!reqCart.userId && reqCart.id) {
            await prisma.$transaction(async (tx) => {
              // Удаляем все элементы корзины , если они есть
              await tx.cartItem.deleteMany({
                where: {
                  cartId: reqCart.id,
                },
              });
              // Удаляем саму корзину
              await tx.cart.delete({
                where: {
                  id: reqCart.id,
                },
              });
            });
          }
        }
        const returnUser = returnUserFunc(user);
        const token = jwtTok(returnUser);

        const response = NextResponse.json(returnUser);
        // кука jwt авторизации
        response.cookies.set(createCookie(JWT_TOKEN_NAME, token));
        const cart = await prisma.cart.findUnique({
          where: {
            userId: user.id,
          },
        });
        // кука корзины обновляется
        if (cart) {
          const cartCookiee = cart.token;
          response.cookies.set(createCookie(CART_TOKEN_NAME, cartCookiee));
        } else {
          // у каждого пользователя должна быть корзина, если ее нет, то это ошибка
          return NextResponse.json(
            { message: "Ошибка, у пользователя отсутствует корзина" },
            { status: 401 }
          );
        }
        return response;
      }
      case "phone": {
        // await bounce();
        const reqToken = req.cookies.get(JWT_TOKEN_NAME)?.value;
        if (reqToken) {
          return NextResponse.json(
            { message: "Пользователь уже авторизован" },
            { status: 401 }
          );
        }
        const {
          phone,
          password,
          cart: reqCart,
        } = (await req.json()) as authDataType["phone"];
        const user = await prisma.user.findUnique({
          where: {
            phone: phone,
          },
        });
        if (!user) {
          return NextResponse.json(
            { message: "Пользователь с такими данными не найден" },
            { status: 401 }
          );
        }
        if (!compareSync(password, user.password)) {
          return NextResponse.json(
            { message: "Неверный пароль" },
            { status: 401 }
          );
        }
        if (!user.verified) {
          return NextResponse.json(
            { message: "Пользователь не верифицирован" },
            { status: 401 }
          );
        }
        // если до логина пользователь уже использовал корзину
        if (reqCart) {
          // значит он создал на бэке корзину без привязки к юзеру
          // и ее надо удалить
          if (!reqCart.userId && reqCart.id) {
            await prisma.$transaction(async (tx) => {
              // Удаляем все элементы корзины , если они есть
              await tx.cartItem.deleteMany({
                where: {
                  cartId: reqCart.id,
                },
              });
              // Удаляем саму корзину
              await tx.cart.delete({
                where: {
                  id: reqCart.id,
                },
              });
            });
          }
        }
        const returnUser = returnUserFunc(user);
        const token = jwtTok(returnUser);

        const response = NextResponse.json(returnUser);
        response.cookies.set(createCookie(JWT_TOKEN_NAME, token));
        const cart = await prisma.cart.findUnique({
          where: {
            userId: user.id,
          },
        });
        // кука корзины обновляется
        if (cart) {
          const cartCookiee = cart.token;
          response.cookies.set(createCookie(CART_TOKEN_NAME, cartCookiee));
        } else {
          // у каждого пользователя должна быть корзина, если ее нет, то это ошибка
          return NextResponse.json(
            { message: "Ошибка, у пользователя отсутствует корзина" },
            { status: 401 }
          );
        }
        return response;
      }
      case "registration": {
        // await bounce();
        const reqToken = req.cookies.get(JWT_TOKEN_NAME)?.value;
        if (reqToken) {
          return NextResponse.json(
            { message: "Пользователь уже авторизован" },
            { status: 401 }
          );
        }
        const { email, password, phone, fullName, address, cart } =
          (await req.json()) as regDataType;
        const userEmail = await prisma.user.findUnique({
          where: {
            email: email,
          },
        });
        if (userEmail) {
          return NextResponse.json(
            { message: "Пользователь с таким email уже зарегистрирован" },
            { status: 401 }
          );
        }
        const userPhone = await prisma.user.findUnique({
          where: {
            phone: phone,
          },
        });
        if (userPhone) {
          return NextResponse.json(
            {
              message:
                "Пользователь с таким номером телефона уже зарегистрирован",
            },
            { status: 401 }
          );
        }
        const user = await prisma.user.create({
          data: {
            email,
            password: hashSync(password, 10),
            phone,
            fullName,
            address: address as any,
            verified: new Date(),
          },
        });
        const returnUser = returnUserFunc(user);
        const token = jwtTok(returnUser);

        // если пользователь до регистрации что то добавил в корзину
        //  и тем самым создал ее без пользователя
        let cartUniqueToken = "";
        if (cart && !cart.userId) {
          // ищем эту корзину и меняем ей userId
          const updatedCart = await prisma.cart.update({
            where: {
              id: cart.id,
            },
            data: {
              userId: user.id,
            },
          });
          
          cartUniqueToken = updatedCart.token;
        } else {
          // создаем корзину под пользователя
          // с уникальным токеном
          // уникальность проверяется в цикле
          cartUniqueToken = (await createUniqueCart(user)).token;
        }

        const response = NextResponse.json(returnUser);
        response.cookies.set(createCookie(CART_TOKEN_NAME, cartUniqueToken));
        response.cookies.set(createCookie(JWT_TOKEN_NAME, token));
        return response;
      }

      case "logout": {
        const response = NextResponse.json({ message: "Выход выполнен" });
        deleteCookie(response, JWT_TOKEN_NAME);
        deleteCookie(response, CART_TOKEN_NAME);
        // response.cookies.delete(JWT_TOKEN_NAME);
        // response.cookies.delete({
        //   name: CART_TOKEN_NAME,
        //   path: "/api",
        // });
        return response;
      }

      case "is_check_auth": {
        const token = cookies().get(JWT_TOKEN_NAME)?.value;
        // const token = req.cookies.get(JWT_TOKEN_NAME)?.value;
        // console.log("is_check_auth", token);
        if (!token) {
          return NextResponse.json(
            { message: "Токен не найден" },
            { status: 401 }
          );
        }
        if (!process.env.NEXT_AUTH_SECRET_JWT) {
          return NextResponse.json(
            { message: "Не удалось получить секретный ключ" },
            { status: 401 }
          );
        }
        const decodetToken = verificationJwtToken(
          token,
          process.env.NEXT_AUTH_SECRET_JWT
        );
        if (!decodetToken) {
          const response = NextResponse.json(
            { message: "Недействительный токен удален" },
            { status: 401 }
          );
          // console.log("попадаю в этот блок и пытаюсь удалить куку");

          // response.cookies.delete(JWT_TOKEN_NAME);
          deleteCookie(response, JWT_TOKEN_NAME);
          return response;
        }

        const user = await prisma.user.findUnique({
          where: {
            id: decodetToken.id,
            email: decodetToken.email,
          },
        });
        if (!user) {
          const response = NextResponse.json(
            { message: "не удалось найти данного пользователя" },
            { status: 401 }
          );
          // response.cookies.delete(JWT_TOKEN_NAME);
          deleteCookie(response, JWT_TOKEN_NAME);
          return response;
        }

        if (!user.verified) {
          const response = NextResponse.json(
            { message: "Пользователь не верифицирован" },
            { status: 401 }
          );
          deleteCookie(response, JWT_TOKEN_NAME);
          return response;
        }

        const returnUser = returnUserFunc(user);
        const newToken = jwtTok(returnUser);
        const response = NextResponse.json(returnUser);
        response.cookies.set(createCookie(JWT_TOKEN_NAME, newToken));
        // const cart = await prisma.cart.findUnique({
        //   where: {
        //     userId: user.id,
        //   },
        // });
        // if (cart) {
        //   const cartCookiee = cart.token;
        //   response.cookies.set(createCookie(CART_TOKEN_NAME, cartCookiee));
        // }
        return response;
      }
      default:
        return NextResponse.json(
          { message: "неверный тип аутентификации" },
          { status: 400 }
        );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "неудалось получить данные аутентификации" },
      { status: 500 }
    );
  }
}

// export async function GET(req: NextRequest, res: NextResponse) {
//   try {
//     const type = req.nextUrl.searchParams.get("type");
//     switch (type) {
//       case "email":
//         return NextResponse.json(await authEmail());
//       case "phone":
//         return NextResponse.json(await authPhone());
//       case "registration":
//         return NextResponse.json(await registration());
//       default:
//         return NextResponse.json(
//           { message: "неверный тип аутентификации" },
//           { status: 400 }
//         );
//     }
//   } catch (error) {
//     return NextResponse.json(
//       { message: "неудалось получить данные аутентификации" },
//       { status: 500 }
//     );
//   }
// }
