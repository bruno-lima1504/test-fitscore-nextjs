"use client";

import useSWR, { mutate } from "swr";
import { api } from "../services/api";
import { DashboardFiltersInput } from "../lib/zod";
import { PaginatedResponse } from "../lib/types";

export interface DashboardSubmission {
  id: string;
  candidateName: string;
  candidateEmail: string;
  totalScore: number;
  classification: string;
  createdAt: Date | string;
}

export interface DashboardStats {
  totalSubmissions: number;
  byClassification: {
    "Fit Altíssimo": number;
    "Fit Aprovado": number;
    "Fit Questionável": number;
    "Fora do Perfil": number;
  };
  recentSubmissions: number;
}

// Fetcher function para SWR
const fetcher = async (url: string) => {
  const response = await api.get(url);
  if (response.data.success) {
    return response.data.data;
  }
  throw new Error(response.data.message || "Erro ao buscar dados");
};

export function useDashboardSubmissions(
  filters: Partial<DashboardFiltersInput> = {}
) {
  const params = new URLSearchParams();

  if (filters.search) params.append("search", filters.search);
  if (filters.classification)
    params.append("classification", filters.classification);
  if (filters.page) params.append("page", filters.page.toString());
  if (filters.pageSize) params.append("pageSize", filters.pageSize.toString());

  const queryString = params.toString();
  const key = `/api/dashboard/submissions${queryString ? `?${queryString}` : ""}`;

  const { data, error, isLoading, mutate } = useSWR<
    PaginatedResponse<DashboardSubmission>
  >(key, fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    revalidateIfStale: true,
    dedupingInterval: 1000, // 1 segundo de cache
    refreshInterval: 0, // Sem refresh automático
  });

  return {
    submissions: data,
    isLoading,
    error,
    mutate, // Para revalidar manualmente
  };
}

export function useDashboardStats() {
  const { data, error, isLoading, mutate } = useSWR<DashboardStats>(
    "/api/dashboard/stats",
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      revalidateIfStale: true,
      dedupingInterval: 1000, // 1 segundo de cache
      refreshInterval: 0, // Sem refresh automático
    }
  );

  return {
    stats: data,
    isLoading,
    error,
    mutate, // Para revalidar manualmente
  };
}

// Função utilitária para revalidar todos os dados do dashboard globalmente
export function revalidateDashboard() {
  mutate((key) => typeof key === "string" && key.startsWith("/api/dashboard/"));
}

export function useDashboard(filters: Partial<DashboardFiltersInput> = {}) {
  const submissionsHook = useDashboardSubmissions(filters);
  const statsHook = useDashboardStats();

  return {
    // Submissões
    submissions: submissionsHook.submissions,
    submissionsLoading: submissionsHook.isLoading,
    submissionsError: submissionsHook.error,
    mutateSubmissions: submissionsHook.mutate,

    // Estatísticas
    stats: statsHook.stats,
    statsLoading: statsHook.isLoading,
    statsError: statsHook.error,
    mutateStats: statsHook.mutate,

    // Função para revalidar tudo
    mutateAll: () => {
      submissionsHook.mutate();
      statsHook.mutate();
    },

    // Loading geral
    isLoading: submissionsHook.isLoading || statsHook.isLoading,
  };
}
