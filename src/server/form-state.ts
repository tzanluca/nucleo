import type { ZodError } from "zod";

/** Estado devolvido pelas Server Actions para `useActionState`. */
export interface FormState {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
}

export const idleState: FormState = { ok: false };

/** Converte erros do zod em mensagens por campo, prontas para a UI. */
export function fromZodError(error: ZodError): FormState {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_form";
    fieldErrors[key] ??= issue.message;
  }
  return { ok: false, error: "Confira os campos destacados.", fieldErrors };
}

/** Extrai os campos de texto de um FormData como objeto simples. */
export function formObject(formData: FormData): Record<string, string> {
  const entries: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") entries[key] = value;
  }
  return entries;
}
