import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import authentication from "@/src/models/authentication";
import controller from "@/src/errors/controller";

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const authenticatedUser = await authentication.getAuthenticatedUser(
      email,
      password
    );
    const token = await authentication.generateToken(authenticatedUser);
    const payload = { ...authenticatedUser, token };

    const cookieStore = await cookies();
    cookieStore.set("fitscore-session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return NextResponse.json(payload);
  } catch (error: any) {
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
