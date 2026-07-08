const DATE_TIME = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "medium",
  timeStyle: "short",
});
const DATE_ONLY = new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" });
const WEEKDAY = new Intl.DateTimeFormat("pt-BR", { weekday: "long" });

export function formatDateTime(value: Date): string {
  return DATE_TIME.format(value);
}

export function formatDate(value: Date): string {
  return DATE_ONLY.format(value);
}

export function formatWeekday(value: Date): string {
  return WEEKDAY.format(value);
}

/** Chave YYYY-MM-DD em horário local, útil para agrupar eventos por dia. */
export function toDayKey(value: Date): string {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
