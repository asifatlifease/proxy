"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useReducer, createContext } from "react";

export const AuthContext = createContext<any>(null);

interface IAction {
  type: string;
  payload: any;
}

interface IInitialState {
  authToken: string;
  user: {
    uid: string;
    name: string;
    email: string;
    image: string;
  };
}

const initialState: IInitialState = {
  authToken: "",
  user: {
    uid: "",
    name: "",
    email: "",
    image: "",
  },
};

function authReducer(state: any, action: IAction) {
  switch (action.type) {
    case "set-user": {
      return {
        authToken: action.payload.authToken,
        user: action.payload.user,
      };
    }
    case "clear-user": {
      return {
        authToken: "",
        user: {},
      };
    }
    default:
      return state;
  }
}

function AuthProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const [state, dispatch] = useReducer(authReducer, initialState);

  const publicRoutes = ["/login", "/register"];
  const privateRoutes = "/";

  useEffect(() => {
    if (state?.authToken && publicRoutes.includes(pathname)) {
      router.push("/");
    }

    if (!state?.authToken && pathname === privateRoutes) {
      router.push("/login");
    }
  }, [pathname]);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
