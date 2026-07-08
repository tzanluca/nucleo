"use client";

import { useActionState } from "react";
import type { Contact } from "@prisma/client";
import { idleState, type FormState } from "@/server/form-state";
import { Field } from "@/components/ui/Field";
import { FormError } from "@/components/ui/FormError";
import { SubmitButton } from "@/components/ui/SubmitButton";
import type { ClientOption } from "../projects/ProjectForm";

type Action = (prev: FormState, formData: FormData) => Promise<FormState>;

export function ContactForm({
  action,
  clients,
  contact,
}: {
  action: Action;
  clients: ClientOption[];
  contact?: Contact;
}) {
  const [state, formAction] = useActionState(action, idleState);
  const err = state.fieldErrors;

  return (
    <form action={formAction} className="card max-w-lg space-y-4">
      <FormError message={state.error} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nome" htmlFor="name" error={err?.name}>
          <input
            id="name"
            name="name"
            className="input"
            defaultValue={contact?.name}
            required
          />
        </Field>
        <Field label="Cargo/Função" htmlFor="role" error={err?.role}>
          <input
            id="role"
            name="role"
            className="input"
            defaultValue={contact?.role ?? ""}
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Email" htmlFor="email" error={err?.email}>
          <input
            id="email"
            name="email"
            type="email"
            className="input"
            defaultValue={contact?.email ?? ""}
          />
        </Field>
        <Field label="Telefone" htmlFor="phone" error={err?.phone}>
          <input
            id="phone"
            name="phone"
            className="input"
            defaultValue={contact?.phone ?? ""}
          />
        </Field>
      </div>

      <Field label="Cliente" htmlFor="clientId" error={err?.clientId}>
        <select
          id="clientId"
          name="clientId"
          className="input"
          defaultValue={contact?.clientId ?? ""}
        >
          <option value="">— sem cliente —</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Anotações" htmlFor="notes" error={err?.notes}>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          className="input"
          defaultValue={contact?.notes ?? ""}
        />
      </Field>

      <SubmitButton>{contact ? "Salvar" : "Adicionar contato"}</SubmitButton>
    </form>
  );
}
