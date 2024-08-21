import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../prisma/prisma-client";


export async function GET(params?:any) {
    const users = await prisma.user.findMany()
    
    return NextResponse.json(users)
}

// let userr = {
//     "fullName": "Вася пупкин",
//     "email": "wasia@user.ru",
//     "password": "123123",
//   }
//   type user =  {
//     id?: number;
//     fullName: string;
//     email: string;
//     password: string;
//     createdAt?: string;
//     updatedAt?: string;
// }
export async function POST(req:NextRequest) {
    const body = await req.json();
    
    const user = await prisma.user.create({
      data: {
        fullName: body.fullName,
        email: body.email,
        password: body.password
      },
    })
    return NextResponse.json(user);
}