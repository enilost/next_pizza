import { NextResponse } from "next/server";
import prisma from "../../../../prisma/prisma-client";

export async function GET() {
    const productItems = await prisma.productItem.findMany();
    return NextResponse.json(productItems);
}