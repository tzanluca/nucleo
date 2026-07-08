import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { EventTimeline, type TimelineEvent } from "@/components/agenda/EventTimeline";
import { requireWorkspaceBySlug } from "@/lib/workspace-context";

export default async function WorkspaceAgendaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const workspace = await requireWorkspaceBySlug(slug);
  const events = await prisma.event.findMany({
    where: { workspaceId: workspace.id, startsAt: { gte: startOfToday() } },
    orderBy: { startsAt: "asc" },
    include: { project: { select: { name: true } } },
  });
  const base = `/w/${slug}`;

  const timeline: TimelineEvent[] = events.map((event) => ({
    id: event.id,
    title: event.title,
    startsAt: event.startsAt,
    endsAt: event.endsAt,
    allDay: event.allDay,
    location: event.location,
    projectName: event.project?.name ?? null,
    editHref: `${base}/agenda/${event.id}/edit`,
  }));

  return (
    <>
      <PageHeader
        title="Agenda"
        subtitle="Compromissos futuros desta workspace."
        actions={
          <Link href={`${base}/agenda/new`} className="btn-primary">
            Novo compromisso
          </Link>
        }
      />

      {timeline.length === 0 ? (
        <EmptyState
          title="Agenda vazia"
          description="Anote reuniões, entregas e horários de trabalho."
          action={
            <Link href={`${base}/agenda/new`} className="btn-primary">
              Agendar
            </Link>
          }
        />
      ) : (
        <EventTimeline events={timeline} />
      )}
    </>
  );
}

/** Meia-noite de hoje, para incluir eventos que já começaram hoje. */
function startOfToday(): Date {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
}
