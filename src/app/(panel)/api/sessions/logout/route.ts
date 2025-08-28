import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import controller from "@/src/errors/controller";

const unsupportedMethodHandler = () => controller.errorHandlers.onNoMatch();

export async function POST() {
  const cookieStore = await cookies();

  cookieStore.delete("fitscore-session");

  return NextResponse.json({ message: "Logout realizado com sucesso" });
}

export const GET = unsupportedMethodHandler;
export const PUT = unsupportedMethodHandler;
export const DELETE = unsupportedMethodHandler;
export const PATCH = unsupportedMethodHandler;
