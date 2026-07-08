import "server-only";
import { redirect } from "next/navigation";
import { readSession } from "./session-cookie";
import type { SessionPayload } from "./session";

/**
 * Garante que há sessão válida ou redireciona para /login.
 * Use no topo de layouts/páginas e no início de cada Server Action mutável.
 */
export async function requireSession(): Promise<SessionPayload> {
  const session = await readSession();
  if (!session) redirect("/login");
  return session;
}
