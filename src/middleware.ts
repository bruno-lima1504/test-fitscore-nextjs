import { NextRequest, NextResponse } from "next/server";
import { getCookieServer } from "./lib/cookieServer";
import { UnauthorizedError } from "../src/errors/errors";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
  if (process.env.TESTING_MODE) {
    return NextResponse.next();
  }

  const { pathname } = req.nextUrl;

  const publicRoutes = [
    "/",
    "/login",
    "/form",
    "/thanks",
    "/_next",
    "/favicon.ico",
  ];

  const publicApiRoutes = [
    "/api/me",
    "/api/sessions",
    "/api/submit-form",
    "/api/send-result-email",
    "/api/cron",
  ];

  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  const isPublicApiRoute = publicApiRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  if (isPublicRoute || isPublicApiRoute) {
    return NextResponse.next();
  }

  let token = await getCookieServer();

  if (!token) {
    const authHeader = req.headers.get("Authorization") || "";
    token = authHeader.split(" ")[1] || null;
  }

  if (!token) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { message: "Token não fornecido", status_code: 401 },
        { status: 401 }
      );
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const userId = await validateTokenWithoutPrisma(token);

  if (!userId) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { message: "Token inválido", status_code: 401 },
        { status: 401 }
      );
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const response = NextResponse.next();
  response.headers.set("x-user-id", userId);
  return response;
}

async function validateTokenWithoutPrisma(
  token: string
): Promise<string | false> {
  try {
    const secret = hexToUint8Array(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });

    if (!payload || !payload.sub) {
      return false;
    }

    return payload.sub as string;
  } catch (error) {
    console.error("Erro ao validar token:", error);

    throw new UnauthorizedError({
      message: "É necessário iniciar uma sessão.",
      action: "Efetue o login com suas credenciais.",
    });
  }
}

function hexToUint8Array(hexString: string) {
  const byteArray = new Uint8Array(hexString.length / 2);
  for (let i = 0; i < byteArray.length; i++) {
    byteArray[i] = parseInt(hexString.substr(i * 2, 2), 16);
  }
  return byteArray;
}

export const config = {
  matcher: ["/:path*"],
};
