import { configureAuth } from "react-query-auth";
import { Navigate, useLocation } from "react-router-dom";
import { z } from "zod";

import { api } from "./api-client";

import { PATHS } from "@/app/routes/paths";
import { AuthResponse, User } from "@/types/api";

// api call definitions for auth (types, schemas, requests):
// these are not part of features as this is a module shared across features

const getUser = async (): Promise<User | null> => {
  try {
    const response = await api.get("/users/me");
    return response.data;
  } catch (error) {
    console.error("getUser:", error);
    return null;
  }
};

const logout = (): Promise<void> => {
  return api.post("/auth/logout");
};

export const loginInputSchema = z.object({
  username: z.string().min(1, "Username is required."),
  password: z.string().min(8, "Password is required."),
});
export type LoginInput = z.infer<typeof loginInputSchema>;
const loginWithUsernameAndPassword = (
  data: LoginInput,
): Promise<AuthResponse> => {
  return api.post("/auth/login", data);
};

export const registerInputSchema = z.object({
  username: z.string().min(1, "Username is required."),
  password: z.string().min(8, "Password is required."),
});
export type RegisterInput = z.infer<typeof registerInputSchema>;
const registerWithUsernameAndPassword = (
  data: RegisterInput,
): Promise<AuthResponse> => {
  return api.post("/auth/register", data);
};

const authConfig = {
  userFn: getUser,
  loginFn: async (data: LoginInput) => {
    const response = await loginWithUsernameAndPassword(data);
    return response.user;
  },
  registerFn: async (data: RegisterInput) => {
    const response = await registerWithUsernameAndPassword(data);
    return response.user;
  },
  logoutFn: logout,
};

export const { useUser, useLogin, useLogout, useRegister, AuthLoader } =
  configureAuth(authConfig);

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useUser();
  const location = useLocation();

  if (!user.data) {
    return (
      <Navigate
        to={`${PATHS.auth.login}?redirectTo=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  return children;
};
