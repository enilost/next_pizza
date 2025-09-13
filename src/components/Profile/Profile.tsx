"use client";
import { LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { Title } from "../Title/Title";
import { FunctionComponent, useState } from "react";
import { cn } from "@/lib/utils";
import { LOCALSTORAGE_USER_NAME } from "@/constants/constants";
import apiClient from "../../../services/apiClient";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
// import Script from "next/script";

const initialUserData = {
  firstName: "Не авторизован",
  lastName: "Не авторизован",
  email: "Не авторизован",
  phone: "Не авторизован",
  address: "Не авторизован",
};
function fillUserData() {
  if (typeof window == "undefined") return initialUserData;

  const localUserDataString = localStorage?.getItem(LOCALSTORAGE_USER_NAME);
  if (localUserDataString) {
    const localUserData: typeof initialUserData =
      JSON.parse(localUserDataString);
    return localUserData;
  }
  return initialUserData;
}
interface ProfileProps {}
const Profile: FunctionComponent<ProfileProps> = () => {
  const [userData, setUserdata] = useState(fillUserData);
  const [isLoading, setIsLoading] = useState(false);
  const Router = useRouter();
  const { logout } = useAuth();
  const logoutHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      setIsLoading(true);
      await logout();
      Router.push("/");
    } catch (error) {
      console.log("components Profile.tsx logoutHandler", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <section
      className="max-w-md mx-auto bg-white rounded-xl shadow-sm overflow-hidden my-8"
      id="profile_section"
    >
      {/* Заголовок */}
      <div className="px-6 py-4 border border-primary text-primary  bg-primary">
        <Title size="h4" className="text-white text-center">
          Профиль пользователя
        </Title>
      </div>

      {/* Данные профиля */}
      <div className="p-6 space-y-4">
        <div className="flex items-center space-x-4 mb-6">
          <div
            className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-gray-900 text-xl font-semibold"
            id="profile_initials"
            // suppressHydrationWarning={true}
          >
            {/* {" "} */}
            {typeof userData?.firstName === "string"
              ? userData.firstName?.charAt(0)
              : ""}
            {typeof userData?.lastName === "string"
              ? userData.lastName?.charAt(0)
              : ""}
          </div>
          <div>
            <h3
              className="text-lg font-medium text-gray-900"
              id="profile_fullname"
              //   suppressHydrationWarning={true}
            >
              {userData.firstName + " " + userData.lastName}
            </h3>
            <p className="text-sm text-gray-500">Личные данные</p>
          </div>
        </div>

        {/* Информация пользователя */}
        <div className="space-y-3">
          <ProfileItem
            label="Email"
            value={userData.email}
            id="profile_email"
          />
          <ProfileItem
            label="Телефон"
            value={userData.phone}
            id="profile_phone"
          />
          <ProfileItem
            label="Адрес"
            value={userData.address}
            id="profile_address"
          />
        </div>

        {/* Кнопка выхода */}
        <Button
          onClick={logoutHandler}
          disabled={isLoading}
          loading={isLoading}
          className={cn(" flex items-center gap-1 w-full h-12 text-base")}
        >
          <LogOut size={18} />
          <span>{isLoading ? "Выход..." : "Выйти из аккаунта"}</span>
        </Button>
      </div>
      {/* <Script></Script> */}
    </section>
  );
};

export default Profile;

function ProfileItem({
  label,
  value,
  id,
}: {
  label: string;
  value: string;
  id?: string;
}) {
  return (
    <div className="border-b border-gray-100 pb-2">
      <p className="text-lg text-gray-500">{label}</p>
      <p
        className="text-base font-medium text-gray-800"
        id={id}
        // suppressHydrationWarning={true}
      >
        {value}
      </p>
    </div>
  );
}

// function fillProfile() {
//   console.log("fillProfile");

//   if (typeof window == "undefined" || typeof localStorage == "undefined")
//     return;
//   const userDataString = localStorage.getItem(LOCALSTORAGE_USER_NAME);
//   if (!userDataString) return;
//   const userData = { ...JSON.parse(userDataString) };

//   // "Заполнение инициалов"
//   const initialsElement = document.getElementById("profile_initials");
//   if (initialsElement && userData.firstName && userData.lastName) {
//     console.log("Заполнение инициалов");
//     initialsElement.textContent =
//       (userData.firstName ? userData.firstName.charAt(0) : "") +
//       (userData.lastName ? userData.lastName.charAt(0) : "");
//   }

//   // Заполняем полное имя
//   const fullnameElement = document.getElementById("profile_fullname");
//   if (fullnameElement) {
//     console.log("Заполнение полного имени");
//     const fullName = [userData.firstName, userData.lastName]
//       .filter(Boolean)
//       .join(" ");
//     fullnameElement.textContent = fullName || "Не авторизован";
//   }

//   // Заполняем email
//   const emailElement = document.getElementById("profile_email");
//   if (emailElement) {
//     console.log("Заполнение email");
//     emailElement.textContent = userData.email || "Не авторизован";
//   }

//   // Заполняем телефон
//   const phoneElement = document.getElementById("profile_phone");
//   if (phoneElement) {
//     console.log("Заполнение телефона");
//     phoneElement.textContent = userData.phone || "Не авторизован";
//   }

//   // Заполняем адрес
//   const addressElement = document.getElementById("profile_address");
//   if (addressElement) {
//     console.log("Заполнение адреса");
//     addressElement.textContent = userData.address
//       ? userData.address.value
//       : "Не авторизован";
//   }
// }
