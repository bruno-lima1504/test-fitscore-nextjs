import prismaClient from "../prisma";
import { NotFoundError } from "../errors/errors";
import { Answer, Classification, Submission } from "@/src/lib/types";
import { computeScores, classify, parseFormAnswers } from "../services/scoring";
import { InputJsonValue } from "@prisma/client/runtime/library";

export interface SaveSubmissionInput {
  name: string;
  email: string;
  answers: Record<string, number>;
}

export interface SaveSubmissionResult {
  submission: Submission;
  isNewCandidate: boolean;
}

async function saveSubmission(
  input: SaveSubmissionInput
): Promise<SaveSubmissionResult> {
  const result = await runSaveQuery(input);
  return result;

  async function runSaveQuery(
    input: SaveSubmissionInput
  ): Promise<SaveSubmissionResult> {
    const { name, email, answers: formAnswers } = input;

    const answers = parseFormAnswers(formAnswers);
    const scores = computeScores(answers);
    const classification = classify(scores.totalScore);

    const existingCandidate = await prismaClient.candidate.findUnique({
      where: { email },
    });

    const isNewCandidate = !existingCandidate;

    const candidate = await prismaClient.candidate.upsert({
      where: { email },
      update: { name },
      create: { name, email },
    });

    const submission = await prismaClient.fitSubmission.create({
      data: {
        candidateId: candidate.id,
        answers: answers as unknown as InputJsonValue,
        perfScore: scores.perfScore,
        energyScore: scores.energyScore,
        cultureScore: scores.cultureScore,
        totalScore: scores.totalScore,
        classification,
      },
      include: {
        candidate: true,
      },
    });

    return {
      submission: {
        id: submission.id,
        candidateId: submission.candidateId,
        candidate: {
          id: candidate.id,
          name: candidate.name,
          email: candidate.email,
          createdAt: candidate.createdAt,
        },
        answers: answers,
        perfScore: submission.perfScore,
        energyScore: submission.energyScore,
        cultureScore: submission.cultureScore,
        totalScore: submission.totalScore,
        classification: submission.classification as Classification,
        createdAt: submission.createdAt,
      },
      isNewCandidate,
    };
  }
}

async function findOneById(id: string): Promise<Submission> {
  const submission = await runSelectQuery(id);
  return submission;

  async function runSelectQuery(id: string): Promise<Submission> {
    const submission = await prismaClient.fitSubmission.findUnique({
      where: { id },
      include: {
        candidate: true,
      },
    });

    if (!submission) {
      throw new NotFoundError({
        message: "A submissão não foi encontrada no sistema.",
        action: "Verifique se o ID está correto.",
      });
    }

    return {
      id: submission.id,
      candidateId: submission.candidateId,
      candidate: {
        id: submission.candidate.id,
        name: submission.candidate.name,
        email: submission.candidate.email,
        createdAt: submission.candidate.createdAt,
      },
      answers: submission.answers as unknown as Answer[],
      perfScore: submission.perfScore,
      energyScore: submission.energyScore,
      cultureScore: submission.cultureScore,
      totalScore: submission.totalScore,
      classification: submission.classification as Classification,
      createdAt: submission.createdAt,
    };
  }
}

async function findByEmail(email: string): Promise<Submission[]> {
  const submissions = await runSelectByEmailQuery(email);
  return submissions;

  async function runSelectByEmailQuery(email: string): Promise<Submission[]> {
    const submissions = await prismaClient.fitSubmission.findMany({
      where: {
        candidate: { email },
      },
      include: {
        candidate: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return submissions.map((submission) => ({
      id: submission.id,
      candidateId: submission.candidateId,
      candidate: {
        id: submission.candidate.id,
        name: submission.candidate.name,
        email: submission.candidate.email,
        createdAt: submission.candidate.createdAt,
      },
      answers: submission.answers as unknown as Answer[],
      perfScore: submission.perfScore,
      energyScore: submission.energyScore,
      cultureScore: submission.cultureScore,
      totalScore: submission.totalScore,
      classification: submission.classification as Classification,
      createdAt: submission.createdAt,
    }));
  }
}

const submission = {
  saveSubmission,
  findOneById,
  findByEmail,
};

export default submission;
