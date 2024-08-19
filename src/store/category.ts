import { create } from "zustand";
interface State {
  activeCategoryId: string;
  setActiveCategoryId: (id: string) => void;
}

export const useStoreCategory = create<State>()((set) => {
  return {
    activeCategoryId: "1",
    setActiveCategoryId: (id) => {
      set((state) => {
        return { activeCategoryId: id };
      });
    },
  };
});
