import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../prisma/prisma-client";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("name") || "";
  //   const products = await prisma.product.findMany({
  //     where: {
  //       'name': { contains: query, mode: "insensitive" },
  //     },
  //     // take: 5,
  //   });
  let products = await prisma.product.findMany();
  if (query) {
    products = products.filter((product) => {
      return product.name.toLowerCase().includes(query.toLowerCase());
    });
  }
  return NextResponse.json(products);
}
