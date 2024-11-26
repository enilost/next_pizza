import { Ingredient } from "@prisma/client";
import { axiosInst } from "./axios";
import CONSTANTS_API from "./constantsApi";

export async function getIngredients() {
    const data = await axiosInst.get<Ingredient[]>("/"+CONSTANTS_API.ingredients);
    
    return data.data;
}