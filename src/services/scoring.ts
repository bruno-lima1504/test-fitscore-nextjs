import { Answer, Scores, Classification } from "@/src/lib/types";

/**
 * Calcula os scores baseado nas respostas do formulário
 * Performance: Q1-Q4 (máximo 40 pontos)
 * Energy: Q5-Q7 (máximo 30 pontos)
 * Culture: Q8-Q10 (máximo 30 pontos)
 * Total: soma das 3 categorias (máximo 100 pontos)
 */
export function computeScores(answers: Answer[]): Scores {
  // Organizar respostas por categoria
  const performanceAnswers = answers.filter(
    (a) => a.questionId >= 1 && a.questionId <= 4
  );
  const energyAnswers = answers.filter(
    (a) => a.questionId >= 5 && a.questionId <= 7
  );
  const cultureAnswers = answers.filter(
    (a) => a.questionId >= 8 && a.questionId <= 10
  );

  // Calcular somas das respostas
  const perfSum = performanceAnswers.reduce((sum, a) => sum + a.value, 0);
  const energySum = energyAnswers.reduce((sum, a) => sum + a.value, 0);
  const cultureSum = cultureAnswers.reduce((sum, a) => sum + a.value, 0);

  // Usar soma total por categoria (não média)
  const perfScore = perfSum; // máximo 40 (4 questões × 10)
  const energyScore = energySum; // máximo 30 (3 questões × 10)
  const cultureScore = cultureSum; // máximo 30 (3 questões × 10)
  const totalScore = perfScore + energyScore + cultureScore; // máximo 100

  return {
    perfScore,
    energyScore,
    cultureScore,
    totalScore,
  };
}

/**
 * Classifica o candidato baseado no score total (escala 0-100)
 */
export function classify(totalScore: number): Classification {
  if (totalScore >= 80) return "Fit Altíssimo"; // >= 80 pontos de 100
  if (totalScore >= 60) return "Fit Aprovado"; // 60-79 pontos de 100
  if (totalScore >= 40) return "Fit Questionável"; // 40-59 pontos de 100
  return "Fora do Perfil"; // < 40 pontos de 100
}

/**
 * Converte respostas do formato do formulário para Answer[]
 */
export function parseFormAnswers(
  formAnswers: Record<string, number>
): Answer[] {
  return Object.entries(formAnswers).map(([questionId, value]) => ({
    questionId: parseInt(questionId),
    value,
  }));
}

/**
 * Valida se todas as 10 perguntas foram respondidas
 */
export function validateAnswersComplete(answers: Answer[]): boolean {
  if (answers.length !== 10) return false;

  const questionIds = answers.map((a) => a.questionId).sort((a, b) => a - b);
  const expectedIds = Array.from({ length: 10 }, (_, i) => i + 1);

  return JSON.stringify(questionIds) === JSON.stringify(expectedIds);
}

/**
 * Valida se todos os valores estão no range 0-10
 */
export function validateAnswersRange(answers: Answer[]): boolean {
  return answers.every((a) => a.value >= 0 && a.value <= 10);
}
