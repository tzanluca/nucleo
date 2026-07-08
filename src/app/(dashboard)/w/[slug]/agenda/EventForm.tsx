"use client";

import { useActionState } from "react";
import type { Event } from "@prisma/client";
import { idleState, type FormState } from "@/server/form-state";
import { toDateTimeLocal } from "@/lib/format/datetime-local";
import { Field } from "@/components/ui/Field";
import { FormError } from "@/components/ui/FormError";
import { SubmitButton } from "@/components/ui/SubmitButton";

type Action = (prev: FormState, formData: FormData) => Promise<FormState>;

export interface ProjectOption {
  id: string;
  name: string;
}

export function EventForm({
  action,
  projects,
  event,
}: {
  action: Action;
  projects: ProjectOption[];
  event?: Event;
}) {
  const [state, formAction] = useActionState(action, idleState);
  const err = state.fieldErrors;

  return (
    <form action={formAction} className="card max-w-lg space-y-4">
      <FormError message={state.error} />

      <Field label="Título" htmlFor="title" error={err?.title}>
        <input
          id="title"
          name="title"
          className="input"
          defaultValue={event?.title}
          required
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Início" htmlFor="startsAt" error={err?.startsAt}>
          <input
            id="startsAt"
            name="startsAt"
            type="datetime-local"
            className="input"
            defaultValue={toDateTimeLocal(event?.startsAt)}
            required
          />
        </Field>
        <Field label="Fim" htmlFor="endsAt" error={err?.endsAt}>
          <input
            id="endsAt"
            name="endsAt"
            type="datetime-local"
            className="input"
            defaultValue={toDateTimeLocal(event?.endsAt)}
          />
        </Field>
      </div>

      <label className="flex items-center gap-2 text-sm text-muted">
        <input
          type="checkbox"
          name="allDay"
          defaultChecked={event?.allDay ?? false}
          className="h-4 w-4"
        />
        Dia inteiro
      </label>

      <Field label="Local" htmlFor="location" error={err?.location}>
        <input
          id="location"
          name="location"
          className="input"
          defaultValue={event?.location ?? ""}
        />
      </Field>

      <Field label="Projeto" htmlFor="projectId" error={err?.projectId}>
        <select
          id="projectId"
          name="projectId"
          className="input"
          defaultValue={event?.projectId ?? ""}
        >
          <option value="">— sem projeto —</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Descrição" htmlFor="description" error={err?.description}>
        <textarea
          id="description"
          name="description"
          rows={3}
          className="input"
          defaultValue={event?.description ?? ""}
        />
      </Field>

      <SubmitButton>{event ? "Salvar" : "Agendar"}</SubmitButton>
    </form>
  );
}
