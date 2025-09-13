import { Story, StoryItem } from "@prisma/client";
import { axiosInst } from "./axios";
import CONSTANTS_API from "./constantsApi";

export type StoryT = Story & {
  items: StoryItem[];
};

export async function getStories() {
  try {
    const data = await axiosInst.get<StoryT[]>("/" + CONSTANTS_API.stories);
    return data.data;
  } catch (error) {
    throw error;
  }
}
