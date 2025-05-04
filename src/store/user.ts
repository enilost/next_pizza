import { I_dadataAddress } from "@/components/DadataAddress/DadataAddress";
import { z } from "zod";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import toast from "react-hot-toast";
import { ICart } from "../../services/cart";
// import { createWebStoragePersist } from "zustand/middleware/web-storage-persist";
export interface UserObject {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  comment: string;
}
interface UserStore {
  firstName: string;
  setFirstName: (firstName: string) => void;
  validErrorFirstName: string | null;
  setValidErrorFirstName: () => string | null;
  ///////////////////////////////////////////////////////
  lastName: string;
  setLastName: (lastName: string) => void;
  validErrorLastName: string | null;
  setValidErrorLastName: () => string | null;
  ///////////////////////////////////////////////////////
  phone: string;
  setPhone: (phone: string) => void;
  validErrorPhone: string | null;
  setValidErrorPhone: () => string | null;
  ///////////////////////////////////////////////////////
  email: string;
  setEmail: (email: string) => void;
  validErrorEmail: string | null;
  setValidErrorEmail: () => string | null;
  ///////////////////////////////////////////////////////
  address: I_dadataAddress | null;
  setAddress: (address: I_dadataAddress | null) => void;
  validErrorAddress: string | null;
  setValidErrorAddress: (validAddress: string | null) => void;
  // catchErrorAddress: Error | null;
  triggerForGetAddressData: boolean;
  getAddressData: () => void;
  ///////////////////////////////////////////////////////
  comment: string;
  setComment: (comment: string) => void;
  ///////////////////////////////////////////////////////
  validError: () => boolean;
  createUserObject: () => UserObject;
  fetchSendOrder: (cartItems: ICart["items"]) => void;
  ///////////////////////////////////////////////////////
  //   token: string;
  //     id: string;
}

export const useStoreUser = create<UserStore>()(
  devtools((set, get) => {
    return {
      // ///////////////////////////////////////////////////////
      firstName: "",
      setFirstName: (firstName) => {
        set({ firstName });
        get().setValidErrorFirstName();
      },
      validErrorFirstName: null,
      setValidErrorFirstName: () => {
        const validErrorFirstName =
          validation.SchemaFirstLastNames.safeParse(get().firstName).error
            ?.errors[0].message || null;
        set({ validErrorFirstName });
        return validErrorFirstName;
      },
      // ///////////////////////////////////////////////////////
      lastName: "",
      setLastName: (lastName) => {
        set({ lastName });
        get().setValidErrorLastName();
      },
      validErrorLastName: null,
      setValidErrorLastName: () => {
        const validErrorLastName =
          validation.SchemaFirstLastNames.safeParse(get().lastName).error
            ?.errors[0].message || null;
        set({ validErrorLastName });
        return validErrorLastName;
      },
      // ///////////////////////////////////////////////////////
      phone: "",
      setPhone: (phone) => {
        set({ phone });
        get().setValidErrorPhone();
      },
      validErrorPhone: null,
      setValidErrorPhone: () => {
        const validErrorPhone =
          validation.SchemaPhone.safeParse(get().phone).error?.errors[0]
            .message || null;
        set({ validErrorPhone });
        return validErrorPhone;
      },
      // ///////////////////////////////////////////////////////
      email: "",
      setEmail: (email) => {
        set({ email });
        get().setValidErrorEmail();
      },
      validErrorEmail: null,
      setValidErrorEmail: () => {
        const validErrorEmail =
          validation.SchemaEmail.safeParse(get().email).error?.errors[0]
            .message || null;
        set({ validErrorEmail });
        return validErrorEmail;
      },
      // ///////////////////////////////////////////////////////
      address: null,
      setAddress: (address) => {
        set({ address });
      },
      validErrorAddress: null,
      setValidErrorAddress: (validErrorAddress) => set({ validErrorAddress }),
      // catchErrorAddress: null,
      triggerForGetAddressData: false,
      getAddressData: () => {
        set({ triggerForGetAddressData: !get().triggerForGetAddressData });
      },
      // ///////////////////////////////////////////////////////
      comment: "",
      setComment: (comment) => set({ comment }),
      // ///////////////////////////////////////////////////////

      validError: () => {
        const state = get();
        // Обновляем ошибки для каждого поля на случай, если инпут не трогали
        // ведь если с инпутом не взаимодействовали, то ошибки не обновляются
        const notify = () =>
          toast.error(`Заполните правильно все необходимые поля!`);

        let validError = false;

        const f = state.setValidErrorFirstName();
        const l = state.setValidErrorLastName();
        const p = state.setValidErrorPhone();
        const e = state.setValidErrorEmail();
        let a = state.validErrorAddress;
        if (!state.address && !state.validErrorAddress) {
          // если с инпутом даты не взаимодействовали
          // то этот метод тригернет ререндер дадаты и ошибку валидации
          state.getAddressData();
          a = "любая строка)))";
        }

        if (f || l || p || e || a) {
          validError = true;
          notify();
        }
        return validError;
      },
      createUserObject: () => {
        const state = get();
        return {
          firstName: state.firstName,
          lastName: state.lastName,
          phone: state.phone,
          email: state.email,
          address: state.address?.value! || "",
          comment: state.comment,
        };
      },
      fetchSendOrder: (cartItems) => {
        if (get().validError()) {
          // return;
        }
        const userObject = get().createUserObject();
        console.log("userObject", userObject);
        console.log("cartItems", cartItems);
      },
      //   token: "",
      //   id: "",
    };
  })
);

const validation = {
  SchemaFirstLastNames: z.coerce
    .string()
    .nonempty("Поле обязательно для заполнения")
    .min(2, { message: "Минимальное количество символов 2" }),
  SchemaPhone: z.coerce
    .string()
    .nonempty("Поле обязательно для заполнения")
    .min(18, { message: "Недостаточно символов" })
    .refine(
      (val) => {
        return !/[_]/.test(val);
      },
      { message: "Номер телефона введен не полностью" }
    ),
  SchemaEmail: z.coerce
    .string()
    .nonempty("Поле обязательно для заполнения")
    .email("Некорректный email"),
};
