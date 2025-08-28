import { NextResponse } from "next/server";

import authentication from "../../../../models/authentication";
import user from "../../../../models/user";
import { getCookieServer } from "../../../../lib/cookieServer";
import { UnauthorizedError } from "../../../../errors/errors";

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

export async function GET() {
  try {
    const token = await getCookieServer();

    console.log("token api me", token);

    if (!token) {
      throw new UnauthorizedError({
        message: "Validação de acesso falhou, efetue o login.",
        action: "Realize o login.",
      });
    }

    const validUserId = await authentication.validateToken(token);

    if (!validUserId) {
      throw new UnauthorizedError({
        message: "Validação de acesso falhou, efetue o login.",
        action: "Realize o login.",
      });
    }

    const userInfo = await user.findOneById(validUserId as string);

    const userData = {
      id_user: userInfo.id,
      name: userInfo.name,
      email: userInfo.email,
      position: userInfo.position,
    };

    return NextResponse.json(userData, { status: 200 });
  } catch (error) {
    console.error("Error in /api/me:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

function methodNotAllowed() {
  return new NextResponse("Method Not Allowed", { status: 405 });
}

export const POST = methodNotAllowed;
export const PUT = methodNotAllowed;
export const DELETE = methodNotAllowed;
export const PATCH = methodNotAllowed;
