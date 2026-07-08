/**
 * Converte uma Date para o formato de <input type="datetime-local">,
 * "YYYY-MM-DDTHH:mm", em horário local (o input não aceita timezone).
 */
export function toDateTimeLocal(value: Date | null | undefined): string {
  if (!value) return "";
  const pad = (n: number): string => String(n).padStart(2, "0");
  return (
    `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}` +
    `T${pad(value.getHours())}:${pad(value.getMinutes())}`
  );
}
