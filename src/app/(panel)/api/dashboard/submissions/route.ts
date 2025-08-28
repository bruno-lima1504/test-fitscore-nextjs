import { NextRequest, NextResponse } from "next/server";
import { dashboardFiltersSchema } from "@/src/lib/zod";
import { listSubmissions } from "@/src/services/listService";
import controller from "@/src/errors/controller";

const unsupportedMethodHandler = () => controller.errorHandlers.onNoMatch();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const filters = {
      search: searchParams.get("search") || undefined,
      classification: searchParams.get("classification") || undefined,
      page: parseInt(searchParams.get("page") || "1"),
      pageSize: parseInt(searchParams.get("pageSize") || "10"),
    };

    const validatedFilters = dashboardFiltersSchema.parse(filters);

    const result = await listSubmissions(validatedFilters);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("Erro ao buscar submissões:", error);
    return controller.errorHandlers.onError(error);
  }
}

export const POST = unsupportedMethodHandler;
export const PUT = unsupportedMethodHandler;
export const DELETE = unsupportedMethodHandler;
export const PATCH = unsupportedMethodHandler;
