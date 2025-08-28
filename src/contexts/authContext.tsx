"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { useAuth } from "../hooks/useAuth";
import { IAuthResponse, IAuthErrorResponse } from "../types/auth.types";
import { api } from "../services/api";

interface User {
  name: string;
  email: string;
  id_user: string;
  id_position: number;
}

interface AuthContextType {
  user: User | null;
  login: (
    email: string,
    password: string
  ) => Promise<IAuthResponse | IAuthErrorResponse | undefined>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  fetchUser: () => Promise<void>;
  userLoading: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export function AuthProvider({
  children,
}: AuthProviderProps): React.ReactElement {
  const [user, setUser] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const { login: originalLogin, logout: originalLogout } = useAuth();

  const fetchUser = async () => {
    try {
      const response = await api.get("/api/me");
      if (response.status === 200) {
        setUser(response.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUserLoading(false);
    }
  };

  useEffect(() => {
    // Só buscar usuário se não estivermos em uma rota pública
    const pathname = window.location.pathname;
    const publicRoutes = ["/", "/form", "/thanks", "/login"];

    const isPublicRoute = publicRoutes.some(
      (route) => pathname === route || pathname.startsWith(route + "/")
    );

    if (!isPublicRoute) {
      fetchUser();
    } else {
      setUserLoading(false);
    }
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<IAuthResponse | IAuthErrorResponse | undefined> => {
    const result = await originalLogin(email, password);

    if (result && "token" in result) {
      await fetchUser();
    }

    return result;
  };

  const logout = async () => {
    await originalLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        fetchUser,
        setUser,
        userLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext deve ser usado dentro de um AuthProvider");
  }

  return context;
}
