import prismaClient from "../prisma";

export interface HighScoreCandidateReport {
  id: string;
  candidateName: string;
  candidateEmail: string;
  totalScore: number;
  classification: string;
  perfScore: number;
  energyScore: number;
  cultureScore: number;
  submissionDate: Date;
}

export interface ReportData {
  totalHighScoreCandidates: number;
  candidates: HighScoreCandidateReport[];
  reportGeneratedAt: Date;
  periodStart: Date;
  periodEnd: Date;
}

async function getHighScoreCandidatesReport(): Promise<ReportData> {
  const reportData = await runReportQuery();
  return reportData;

  async function runReportQuery(): Promise<ReportData> {
    const now = new Date();
    const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000);

    const highScoreSubmissions = await prismaClient.fitSubmission.findMany({
      where: {
        totalScore: {
          gte: 80,
        },
        createdAt: {
          gte: twelveHoursAgo,
        },
      },
      include: {
        candidate: true,
      },
      orderBy: [{ totalScore: "desc" }, { createdAt: "desc" }],
    });

    const candidates: HighScoreCandidateReport[] = highScoreSubmissions.map(
      (submission) => ({
        id: submission.id,
        candidateName: submission.candidate.name,
        candidateEmail: submission.candidate.email,
        totalScore: submission.totalScore,
        classification: submission.classification,
        perfScore: submission.perfScore,
        energyScore: submission.energyScore,
        cultureScore: submission.cultureScore,
        submissionDate: submission.createdAt,
      })
    );

    return {
      totalHighScoreCandidates: candidates.length,
      candidates,
      reportGeneratedAt: now,
      periodStart: twelveHoursAgo,
      periodEnd: now,
    };
  }
}

async function getEvaluatorUsers() {
  const evaluators = await runSelectQuery();
  return evaluators;

  async function runSelectQuery() {
    const users = await prismaClient.user.findMany({
      where: {
        position: "avaliador",
      },
      select: {
        id: true,
        name: true,
        email: true,
        position: true,
      },
    });

    return users;
  }
}

async function getReportStats() {
  const stats = await runStatsQuery();
  return stats;

  async function runStatsQuery() {
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [totalSubmissions, last24hHighScore, last7dHighScore, avgScore] =
      await Promise.all([
        prismaClient.fitSubmission.count(),
        prismaClient.fitSubmission.count({
          where: {
            totalScore: { gte: 80 },
            createdAt: { gte: last24h },
          },
        }),
        prismaClient.fitSubmission.count({
          where: {
            totalScore: { gte: 80 },
            createdAt: { gte: last7d },
          },
        }),
        prismaClient.fitSubmission.aggregate({
          _avg: {
            totalScore: true,
          },
        }),
      ]);

    return {
      totalSubmissions,
      highScoreStats: {
        last24h: last24hHighScore,
        last7d: last7dHighScore,
      },
      averageScore: Math.round(avgScore._avg.totalScore || 0),
      generatedAt: now,
    };
  }
}

const report = {
  getHighScoreCandidatesReport,
  getEvaluatorUsers,
  getReportStats,
};

export default report;
