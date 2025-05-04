import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../prisma/prisma-client";
import { ICart } from "../../../../services/cart";

import { CartAndItemsArg } from "@/store/cart";

export async function GET(
  req: NextRequest,
  res: NextResponse
): Promise<NextResponse<ICart> | NextResponse<{ message: string }>> {

  let typeReq = req.nextUrl.searchParams.get("type") as CartAndItemsArg | null;

  // ищет токен в куках
  // если токена нет - создает новый и передает флаг false
  // если токен есть - передает флаг true
  function tokenFunc(): [string, boolean] {
    let token = req.cookies.get("cartNextPizzaToken")?.value;
    if (!token) {
      // .. создать токен 012c77ff-a02a-4de7-8589-25dd0e6f2ffa     48
      token = crypto.randomUUID();
      // поместить его в куки
      req.cookies.set("cartNextPizzaToken", token);
      // сразу забрать из кукисов
      // @ts-ignore
      token = req.cookies.get("cartNextPizzaToken").value;
      return [token, false];
    }
    return [token, true];
  }
  // ищет корзину по токену и возвращает ее вместе с итемами
  const findFirstCart = async (token: string) => {
    const cart = await prisma.cart.findFirst({
      where: {
        // OR: [{ userId: userId }, { token: token }],
        token: token,
      },
      include: {
        items: {
          orderBy: { createdAt: "desc" },
          include: {
            productItem: {
              include: {
                product: true,
              },
            },
            ingredients: true,
          },
        },
      },
    });
    return cart;
  };
  // создает новую корзину с новым токеном
  const createCart = async (token: string) => {
    const cart = await prisma.cart.create({
      data: {
        token: token,
      },
    });
    return { ...cart, items: [] };
  };

  // в цикле ищет корзину по токену
  // если корзина по токену найдена, то создает новый токен
  // до тех пор пока корзины с таким токеном не существует в бд
  // тогда он создает корзину с этим уникальным новым токеном
  // и возвращает корзину и токен
  const whileCart = async (token: string) => {
    let limit = 0;// лимит цикла
    let whileCriterion = true;
    let returnCart: ICart | null = null;
    // let returnIsTotenFinded: boolean //= flagTokenFinded;
    let returnToken: string = token;
    while (whileCriterion && limit < 10) {
      limit += 1;
      returnCart = await findFirstCart(returnToken);
      if (returnCart) {
        req.cookies.delete("cartNextPizzaToken");
        returnToken = tokenFunc()[0];
      } else {
        returnCart = await createCart(returnToken);
        whileCriterion = false;
      }
    }
    return [returnCart, returnToken] as [
      ICart,
      // boolean,
      string
    ];
  };
  try {
    // ищем или создаем токен, нашли -тру, создали - фолс
    let [token, isTotenFinded] = tokenFunc();
    let cart: ICart | null = null;

    switch (typeReq) {
      case "find": // если только искать корзину по токену в куках
        if (!isTotenFinded) {
          // если токен не найден в куках, то вернуть просто пустую корзину
          // без создания ее в бд
          return NextResponse.json({ items: [] } as unknown as ICart);
        }
        // иначе искать по токену
        cart = await findFirstCart(token);
        if (cart) {
          // если найдена, то вернуть корзину и перезаписать кукис
          return NextResponse.json(cart, {
            headers: {
              "Set-Cookie": `cartNextPizzaToken=${token}; Max-Age=360000;`, //Max-Age=2592000
            },
          });
        } else {
          // если не найдена, то вернуть пустую корзину без создания ее в бд
          return NextResponse.json({ items: [] } as unknown as ICart);
        }
        break;
      case "create": // если только создать корзину
      
        // нам не важно найден токен в куках или создан новый
        // тк мы должны создать новую корзину
        // главное, чтоб карзины с таким токеном уже не было в бд

        [cart, token] = await whileCart(token);
        
        // отправляю корзину и устанавливаю созданный токен в куки
        return NextResponse.json(cart, {
          headers: {
            "Set-Cookie": `cartNextPizzaToken=${token}; Max-Age=360000;`, //Max-Age=2592000
          },
        });
        break;
      case "findOrCreate":
      // сначала пытаемся найти корзину по токену в куках, если он найден
      // если корзины нет, то создаем ее с уникальным токеном
      // ИСПОЛЬЗУЕТ ПОВЕДЕНИЕ ПО УМОЛЧАНИЮ
      case null:
      // ИСПОЛЬЗУЕТ ПОВЕДЕНИЕ ПО УМОЛЧАНИЮ
      default:
        // сначала пытаемся найти корзину по токену в куках, если он найден
        // если корзины нет, то создаем ее с этим уникальным токеном
        if (isTotenFinded) {
          // если токен найден в кукахъ
          // ищем корзину по токену
          cart = await findFirstCart(token);
          if (!cart) {
            // если корзина не найдена по токену из куков
            // то создаем новую корзину с этим токеном
            cart = await createCart(token);
          }
        } else {
          // если токена в куках не было, а он сгенерирован
          [cart, token] = await whileCart(token);
        }

        // отправляю корзину и устанавливаю созданный токен в куки
        return NextResponse.json(cart, {
          headers: {
            "Set-Cookie": `cartNextPizzaToken=${token}; Max-Age=360000;`, //Max-Age=2592000
          },
        });
        break;
    }
  } catch (error) {
    return NextResponse.json(
      { message: "CART-GET: неудалось получить корзину" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const bounce = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(1);
      }, 1000);
    });
  };
  await bounce();

  try {
    const request = await req.json();
    const newCartItems: ICart["items"] = request.items;
   
    const token = req.cookies.get("cartNextPizzaToken")?.value;
    // const token = '1abdfefa-5eb9-45e3-9d39-e546ebd30c23'
    if (!token) {
      return NextResponse.json(
        { message: "неудалось обновить корзину, нет токена" },
        { status: 401 }
      );
    }
    const [deleteResult, createResults] = await prisma.$transaction([
      prisma.cartItem.deleteMany({
        where: {
          cart: {
            // OR: [{ userId: userId }, { token: token }],
            token: token,
          },
        },
      }),
      
      ...newCartItems.map((item) =>
        prisma.cartItem.create({
          data: {
            cartId: item.cartId,
            productItemId: item.productItemId,
            quantity: item.quantity,
            ingredients: {
              connect: item.ingredients.map((ing) => ({ id: ing.id })),
            },
          },
        })
      ),
    ]);

    const userCart = await prisma.cart.findFirst({
      where: {
        // token,
        // OR: [{ userId: userId }, { token: token }],
        token: token,
      },
      include: {
        items: {
          orderBy: { createdAt: "desc" },
          include: {
            productItem: {
              include: {
                product: true,
              },
            },
            ingredients: true,
          },
        },
      },
    });
    return NextResponse.json(userCart || { items: [] });
  } catch (error) {
    console.log("POST catch===", error);

    return NextResponse.json(
      { message: "CART-POST: неудалось обновить корзину" },
      { status: 500 }
    );
  } finally {
    // console.log('POST finally');
  }
}




