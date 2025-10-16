"use client";
import { login, logout } from "@/reduxstore/authSlice";
import {
  AuthValuesType,
  LoginParams,
  RegisterParams,
  UserDataType,
} from "@/types/types";
import { useRouter } from "next/navigation";
import { createContext, useState, ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ApiStatus } from "@/helper/helper";
import { toast } from "sonner";
import { ApiUrl } from "../api/apiUrls";
import httpRequest from "../api/AxiosInterseptor";

const defaultProvider: AuthValuesType = {
  user: null,
  setUser: () => null,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
  authLoading: false,
  setAuthLoading: () => Boolean,
};

const AuthContext = createContext(defaultProvider);

type Props = {
  children: ReactNode;
};

const AuthProvider = ({ children }: Props) => {
  const myUser = useSelector((state: any) => state?.data?.userdata);
  const [user, setUser] = useState<UserDataType | null>(
    myUser?.isAuthenticated ? myUser?.user : defaultProvider.user
  );
  const [authLoading, setAuthLoading] = useState(defaultProvider.authLoading);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogin = async (params: LoginParams) => {
    setAuthLoading(true);
    try {
      let response = await httpRequest.post(`${ApiUrl.LOGIN_URL}`, {
        email: params.email,
        password: params.password,
      });
      if (response.status === ApiStatus.STATUS_200) {
        let authdata = response.data.data;
        toast.success("Login Successfully");
        setUser(authdata);
        dispatch(login(authdata));
        router.replace("/" as string);
        setAuthLoading(false);
      }
    } catch {
      // router.replace("/" as string);
      setAuthLoading(false);
    }
  };

  const authCheck = async () => {
    try {
      let response = await httpRequest.post(`${ApiUrl.AUTH_LOGOUT}`);
      if (response.status === ApiStatus.STATUS_200) {
        router.replace("/login");
        setUser(null);
        dispatch(logout());
        localStorage.removeItem("persist:root");
        toast.success("Logout Successfully");
      }
    } catch {
      toast.error("Something Went Wrong");
    }
  };

  const handleLogout = () => {
    authCheck();
  };

  const handleRegister = (params: RegisterParams) => {
    console.log(params);
  };

  const values = {
    user,
    setUser,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister,
    authLoading,
    setAuthLoading,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
