import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui/PageHeader";
import { requireWorkspaceBySlug } from "@/lib/workspace-context";
import { createContact } from "@/server/contacts";
import { ContactForm } from "../ContactForm";

export default async function NewContactPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const workspace = await requireWorkspaceBySlug(slug);
  const clients = await prisma.client.findMany({
    where: { workspaceId: workspace.id },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
  const action = createContact.bind(null, workspace.id, slug);

  return (
    <>
      <PageHeader title="Novo contato" />
      <ContactForm action={action} clients={clients} />
    </>
  );
}
