import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { requireWorkspaceBySlug } from "@/lib/workspace-context";

export default async function ContactsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const workspace = await requireWorkspaceBySlug(slug);
  const contacts = await prisma.contact.findMany({
    where: { workspaceId: workspace.id },
    orderBy: { name: "asc" },
    include: { client: { select: { name: true } } },
  });
  const base = `/w/${slug}`;

  return (
    <>
      <PageHeader
        title="Contatos"
        subtitle={`${contacts.length} no total`}
        actions={
          <Link href={`${base}/contacts/new`} className="btn-primary">
            Novo contato
          </Link>
        }
      />

      {contacts.length === 0 ? (
        <EmptyState
          title="Nenhum contato"
          description="Guarde as pessoas-chave desta workspace num só lugar."
          action={
            <Link href={`${base}/contacts/new`} className="btn-primary">
              Adicionar contato
            </Link>
          }
        />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {contacts.map((contact) => (
            <li key={contact.id}>
              <Link
                href={`${base}/contacts/${contact.id}/edit`}
                className="card block h-full transition-colors hover:border-accent"
              >
                <p className="font-medium text-white">{contact.name}</p>
                {contact.role ? (
                  <p className="text-sm text-muted">{contact.role}</p>
                ) : null}
                {contact.email ? (
                  <p className="mt-2 truncate text-xs text-muted">{contact.email}</p>
                ) : null}
                {contact.phone ? (
                  <p className="text-xs text-muted">{contact.phone}</p>
                ) : null}
                {contact.client ? (
                  <p className="mt-2 text-xs text-accent">{contact.client.name}</p>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
