// Domain Types
export interface Answer {
  questionId: number;
  value: number; // 0-10
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export interface Submission {
  id: string;
  candidateId: string;
  candidate?: Candidate;
  answers: Answer[];
  perfScore: number;
  energyScore: number;
  cultureScore: number;
  totalScore: number;
  classification: Classification;
  createdAt: Date;
}

export interface Scores {
  perfScore: number;
  energyScore: number;
  cultureScore: number;
  totalScore: number;
}

export type Classification =
  | "Fit Altíssimo"
  | "Fit Aprovado"
  | "Fit Questionável"
  | "Fora do Perfil";

// Form Types
export interface FormData {
  name: string;
  email: string;
  answers: Record<string, number>; // questionId -> value
}

// Dashboard Types
export interface DashboardFilters {
  classification?: Classification;
  search?: string;
  sortBy?: "date" | "score" | "name";
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

// Question Configuration
export interface Question {
  id: number;
  text: string;
  category: "performance" | "energy" | "culture";
}

export const QUESTIONS: Question[] = [
  // Performance (4 perguntas)
  {
    id: 1,
    text: "Como você avalia sua experiência profissional?",
    category: "performance",
  },
  {
    id: 2,
    text: "Como você avalia a qualidade das suas entregas?",
    category: "performance",
  },
  {
    id: 3,
    text: "Como você avalia suas habilidades técnicas?",
    category: "performance",
  },
  {
    id: 4,
    text: "Como você avalia sua capacidade de resolução de problemas?",
    category: "performance",
  },

  // Energy (3 perguntas)
  {
    id: 5,
    text: "Como você avalia sua disponibilidade para o trabalho?",
    category: "energy",
  },
  { id: 6, text: "Como você lida com prazos apertados?", category: "energy" },
  { id: 7, text: "Como você trabalha sob pressão?", category: "energy" },

  // Culture (3 perguntas)
  {
    id: 8,
    text: "Como você se alinha aos valores da empresa LEGAL?",
    category: "culture",
  },
  {
    id: 9,
    text: "Como você avalia sua capacidade de colaboração?",
    category: "culture",
  },
  {
    id: 10,
    text: "Como você se dedica ao aprendizado contínuo?",
    category: "culture",
  },
];

// Email Templates
export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export interface CandidateResultEmailData {
  candidateName: string;
  scores: Scores;
  classification: Classification;
}

export interface ReportEmailData {
  periodHours: number;
  totalCandidates: number;
  csvBuffer: Buffer;
}
