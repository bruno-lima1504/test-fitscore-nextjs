import { NextRequest, NextResponse } from "next/server";
import { formSchema } from "@/src/lib/zod";
import submission from "@/src/models/submission";
import controller from "@/src/errors/controller";

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();

    // Validar dados de entrada
    const validatedData = formSchema.parse(formData);

    // Salvar submissão no banco
    const result = await submission.saveSubmission({
      name: validatedData.name,
      email: validatedData.email,
      answers: validatedData.answers,
    });

    // Enviar email de resultado para o candidato
    try {
      const emailResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/send-result-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            candidateName: result.submission.candidate!.name,
            candidateEmail: result.submission.candidate!.email,
            scores: {
              perfScore: result.submission.perfScore,
              energyScore: result.submission.energyScore,
              cultureScore: result.submission.cultureScore,
              totalScore: result.submission.totalScore,
            },
            classification: result.submission.classification,
          }),
        }
      );

      if (!emailResponse.ok) {
        console.error("Erro ao enviar email:", await emailResponse.text());
      }
    } catch (emailError) {
      console.error(
        "Erro ao enviar email, mas submissão foi salva:",
        emailError
      );
      // Não falhar a operação se o email falhar
    }

    const responseData = {
      success: true,
      message: result.isNewCandidate
        ? "Formulário enviado com sucesso! Verifique seu email para o resultado."
        : "Nova avaliação registrada com sucesso! Verifique seu email para o resultado.",
      data: {
        submissionId: result.submission.id,
        scores: {
          perfScore: result.submission.perfScore,
          energyScore: result.submission.energyScore,
          cultureScore: result.submission.cultureScore,
          totalScore: result.submission.totalScore,
        },
        classification: result.submission.classification,
      },
    };

    return NextResponse.json(responseData, { status: 200 });
  } catch (error: any) {
    console.error("Erro ao processar formulário:", error);
    return controller.errorHandlers.onError(error);
  }
}

function methodNotAllowed() {
  return new NextResponse("Method Not Allowed", { status: 405 });
}

export const GET = methodNotAllowed;
export const PUT = methodNotAllowed;
export const DELETE = methodNotAllowed;
export const PATCH = methodNotAllowed;
