import "server-only";
import { cookies } from "next/headers";
import { serverEnv } from "@/lib/env";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  signSession,
  verifySession,
  type SessionPayload,
} from "./session";

/** Lê e valida a sessão do cookie da requisição atual (server-side). */
export async function readSession(): Promise<SessionPayload | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySession(token, serverEnv.sessionSecret());
}

/** Emite o cookie de sessão httpOnly para o email autenticado. */
export async function startSession(email: string): Promise<void> {
  const token = await signSession({ email }, serverEnv.sessionSecret());
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

/** Remove o cookie de sessão (logout). */
export async function endSession(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
}
