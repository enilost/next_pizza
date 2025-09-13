import { create } from "zustand";
interface State {
  activeCategoryId: string;
  setActiveCategoryId: (id: string) => void;
}

export const useStoreCategory = create<State>()((set) => {
  return {
    activeCategoryId: "",
    setActiveCategoryId: (id) => {
      set((state) => {
        return { activeCategoryId: id };
      });
    },
  };
});
