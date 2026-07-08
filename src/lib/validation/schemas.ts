import { z } from "zod";
import { PROJECT_STATUSES } from "@/lib/constants/project-status";
import {
  checkbox,
  hexColor,
  longText,
  optionalDate,
  optionalEmail,
  optionalId,
  optionalText,
  requiredText,
} from "./fields";

/** Schemas de entrada dos formulários. Cada um valida um FormData já em objeto. */

export const workspaceInput = z.object({
  name: requiredText("Nome"),
  description: longText,
  color: hexColor,
});
export type WorkspaceInput = z.infer<typeof workspaceInput>;

export const clientInput = z.object({
  name: requiredText("Nome"),
  company: optionalText,
  email: optionalEmail,
  phone: optionalText,
  notes: longText,
});
export type ClientInput = z.infer<typeof clientInput>;

export const projectInput = z
  .object({
    name: requiredText("Nome"),
    description: longText,
    status: z.enum(PROJECT_STATUSES).default("active"),
    color: hexColor,
    clientId: optionalId,
    startDate: optionalDate,
    dueDate: optionalDate,
  })
  .refine((v) => !v.startDate || !v.dueDate || v.dueDate >= v.startDate, {
    message: "A data de entrega não pode ser antes do início.",
    path: ["dueDate"],
  });
export type ProjectInput = z.infer<typeof projectInput>;

export const contactInput = z.object({
  name: requiredText("Nome"),
  role: optionalText,
  email: optionalEmail,
  phone: optionalText,
  notes: longText,
  clientId: optionalId,
});
export type ContactInput = z.infer<typeof contactInput>;

export const eventInput = z
  .object({
    title: requiredText("Título"),
    description: longText,
    location: optionalText,
    startsAt: z.coerce.date({ message: "Início inválido." }),
    endsAt: optionalDate,
    allDay: checkbox,
    projectId: optionalId,
  })
  .refine((v) => !v.endsAt || v.endsAt >= v.startsAt, {
    message: "O fim não pode ser antes do início.",
    path: ["endsAt"],
  });
export type EventInput = z.infer<typeof eventInput>;

export const documentMetaInput = z.object({
  description: longText,
  projectId: optionalId,
});
export type DocumentMetaInput = z.infer<typeof documentMetaInput>;

export const credentialInput = z.object({
  label: requiredText("Rótulo"),
  username: optionalText,
  secret: requiredText("Segredo"),
  url: optionalText,
  notes: longText,
  projectId: optionalId,
});
export type CredentialInput = z.infer<typeof credentialInput>;
