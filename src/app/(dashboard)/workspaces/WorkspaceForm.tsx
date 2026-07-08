"use client";

import { useActionState } from "react";
import type { Workspace } from "@prisma/client";
import { idleState, type FormState } from "@/server/form-state";
import { Field } from "@/components/ui/Field";
import { FormError } from "@/components/ui/FormError";
import { SubmitButton } from "@/components/ui/SubmitButton";

type Action = (prev: FormState, formData: FormData) => Promise<FormState>;

/** Formulário de criar/editar workspace. Reaproveitado pelas duas rotas. */
export function WorkspaceForm({
  action,
  workspace,
}: {
  action: Action;
  workspace?: Workspace;
}) {
  const [state, formAction] = useActionState(action, idleState);

  return (
    <form action={formAction} className="card max-w-lg space-y-4">
      <FormError message={state.error} />

      <Field label="Nome" htmlFor="name" error={state.fieldErrors?.name}>
        <input
          id="name"
          name="name"
          className="input"
          defaultValue={workspace?.name}
          required
        />
      </Field>

      <Field
        label="Descrição"
        htmlFor="description"
        error={state.fieldErrors?.description}
      >
        <textarea
          id="description"
          name="description"
          className="input"
          rows={3}
          defaultValue={workspace?.description ?? ""}
        />
      </Field>

      <Field label="Cor" htmlFor="color" error={state.fieldErrors?.color}>
        <input
          id="color"
          name="color"
          type="color"
          className="h-10 w-20 rounded border border-border bg-surface"
          defaultValue={workspace?.color ?? "#6366f1"}
        />
      </Field>

      <SubmitButton>{workspace ? "Salvar" : "Criar workspace"}</SubmitButton>
    </form>
  );
}
