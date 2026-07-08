"use client";

import { useActionState } from "react";
import type { Credential } from "@prisma/client";
import { idleState, type FormState } from "@/server/form-state";
import { Field } from "@/components/ui/Field";
import { FormError } from "@/components/ui/FormError";
import { SubmitButton } from "@/components/ui/SubmitButton";
import type { ProjectOption } from "../agenda/EventForm";

type Action = (prev: FormState, formData: FormData) => Promise<FormState>;

/**
 * Ao editar, não recarregamos o segredo em claro no formulário: o campo vem
 * vazio e reescreve o segredo apenas se preenchido de novo. Por isso a edição
 * exige redigitar o segredo (o schema o trata como obrigatório).
 */
export function CredentialForm({
  action,
  projects,
  credential,
}: {
  action: Action;
  projects: ProjectOption[];
  credential?: Credential;
}) {
  const [state, formAction] = useActionState(action, idleState);
  const err = state.fieldErrors;
  const editing = Boolean(credential);

  return (
    <form action={formAction} className="card max-w-lg space-y-4">
      <FormError message={state.error} />

      <Field label="Rótulo" htmlFor="label" error={err?.label}>
        <input
          id="label"
          name="label"
          className="input"
          defaultValue={credential?.label}
          required
        />
      </Field>

      <Field label="Usuário/Login" htmlFor="username" error={err?.username}>
        <input
          id="username"
          name="username"
          className="input"
          autoComplete="off"
          defaultValue={credential?.username ?? ""}
        />
      </Field>

      <Field
        label="Segredo"
        htmlFor="secret"
        error={err?.secret}
        hint={
          editing
            ? "Redigite o segredo para salvar (não é exibido por segurança)."
            : undefined
        }
      >
        <input
          id="secret"
          name="secret"
          type="password"
          className="input"
          autoComplete="new-password"
          required
        />
      </Field>

      <Field label="URL" htmlFor="url" error={err?.url}>
        <input
          id="url"
          name="url"
          className="input"
          defaultValue={credential?.url ?? ""}
        />
      </Field>

      <Field label="Projeto" htmlFor="projectId" error={err?.projectId}>
        <select
          id="projectId"
          name="projectId"
          className="input"
          defaultValue={credential?.projectId ?? ""}
        >
          <option value="">— sem projeto —</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
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
          defaultValue={credential?.notes ?? ""}
        />
      </Field>

      <SubmitButton>{editing ? "Salvar" : "Guardar credencial"}</SubmitButton>
    </form>
  );
}
