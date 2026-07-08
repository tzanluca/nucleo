import Link from "next/link";
import { formatDate, formatWeekday, toDayKey } from "@/lib/format/date";

export interface TimelineEvent {
  id: string;
  title: string;
  startsAt: Date;
  endsAt: Date | null;
  allDay: boolean;
  location: string | null;
  editHref: string;
  projectName?: string | null;
  workspaceName?: string | null;
}

const TIME = new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" });

function eventTime(event: TimelineEvent): string {
  if (event.allDay) return "Dia inteiro";
  const start = TIME.format(event.startsAt);
  return event.endsAt ? `${start}–${TIME.format(event.endsAt)}` : start;
}

/** Agrupa eventos por dia, preservando a ordem cronológica recebida. */
function groupByDay(events: TimelineEvent[]): Map<string, TimelineEvent[]> {
  const groups = new Map<string, TimelineEvent[]>();
  for (const event of events) {
    const key = toDayKey(event.startsAt);
    const bucket = groups.get(key);
    if (bucket) bucket.push(event);
    else groups.set(key, [event]);
  }
  return groups;
}

/** Linha do tempo de compromissos, agrupados por dia. */
export function EventTimeline({ events }: { events: TimelineEvent[] }) {
  const groups = groupByDay(events);

  return (
    <div className="space-y-6">
      {[...groups.entries()].map(([day, dayEvents]) => (
        <section key={day}>
          <h3 className="mb-2 text-sm font-semibold text-white">
            {formatDate(dayEvents[0]!.startsAt)}{" "}
            <span className="font-normal capitalize text-muted">
              · {formatWeekday(dayEvents[0]!.startsAt)}
            </span>
          </h3>
          <ul className="space-y-2">
            {dayEvents.map((event) => (
              <li key={event.id}>
                <Link
                  href={event.editHref}
                  className="card flex items-center justify-between gap-4 transition-colors hover:border-accent"
                >
                  <div>
                    <p className="text-white">{event.title}</p>
                    <p className="mt-1 text-xs text-muted">
                      {[event.workspaceName, event.projectName, event.location]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm text-muted">{eventTime(event)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
