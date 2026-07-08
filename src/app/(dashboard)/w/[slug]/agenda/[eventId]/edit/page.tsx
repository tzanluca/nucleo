import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui/PageHeader";
import { DeleteButton } from "@/components/ui/DeleteButton";
import { requireWorkspaceBySlug } from "@/lib/workspace-context";
import { deleteEvent, updateEvent } from "@/server/events";
import { EventForm } from "../../EventForm";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ slug: string; eventId: string }>;
}) {
  const { slug, eventId } = await params;
  const workspace = await requireWorkspaceBySlug(slug);
  const [event, projects] = await Promise.all([
    prisma.event.findFirst({
      where: { id: eventId, workspaceId: workspace.id },
    }),
    prisma.project.findMany({
      where: { workspaceId: workspace.id },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);
  if (!event) notFound();

  const update = updateEvent.bind(null, event.id, slug);
  const remove = deleteEvent.bind(null, slug);

  return (
    <>
      <PageHeader
        title={`Editar ${event.title}`}
        actions={<DeleteButton id={event.id} action={remove} />}
      />
      <EventForm action={update} projects={projects} event={event} />
    </>
  );
}
