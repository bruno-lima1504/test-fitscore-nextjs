import { NextRequest, NextResponse } from "next/server";
import controller from "@/src/errors/controller";
import { Resend } from "resend";
import inviteFormEmail from "@/src/components/emailTemplates/inviteFormEmail";

const unsupportedMethodHandler = () => controller.errorHandlers.onNoMatch();

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    // Validar email obrigatório
    if (!email) {
      return NextResponse.json(
        { error: "Email é obrigatório" },
        { status: 400 }
      );
    }

    // Validar formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Formato de email inválido" },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: `LEGAL FitScore <no-reply@${process.env.NEXT_PUBLIC_RESEND_DOMAIN}>`,
      to: email,
      subject: "Convite para Avaliação FitScore - LEGAL",
      react: inviteFormEmail({
        recipientEmail: email,
      }),
    });

    if (error) {
      console.error("Erro ao enviar convite:", error);
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Convite enviado com sucesso",
      data,
    });
  } catch (error: any) {
    console.error("Erro no envio de convite:", error);
    return controller.errorHandlers.onError(error);
  }
}

export const GET = unsupportedMethodHandler;
export const PUT = unsupportedMethodHandler;
export const DELETE = unsupportedMethodHandler;
export const PATCH = unsupportedMethodHandler;
