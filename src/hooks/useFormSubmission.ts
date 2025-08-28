"use client";

import { useState } from "react";
import { api } from "../services/api";
import { FormInput } from "../lib/zod";
import { mutate } from "swr";
import axios from "axios";

export interface FormSubmissionResult {
  success: boolean;
  message: string;
  data?: {
    submissionId: string;
    scores: {
      perfScore: number; // 0-40 points (4 questions × 10)
      energyScore: number; // 0-30 points (3 questions × 10)
      cultureScore: number; // 0-30 points (3 questions × 10)
      totalScore: number; // 0-100 points total
    };
    classification: string;
  };
}

export interface FormSubmissionError {
  success: false;
  message: string;
}

export function useFormSubmission() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitForm = async (
    formData: FormInput
  ): Promise<FormSubmissionResult | FormSubmissionError> => {
    setIsSubmitting(true);

    try {
      const response = await api.post<FormSubmissionResult>(
        "/api/submit-form",
        formData
      );

      if (response.status === 200 && response.data.success) {
        // Revalidar dados do dashboard após submissão bem-sucedida
        mutate(
          (key) => typeof key === "string" && key.startsWith("/api/dashboard/")
        );

        return response.data;
      } else {
        return {
          success: false,
          message: response.data.message || "Erro ao enviar formulário",
        };
      }
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);

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
      setIsSubmitting(false);
    }
  };

  return {
    submitForm,
    isSubmitting,
  };
}
