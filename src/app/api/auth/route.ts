import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../prisma/prisma-client";
import { compareSync, hashSync } from "bcrypt";
import { User } from "@prisma/client";
import { createJwtToken, verifyTokenJWB as verificationJwtToken } from "@/lib/utils";
import { JVT_TOKEN_NAME } from "@/constants/constants";

export type IReturnUser = Omit<
  User,
  | "password"
  | "createdAt"
  | "updatedAt"
  | "provider"
  | "providerId"
  | "verified"
> &{_redirect?:string};
// : Promise<NextResponse<User> | NextResponse<{ message: string }>>
export async function POST(
  req: NextRequest
): Promise<NextResponse<IReturnUser> | NextResponse<{ message: string }>> {
  // console.log('req: NextRequest ', req);
  // const user = await req.json();
  // console.log('req: NextRequest body ', user);
  function redirectToHome(){
    let isRedirect = false;
    const redirectPathArray = ["/auth"];
    const referer = req.headers.get("referer");
    // if(!referer)return isRedirect;
    // const refererUrl = new URL(referer)
    // const path = refererUrl.pathname;
    // if(redirectPathArray.includes(path)){
    //   isRedirect = true;
    // }
    return isRedirect;
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
        await bounce();
        const { email, password } = await req.json();
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
        const {
          password: pass,
          createdAt,
          updatedAt,
          provider,
          providerId,
          verified,
          ...returnUser
        } = user;
        const token = jwtTok(returnUser);
        // if(redirectToHome()){
        //     // @ts-ignore
        //     returnUser._redirect = "/";
        // }

        const response = NextResponse.json(returnUser);
        response.cookies.set({
          name: JVT_TOKEN_NAME,
          value: token,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 60 * 60 * 24 * 7, //7 дней
          path: "/",
        });
        return response;
      }
      case "phone": {
        await bounce();
        const { phone, password } = await req.json();
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
        const {
          password: pass,
          createdAt,
          updatedAt,
          provider,
          providerId,
          verified,
          ...returnUser
        } = user;
        const token = jwtTok(returnUser);
        if(redirectToHome()){
            // @ts-ignore
            returnUser._redirect = "/";
        }
        const response = NextResponse.json(returnUser);
        response.cookies.set({
          name: JVT_TOKEN_NAME,
          value: token,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 60 * 60 * 24 * 7, //7 дней
          path: "/",
        });
        return response;
      }
      case "registration": {
        await bounce();
        const { email, password, phone, fullName, address } = await req.json();
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
            address,
            verified: new Date(),
          },
        });
        const {
          password: pass,
          createdAt,
          updatedAt,
          provider,
          providerId,
          verified,
          ...returnUser
        } = user;
        const token = jwtTok(returnUser);
        if(redirectToHome()){
            // @ts-ignore
            returnUser._redirect = "/";
        }
        const response = NextResponse.json(returnUser);
        response.cookies.set({
          name: JVT_TOKEN_NAME,
          value: token,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 60 * 60 * 24 * 7, //7 дней
          path: "/",
        });
        return response;
      }

      case "logout": {
        const response = NextResponse.json({ message: "Выход выполнен" });

        response.cookies.delete(JVT_TOKEN_NAME);
        return response;
      }

      case "is_check_auth": {
        const token = req.cookies.get(JVT_TOKEN_NAME);
        if (!token) {
          return NextResponse.json(
            { message: "Пользователь не авторизован" },
            { status: 401 }
          );
        }
        if (!process.env.NEXT_AUTH_SECRET_JWT) {
          return NextResponse.json(
            { message: "не удалось получить секретный ключ" },
            { status: 401 }
          );
        }
        const decodetToken = verificationJwtToken(
          token.value,
          process.env.NEXT_AUTH_SECRET_JWT
        );
        if (!decodetToken) {
            const response = NextResponse.json(
                { message: "Недействительный токен удален" },
                { status: 401 }
              );
              response.cookies.delete('NextPizzaJwtToken');
              return response;
        }
        const user = await prisma.user.findUnique({
          where: {
            id: decodetToken.id,
            email: decodetToken.email,
          },
        });
        if (!user) {
          return NextResponse.json(
            { message: "не удалось найти данного пользователя" },
            { status: 401 }
          );
        }
        // const isPassword = compareSync(decodetToken.password, user.password);
        const {
          password: pass,
          createdAt,
          updatedAt,
          provider,
          providerId,
          verified,
          ...returnUser
        } = user;
        const newToken = jwtTok(returnUser);
        const response = NextResponse.json(returnUser);
        response.cookies.set({
          name: JVT_TOKEN_NAME,
          value: newToken,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 60 * 60 * 24 * 7, //7 дней
          path: "/",
        });
        return response;
        // return NextResponse.json(decodetToken);
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
