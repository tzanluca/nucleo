"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { serverEnv } from "@/lib/env";
import { verifyPassword } from "@/lib/auth/password";
import { endSession, startSession } from "@/lib/auth/session-cookie";
import { fromZodError, formObject, type FormState } from "./form-state";

const loginInput = z.object({
  email: z.string().trim().toLowerCase().email("Email inválido."),
  password: z.string().min(1, "Informe a senha."),
});

/**
 * Login single-user: confere email + hash bcrypt vindos do ambiente.
 * Mensagem de erro genérica de propósito (não revela qual campo falhou).
 */
export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = loginInput.safeParse(formObject(formData));
  if (!parsed.success) return fromZodError(parsed.error);

  const emailOk = parsed.data.email === serverEnv.authEmail();
  const passwordOk = await verifyPassword(
    parsed.data.password,
    serverEnv.authPasswordHash(),
  );
  if (!emailOk || !passwordOk) {
    return { ok: false, error: "Email ou senha incorretos." };
  }

  await startSession(parsed.data.email);
  redirect("/");
}

export async function logout(): Promise<void> {
  await endSession();
  redirect("/login");
}
