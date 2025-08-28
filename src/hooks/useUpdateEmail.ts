"use client";

import { useState } from "react";
import { api } from "../services/api";
import { useAuthContext } from "../contexts/authContext";
import { mutate } from "swr";
import axios from "axios";

export interface UpdateEmailResult {
  success: boolean;
  message: string;
  data?: {
    id: string;
    name: string;
    email: string;
    position: string;
  };
}

export interface UpdateEmailError {
  success: false;
  message: string;
}

export function useUpdateEmail() {
  const [isUpdating, setIsUpdating] = useState(false);
  const { user, setUser } = useAuthContext();

  const updateEmail = async (
    newEmail: string
  ): Promise<UpdateEmailResult | UpdateEmailError> => {
    setIsUpdating(true);

    try {
      const response = await api.patch<UpdateEmailResult>("/api/user", {
        email: newEmail,
      });

      if (response.status === 200 && response.data.success) {
        // Atualizar contexto do usuário
        if (response.data.data && user) {
          setUser({
            ...user,
            email: response.data.data.email,
            name: response.data.data.name,
          });
        }

        // Revalidar dados relacionados ao usuário
        mutate((key) => typeof key === "string" && key.includes("/api/me"));

        return response.data;
      } else {
        return {
          success: false,
          message: response.data.message || "Erro ao atualizar email",
        };
      }
    } catch (error) {
      console.error("Erro ao atualizar email:", error);

      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Erro inesperado. Tente novamente.";

        return {
          success: false,
          message: errorMessage,
        };
      }

      return {
        success: false,
        message: "Erro inesperado. Tente novamente.",
      };
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    updateEmail,
    isUpdating,
    currentEmail: user?.email,
  };
}
