"use client";

import { useActionState } from "react";
import type { Project } from "@prisma/client";
import { idleState, type FormState } from "@/server/form-state";
import { PROJECT_STATUSES, PROJECT_STATUS_LABELS } from "@/lib/constants/project-status";
import { Field } from "@/components/ui/Field";
import { FormError } from "@/components/ui/FormError";
import { SubmitButton } from "@/components/ui/SubmitButton";

type Action = (prev: FormState, formData: FormData) => Promise<FormState>;

export interface ClientOption {
  id: string;
  name: string;
}

/** Formata uma Date para o valor de <input type="date"> (YYYY-MM-DD). */
function dateValue(value: Date | null | undefined): string {
  if (!value) return "";
  return value.toISOString().slice(0, 10);
}

export function ProjectForm({
  action,
  clients,
  project,
}: {
  action: Action;
  clients: ClientOption[];
  project?: Project;
}) {
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
          defaultValue={project?.name}
          required
        />
      </Field>

      <Field label="Descrição" htmlFor="description" error={err?.description}>
        <textarea
          id="description"
          name="description"
          rows={3}
          className="input"
          defaultValue={project?.description ?? ""}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Status" htmlFor="status" error={err?.status}>
          <select
            id="status"
            name="status"
            className="input"
            defaultValue={project?.status ?? "active"}
          >
            {PROJECT_STATUSES.map((status) => (
              <option key={status} value={status}>
                {PROJECT_STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Cliente" htmlFor="clientId" error={err?.clientId}>
          <select
            id="clientId"
            name="clientId"
            className="input"
            defaultValue={project?.clientId ?? ""}
          >
            <option value="">— sem cliente —</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Início" htmlFor="startDate" error={err?.startDate}>
          <input
            id="startDate"
            name="startDate"
            type="date"
            className="input"
            defaultValue={dateValue(project?.startDate)}
          />
        </Field>
        <Field label="Entrega" htmlFor="dueDate" error={err?.dueDate}>
          <input
            id="dueDate"
            name="dueDate"
            type="date"
            className="input"
            defaultValue={dateValue(project?.dueDate)}
          />
        </Field>
      </div>

      <Field label="Cor" htmlFor="color" error={err?.color}>
        <input
          id="color"
          name="color"
          type="color"
          className="h-10 w-20 rounded border border-border bg-surface"
          defaultValue={project?.color ?? "#6366f1"}
        />
      </Field>

      <SubmitButton>{project ? "Salvar" : "Criar projeto"}</SubmitButton>
    </form>
  );
}
