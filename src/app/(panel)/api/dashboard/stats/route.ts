import { NextResponse } from "next/server";
import { getDashboardStats } from "@/src/services/listService";
import controller from "@/src/errors/controller";

const unsupportedMethodHandler = () => controller.errorHandlers.onNoMatch();

export async function GET() {
  try {
    const stats = await getDashboardStats();

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    console.error("Erro ao buscar estatísticas:", error);
    return controller.errorHandlers.onError(error);
  }
}

export const POST = unsupportedMethodHandler;
export const PUT = unsupportedMethodHandler;
export const DELETE = unsupportedMethodHandler;
export const PATCH = unsupportedMethodHandler;
