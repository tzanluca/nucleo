/** Status possíveis de um projeto. Guardado como texto no banco (portável). */
export const PROJECT_STATUSES = ["active", "on_hold", "completed", "archived"] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  active: "Ativo",
  on_hold: "Em espera",
  completed: "Concluído",
  archived: "Arquivado",
};

export function isProjectStatus(value: string): value is ProjectStatus {
  return (PROJECT_STATUSES as readonly string[]).includes(value);
}
