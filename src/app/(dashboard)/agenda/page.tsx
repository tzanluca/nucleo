import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { EventTimeline, type TimelineEvent } from "@/components/agenda/EventTimeline";

/** Agenda unificada: próximos compromissos de todas as workspaces. */
export default async function GlobalAgendaPage() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const events = await prisma.event.findMany({
    where: { startsAt: { gte: now } },
    orderBy: { startsAt: "asc" },
    include: {
      project: { select: { name: true } },
      workspace: { select: { name: true, slug: true } },
    },
  });

  const timeline: TimelineEvent[] = events.map((event) => ({
    id: event.id,
    title: event.title,
    startsAt: event.startsAt,
    endsAt: event.endsAt,
    allDay: event.allDay,
    location: event.location,
    projectName: event.project?.name ?? null,
    workspaceName: event.workspace.name,
    editHref: `/w/${event.workspace.slug}/agenda/${event.id}/edit`,
  }));

  return (
    <>
      <PageHeader
        title="Agenda geral"
        subtitle="Todos os seus compromissos futuros, de todas as workspaces."
      />
      {timeline.length === 0 ? (
        <EmptyState
          title="Nada agendado"
          description="Compromissos criados nas workspaces aparecem aqui."
        />
      ) : (
        <EventTimeline events={timeline} />
      )}
    </>
  );
}
