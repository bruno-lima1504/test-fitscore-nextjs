import { z } from "zod";
import { QUESTIONS } from "./types";

// Form validation schemas
export const formSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),

  email: z
    .string()
    .email("Email deve ter um formato válido")
    .max(255, "Email deve ter no máximo 255 caracteres"),

  answers: z
    .record(
      z.string(),
      z
        .number()
        .min(0, "Resposta deve ser entre 0 e 10")
        .max(10, "Resposta deve ser entre 0 e 10")
    )
    .refine(
      (answers) => {
        // Verificar se todas as 10 perguntas foram respondidas
        const questionIds = QUESTIONS.map((q) => q.id.toString());
        return questionIds.every((id) => id in answers);
      },
      {
        message: "Todas as perguntas devem ser respondidas",
      }
    ),
});

export type FormInput = z.infer<typeof formSchema>;

// Dashboard filters schema
export const dashboardFiltersSchema = z.object({
  classification: z
    .enum([
      "Fit Altíssimo",
      "Fit Aprovado",
      "Fit Questionável",
      "Fora do Perfil",
    ])
    .optional(),
  search: z.string().optional(),
  sortBy: z.enum(["date", "score", "name"]).default("date"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(10),
});

export type DashboardFiltersInput = z.infer<typeof dashboardFiltersSchema>;

// Answer validation
export const answerSchema = z.object({
  questionId: z.number().min(1).max(10),
  value: z.number().min(0).max(10),
});

export const answersArraySchema = z.array(answerSchema).length(10);

// Email validation
export const emailSchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1),
  html: z.string().min(1),
  text: z.string().optional(),
});

// Cron report schema
export const cronReportSchema = z.object({
  sinceHours: z.number().min(1).max(168).default(24), // máximo 1 semana
  managerEmail: z.string().email(),
});
