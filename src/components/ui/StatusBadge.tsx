import {
  PROJECT_STATUS_LABELS,
  type ProjectStatus,
} from "@/lib/constants/project-status";

const TONE: Record<ProjectStatus, string> = {
  active: "bg-emerald-950/60 text-emerald-300",
  on_hold: "bg-amber-950/60 text-amber-300",
  completed: "bg-indigo-950/60 text-indigo-300",
  archived: "bg-zinc-800 text-zinc-400",
};

export function StatusBadge({ status }: { status: ProjectStatus }) {
  return <span className={`badge ${TONE[status]}`}>{PROJECT_STATUS_LABELS[status]}</span>;
}
