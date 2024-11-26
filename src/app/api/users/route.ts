import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../prisma/prisma-client";


export async function GET(params?:any) {
    const users = await prisma.user.findMany()
    
    return NextResponse.json(users)
}


export async function POST(req:NextRequest) {
    const body = await req.json();
    
    const user = await prisma.user.create({
      data: {
        fullName: body.fullName,
        email: body.email,
        password: body.password,
        verified: body.verified
      },
    })

    return NextResponse.json(user);
}