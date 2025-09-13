"use client";

import { FunctionComponent, PropsWithChildren, useLayoutEffect } from "react";

import useAuth from "@/hooks/useAuth";
// import { useCookie } from "react-use";

interface CheckAuthProps extends PropsWithChildren {}

const CheckAuth: FunctionComponent<CheckAuthProps> = ({ children }) => {
  const { isCheckAuth } = useAuth();
  useLayoutEffect(() => {
    isCheckAuth();
  }, []);

  return <>{children}</>;
};

export default CheckAuth;

