"use client";

import { useActionState } from "react";
import type { Client } from "@prisma/client";
import { idleState, type FormState } from "@/server/form-state";
import { Field } from "@/components/ui/Field";
import { FormError } from "@/components/ui/FormError";
import { SubmitButton } from "@/components/ui/SubmitButton";

type Action = (prev: FormState, formData: FormData) => Promise<FormState>;

export function ClientForm({ action, client }: { action: Action; client?: Client }) {
  const [state, formAction] = useActionState(action, idleState);
  const err = state.fieldErrors;

  return (
    <form action={formAction} className="card max-w-lg space-y-4">
      <FormError message={state.error} />

      <Field label="Nome" htmlFor="name" error={err?.name}>
        <input
          id="name"
          name="name"
          className="input"
          defaultValue={client?.name}
          required
        />
      </Field>

      <Field label="Empresa" htmlFor="company" error={err?.company}>
        <input
          id="company"
          name="company"
          className="input"
          defaultValue={client?.company ?? ""}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Email" htmlFor="email" error={err?.email}>
          <input
            id="email"
            name="email"
            type="email"
            className="input"
            defaultValue={client?.email ?? ""}
          />
        </Field>
        <Field label="Telefone" htmlFor="phone" error={err?.phone}>
          <input
            id="phone"
            name="phone"
            className="input"
            defaultValue={client?.phone ?? ""}
          />
        </Field>
      </div>

      <Field label="Anotações" htmlFor="notes" error={err?.notes}>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          className="input"
          defaultValue={client?.notes ?? ""}
        />
      </Field>

      <SubmitButton>{client ? "Salvar" : "Adicionar cliente"}</SubmitButton>
    </form>
  );
}
