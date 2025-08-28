import { NextRequest, NextResponse } from "next/server";
import user from "@/src/models/user";
import controller from "@/src/errors/controller";
import { z } from "zod";

const updateEmailSchema = z.object({
  email: z.string().email("Email inválido"),
});

const unsupportedMethodHandler = () => controller.errorHandlers.onNoMatch();

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();

    const { email } = updateEmailSchema.parse(body);

    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    const updatedUser = await user.updateEmail(userId, email);

    return NextResponse.json({
      success: true,
      message: "Email atualizado com sucesso",
      data: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        position: updatedUser.position,
      },
    });
  } catch (error: any) {
    return controller.errorHandlers.onError(error);
  }
}

export const GET = unsupportedMethodHandler;
export const POST = unsupportedMethodHandler;
export const PUT = unsupportedMethodHandler;
export const DELETE = unsupportedMethodHandler;
