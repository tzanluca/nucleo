import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui/PageHeader";
import { DeleteButton } from "@/components/ui/DeleteButton";
import { requireWorkspaceBySlug } from "@/lib/workspace-context";
import { deleteContact, updateContact } from "@/server/contacts";
import { ContactForm } from "../../ContactForm";

export default async function EditContactPage({
  params,
}: {
  params: Promise<{ slug: string; contactId: string }>;
}) {
  const { slug, contactId } = await params;
  const workspace = await requireWorkspaceBySlug(slug);
  const [contact, clients] = await Promise.all([
    prisma.contact.findFirst({
      where: { id: contactId, workspaceId: workspace.id },
    }),
    prisma.client.findMany({
      where: { workspaceId: workspace.id },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);
  if (!contact) notFound();

  const update = updateContact.bind(null, contact.id, slug);
  const remove = deleteContact.bind(null, slug);

  return (
    <>
      <PageHeader
        title={`Editar ${contact.name}`}
        actions={<DeleteButton id={contact.id} action={remove} />}
      />
      <ContactForm action={update} clients={clients} contact={contact} />
    </>
  );
}
