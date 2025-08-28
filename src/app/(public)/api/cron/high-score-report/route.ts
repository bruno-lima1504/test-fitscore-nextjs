import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import report from "@/src/models/report";
import controller from "@/src/errors/controller";
import HighScoreReportEmail from "@/src/components/emailTemplates/highScoreReportEmail";

const resend = new Resend(process.env.RESEND_API_KEY);
const unsupportedMethodHandler = () => controller.errorHandlers.onNoMatch();

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: "Unauthorized - Invalid cron secret" },
        { status: 401 }
      );
    }

    console.log(
      "🕐 Iniciando relatório automático de high score candidates..."
    );

    const reportData = await report.getHighScoreCandidatesReport();

    console.log(
      `📊 Encontrados ${reportData.totalHighScoreCandidates} candidatos com score >= 80`
    );

    const evaluators = await report.getEvaluatorUsers();

    if (evaluators.length === 0) {
      console.log('⚠️ Nenhum usuário com position "avaliador" encontrado');
      return NextResponse.json({
        success: true,
        message: "Nenhum avaliador encontrado para envio do relatório",
        reportData: {
          totalCandidates: reportData.totalHighScoreCandidates,
          evaluatorsCount: 0,
        },
      });
    }

    console.log(
      `👥 Enviando relatório para ${evaluators.length} avaliador(es)`
    );

    const emailResults = await Promise.allSettled(
      evaluators.map(async (evaluator) => {
        try {
          const emailHtml = HighScoreReportEmail({
            evaluatorName: evaluator.name,
            reportData,
          });

          const result = await resend.emails.send({
            from: `FitScore LEGAL <noreply@${process.env.NEXT_PUBLIC_RESEND_DOMAIN}>`,
            to: [evaluator.email],
            subject: `📊 Relatório FitScore - ${reportData.totalHighScoreCandidates} candidatos high score`,
            react: emailHtml,
          });

          console.log(
            `✅ Email enviado para ${evaluator.name} (${evaluator.email})`
          );
          return { evaluator, result, success: true };
        } catch (error) {
          console.error(
            `❌ Erro ao enviar email para ${evaluator.name}:`,
            error
          );
          return { evaluator, error, success: false };
        }
      })
    );

    const successfulEmails = emailResults.filter(
      (result) => result.status === "fulfilled" && result.value.success
    ).length;

    const failedEmails = emailResults.filter(
      (result) => result.status === "rejected" || !result.value.success
    ).length;

    console.log(
      `📧 Relatório enviado: ${successfulEmails} sucessos, ${failedEmails} falhas`
    );

    const logData = {
      timestamp: new Date().toISOString(),
      reportPeriod: {
        start: reportData.periodStart,
        end: reportData.periodEnd,
      },
      candidates: {
        total: reportData.totalHighScoreCandidates,
        highScore90Plus: reportData.candidates.filter((c) => c.totalScore >= 90)
          .length,
        list: reportData.candidates.map((c) => ({
          name: c.candidateName,
          email: c.candidateEmail,
          score: c.totalScore,
          classification: c.classification,
        })),
      },
      emails: {
        evaluatorsFound: evaluators.length,
        successful: successfulEmails,
        failed: failedEmails,
      },
    };

    console.log(
      "📋 Log completo do relatório:",
      JSON.stringify(logData, null, 2)
    );

    return NextResponse.json({
      success: true,
      message: "Relatório processado com sucesso",
      data: logData,
    });
  } catch (error: any) {
    return controller.errorHandlers.onError(error);
  }
}

// Método POST para testes manuais (opcional)
export async function POST(request: NextRequest) {
  try {
    // Verificar se é ambiente de desenvolvimento
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "POST method only available in development" },
        { status: 403 }
      );
    }

    console.log("🧪 Teste manual do relatório de high score candidates");

    // Reutilizar a lógica do GET
    return await GET(request);
  } catch (error: any) {
    return controller.errorHandlers.onError(error);
  }
}

export const PUT = unsupportedMethodHandler;
export const DELETE = unsupportedMethodHandler;
export const PATCH = unsupportedMethodHandler;
