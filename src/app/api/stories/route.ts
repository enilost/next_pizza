import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../prisma/prisma-client";
// import prisma from "../../../../prisma/prisma-client";

export async function GET(req: NextRequest) {
  const stories = await prisma.story.findMany({
    include: {
      items: {
        orderBy: {
          createdAt: "desc", //если asc элементы истории: СТАРЫЕ ПЕРВЫМИ
        },
      },
    },
    orderBy: {
      createdAt: "desc", //если desc сами истории: НОВЫЕ ПЕРВЫМИ
    },
  });
  return NextResponse.json(stories);
}
