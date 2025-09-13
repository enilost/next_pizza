import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/prisma-client";
import { CART_TOKEN_NAME } from "@/constants/constants";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = +params.id;
  try {
    const request = await req.json();
    const {quantity} = request as { quantity: number };
    const token = req.cookies.get(CART_TOKEN_NAME)?.value;
    if (!token) {
      return NextResponse.json(
        { message: "неудалось обновить корзину, нет токена" },
        { status: 401 }
      );
    }
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: id,
      },
    });

    if (!cartItem) {
      return NextResponse.json(
        { message: "неудалось найти товар для обновления корзины" },
        { status: 404 }
      );
    }
    const userCart = await prisma.cartItem.update({
      where: {
        id: id,
      },
      data: {
        quantity: quantity,
      },
    });

    return NextResponse.json(userCart, { status: 200 });
  } catch (error) {
    console.log('api/cart/[id]',error);
    return NextResponse.json(
      { message: "неудалось обновить корзину" },
      { status: 500 }
    );
  }
}
