import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui/PageHeader";
import { requireWorkspaceBySlug } from "@/lib/workspace-context";
import { createEvent } from "@/server/events";
import { EventForm } from "../EventForm";

export default async function NewEventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const workspace = await requireWorkspaceBySlug(slug);
  const projects = await prisma.project.findMany({
    where: { workspaceId: workspace.id },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
  const action = createEvent.bind(null, workspace.id, slug);

  return (
    <>
      <PageHeader title="Novo compromisso" />
      <EventForm action={action} projects={projects} />
    </>
  );
}
