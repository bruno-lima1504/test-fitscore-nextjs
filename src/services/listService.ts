import { prisma } from "@/src/lib/prisma";
import { DashboardFiltersInput } from "@/src/lib/zod";
import { Submission, Classification, PaginatedResponse } from "@/src/lib/types";

export interface DashboardSubmission {
  id: string;
  candidateName: string;
  candidateEmail: string;
  totalScore: number;
  classification: Classification;
  createdAt: Date;
}

export async function listSubmissions(
  filters: DashboardFiltersInput
): Promise<PaginatedResponse<DashboardSubmission>> {
  const { classification, search, sortBy, sortOrder, page, pageSize } = filters;

  const where: any = {};

  if (classification) {
    where.classification = classification;
  }

  if (search) {
    where.OR = [
      {
        candidate: {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
      },
      {
        candidate: {
          email: {
            contains: search,
            mode: "insensitive",
          },
        },
      },
    ];
  }

  const orderBy: any = {};

  switch (sortBy) {
    case "date":
      orderBy.createdAt = sortOrder;
      break;
    case "score":
      orderBy.totalScore = sortOrder;
      break;
    case "name":
      orderBy.candidate = { name: sortOrder };
      break;
    default:
      orderBy.createdAt = "desc";
  }

  const [submissions, total] = await Promise.all([
    prisma.fitSubmission.findMany({
      where,
      include: {
        candidate: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.fitSubmission.count({ where }),
  ]);

  const data: DashboardSubmission[] = submissions.map((submission) => ({
    id: submission.id,
    candidateName: submission.candidate.name,
    candidateEmail: submission.candidate.email,
    totalScore: submission.totalScore,
    classification: submission.classification as Classification,
    createdAt: submission.createdAt,
  }));

  return {
    data,
    total,
    page,
    pageSize,
  };
}

export async function getHighScoreSubmissions(
  sinceHours: number,
  minScore: number = 240 // >= 80% (Fit Altíssimo)
): Promise<DashboardSubmission[]> {
  const since = new Date();
  since.setHours(since.getHours() - sinceHours);

  const submissions = await prisma.fitSubmission.findMany({
    where: {
      totalScore: {
        gte: minScore,
      },
      createdAt: {
        gte: since,
      },
    },
    include: {
      candidate: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      totalScore: "desc",
    },
  });

  return submissions.map((submission) => ({
    id: submission.id,
    candidateName: submission.candidate.name,
    candidateEmail: submission.candidate.email,
    totalScore: submission.totalScore,
    classification: submission.classification as Classification,
    createdAt: submission.createdAt,
  }));
}

export async function getDashboardStats() {
  const [
    totalSubmissions,
    fitAltissimoCount,
    fitAprovadoCount,
    fitQuestionavelCount,
    foraDoPerfil,
    recentSubmissions,
  ] = await Promise.all([
    prisma.fitSubmission.count(),
    prisma.fitSubmission.count({ where: { classification: "Fit Altíssimo" } }),
    prisma.fitSubmission.count({ where: { classification: "Fit Aprovado" } }),
    prisma.fitSubmission.count({
      where: { classification: "Fit Questionável" },
    }),
    prisma.fitSubmission.count({ where: { classification: "Fora do Perfil" } }),
    prisma.fitSubmission.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
    }),
  ]);

  return {
    totalSubmissions,
    byClassification: {
      "Fit Altíssimo": fitAltissimoCount,
      "Fit Aprovado": fitAprovadoCount,
      "Fit Questionável": fitQuestionavelCount,
      "Fora do Perfil": foraDoPerfil,
    },
    recentSubmissions,
  };
}
