import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { sign, SignOptions, verify } from "jsonwebtoken";

import { jwtVerify, JWTPayload } from "jose";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TokenPayload {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  // address: Prisma.JsonValue;
}
export type JwtType = TokenPayload & JWTPayload;
export function createJwtToken(
  payload: TokenPayload,
  secret: string,
  options: SignOptions = { expiresIn: "7d" }
) {
  try {
    return sign(payload, secret, options);
  } catch (error) {
    console.error("Ошибка при создании JWT токена:", error);
    throw new Error("Не удалось создать токен авторизации");
  }
}
// Верификация токена с помощью jose (для использования в middleware)
// а то там ошибка при использовании либы jsonwebtoken
export async function verificationJwtToken(token: string, secret: string) {
  try {
    const secretKey = new TextEncoder().encode(secret);
    const decode = await jwtVerify(token, secretKey);
    return decode.payload as JwtType;
  } catch (error) {
    console.error("verificationJwtToken error:", error);
    return null;
  }
}
// функция верификации токена от jsonwebtoken
export function verifyTokenJWB(token: string, secret: string) {
  try {
    const decoded = verify(token, secret);
    return decoded as JwtType;
  } catch (error) {
    // console.error("verifyTokenJVB error:", error);
    return null;
  }
}
