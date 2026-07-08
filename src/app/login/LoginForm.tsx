"use client";

import { useActionState } from "react";
import { login } from "@/server/auth";
import { idleState } from "@/server/form-state";
import { Field } from "@/components/ui/Field";
import { FormError } from "@/components/ui/FormError";
import { SubmitButton } from "@/components/ui/SubmitButton";

export function LoginForm() {
  const [state, action] = useActionState(login, idleState);

  return (
    <form action={action} className="card w-full max-w-sm space-y-4">
      <div className="space-y-1 text-center">
        <h1 className="text-xl font-semibold text-white">Nucleo</h1>
        <p className="text-sm text-muted">Entre para acessar seu hub.</p>
      </div>

      <FormError message={state.error} />

      <Field label="Email" htmlFor="email" error={state.fieldErrors?.email}>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          className="input"
          required
        />
      </Field>

      <Field label="Senha" htmlFor="password" error={state.fieldErrors?.password}>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          className="input"
          required
        />
      </Field>

      <SubmitButton className="btn-primary w-full" pendingLabel="Entrando…">
        Entrar
      </SubmitButton>
    </form>
  );
}
