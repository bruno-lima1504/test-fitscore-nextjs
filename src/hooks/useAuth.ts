"use client";

import { useRouter } from "next/navigation";
import { IAuthResponse, IAuthErrorResponse } from "../types/auth.types";
import { deleteCookie } from "cookies-next";
import { deleteCookieClient } from "../lib/cookieClient";

// Transformando useAuth em um hook customizado com o prefixo "use"
export function useAuth() {
  const router = useRouter();

  const login = async (
    email: string,
    password: string
  ): Promise<IAuthResponse | IAuthErrorResponse | undefined> => {
    try {
      const response = await fetch("/api/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          status_code: response.status,
          message: data.message || "Erro ao fazer login",
          name: "AuthError",
          action: "Verifique se o email e a senha estão corretos",
        };
      }

      if (!data.token) {
        return data as unknown as IAuthErrorResponse;
      }

      router.push("/dashboard");
      return data as IAuthResponse;
    } catch (error) {
      console.error("Erro não tratado:", error);
      return {
        status_code: 500,
        message: "Erro interno do servidor",
        name: "InternalServerError",
        action: "Tente novamente mais tarde",
      };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/sessions/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      deleteCookie("fitscore-session");
      deleteCookieClient();
      router.push("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      // Mesmo com erro, limpa os cookies e redireciona
      deleteCookie("fitscore-session");
      deleteCookieClient();
      router.push("/login");
    }
  };

  return { login, logout };
}
