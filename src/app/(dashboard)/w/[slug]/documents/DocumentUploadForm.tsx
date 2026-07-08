"use client";

import { useActionState } from "react";
import { idleState, type FormState } from "@/server/form-state";
import { Field } from "@/components/ui/Field";
import { FormError } from "@/components/ui/FormError";
import { SubmitButton } from "@/components/ui/SubmitButton";
import type { ProjectOption } from "../agenda/EventForm";

type Action = (prev: FormState, formData: FormData) => Promise<FormState>;

export function DocumentUploadForm({
  action,
  projects,
}: {
  action: Action;
  projects: ProjectOption[];
}) {
  const [state, formAction] = useActionState(action, idleState);
  const err = state.fieldErrors;

  return (
    <form action={formAction} className="card max-w-lg space-y-4">
      <FormError message={state.error} />

      <Field label="Arquivo" htmlFor="file" error={err?.file}>
        <input id="file" name="file" type="file" className="input" required />
      </Field>

      <Field label="Projeto" htmlFor="projectId" error={err?.projectId}>
        <select id="projectId" name="projectId" className="input" defaultValue="">
          <option value="">— sem projeto —</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Descrição" htmlFor="description" error={err?.description}>
        <input id="description" name="description" className="input" />
      </Field>

      <SubmitButton pendingLabel="Enviando…">Enviar documento</SubmitButton>
    </form>
  );
}
