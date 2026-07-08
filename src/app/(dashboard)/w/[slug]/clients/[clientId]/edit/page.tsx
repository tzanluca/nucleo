import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui/PageHeader";
import { DeleteButton } from "@/components/ui/DeleteButton";
import { requireWorkspaceBySlug } from "@/lib/workspace-context";
import { deleteClient, updateClient } from "@/server/clients";
import { ClientForm } from "../../ClientForm";

export default async function EditClientPage({
  params,
}: {
  params: Promise<{ slug: string; clientId: string }>;
}) {
  const { slug, clientId } = await params;
  const workspace = await requireWorkspaceBySlug(slug);
  const client = await prisma.client.findFirst({
    where: { id: clientId, workspaceId: workspace.id },
  });
  if (!client) notFound();

  const update = updateClient.bind(null, client.id, slug);
  const remove = deleteClient.bind(null, slug);

  return (
    <>
      <PageHeader
        title={`Editar ${client.name}`}
        actions={<DeleteButton id={client.id} action={remove} />}
      />
      <ClientForm action={update} client={client} />
    </>
  );
}
