import { z } from "zod";

/** Construtores de campos reutilizáveis para os schemas de formulário. */

const blankToUndefined = (value: unknown): unknown =>
  typeof value === "string" && value.trim() === "" ? undefined : value;

export const requiredText = (label: string): z.ZodString =>
  z.string().trim().min(1, `${label} é obrigatório.`).max(500);

export const longText = z.preprocess(
  blankToUndefined,
  z.string().trim().max(5000).optional(),
);

export const optionalText = z.preprocess(
  blankToUndefined,
  z.string().trim().max(500).optional(),
);

export const optionalEmail = z.preprocess(
  blankToUndefined,
  z.string().trim().email("Email inválido.").optional(),
);

export const optionalDate = z.preprocess(blankToUndefined, z.coerce.date().optional());

export const optionalId = z.preprocess(blankToUndefined, z.string().min(1).optional());

export const requiredId = z.string().min(1, "Identificador ausente.");

export const hexColor = z
  .string()
  .trim()
  .regex(/^#[0-9a-fA-F]{6}$/, "Cor deve ser um hex tipo #6366f1.")
  .default("#6366f1");

/** Checkbox de FormData: "on"/"true" => true, ausente => false. */
export const checkbox = z.preprocess(
  (value) => value === "on" || value === "true" || value === true,
  z.boolean(),
);
