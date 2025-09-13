"use server";

import { JWT_TOKEN_NAME } from "@/constants/constants";
import { verifyTokenJWB } from "@/lib/utils";
import { cookies, headers } from "next/headers";
// import { unstable_noStore as noStore } from 'next/cache';
export async function isAuth() {

  const cookieStore = cookies();

  let isAuth = false;
  const token = cookieStore.get(JWT_TOKEN_NAME)?.value;

  if (!token) return isAuth;
  if (!process.env.NEXT_AUTH_SECRET_JWT) return isAuth;
  const decodetToken = verifyTokenJWB(token, process.env.NEXT_AUTH_SECRET_JWT);
  if (decodetToken) isAuth = true;

  return isAuth;
}
