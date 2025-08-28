import { NextRequest, NextResponse } from "next/server";
import controller from "@/src/errors/controller";
import { Resend } from "resend";
import candidateResultEmail from "@/src/components/emailTemplates/candidateResultEmail";

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { candidateName, candidateEmail, scores, classification } = body;

    if (!candidateName || !candidateEmail || !scores || !classification) {
      return NextResponse.json(
        { error: "Dados obrigatórios não fornecidos" },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: `LEGAL FitScore <no-reply@${process.env.NEXT_PUBLIC_RESEND_DOMAIN}>`,
      to: candidateEmail,
      subject: `Resultado da sua Avaliação FitScore - ${classification}`,
      react: candidateResultEmail({
        candidateName,
        scores,
        classification,
      }),
    });

    if (error) {
      console.error("Erro ao enviar email:", error);
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Email enviado com sucesso",
      data,
    });
  } catch (error: any) {
    console.error("Erro no envio de email:", error);
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
