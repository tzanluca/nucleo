import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/auth/session";

/**
 * Portão de autenticação. Tudo é privado exceto /login e assets estáticos.
 * Roda no edge, então só usa a verificação stateless do JWT (jose).
 */
export async function middleware(request: NextRequest): Promise<NextResponse> {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const secret = process.env.SESSION_SECRET;
  const session = token && secret ? await verifySession(token, secret) : null;

  if (session) return NextResponse.next();

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  // Protege tudo menos assets internos e a própria tela de login.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|login).*)"],
};
