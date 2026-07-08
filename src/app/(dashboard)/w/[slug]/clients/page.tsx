import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { requireWorkspaceBySlug } from "@/lib/workspace-context";

export default async function ClientsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const workspace = await requireWorkspaceBySlug(slug);
  const clients = await prisma.client.findMany({
    where: { workspaceId: workspace.id },
    orderBy: { name: "asc" },
    include: { _count: { select: { projects: true } } },
  });
  const base = `/w/${slug}`;

  return (
    <>
      <PageHeader
        title="Clientes"
        subtitle={`${clients.length} no total`}
        actions={
          <Link href={`${base}/clients/new`} className="btn-primary">
            Novo cliente
          </Link>
        }
      />

      {clients.length === 0 ? (
        <EmptyState
          title="Nenhum cliente"
          description="Cadastre pessoas ou empresas com quem você trabalha nesta workspace."
          action={
            <Link href={`${base}/clients/new`} className="btn-primary">
              Adicionar cliente
            </Link>
          }
        />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((client) => (
            <li key={client.id}>
              <Link
                href={`${base}/clients/${client.id}/edit`}
                className="card block h-full transition-colors hover:border-accent"
              >
                <p className="font-medium text-white">{client.name}</p>
                {client.company ? (
                  <p className="text-sm text-muted">{client.company}</p>
                ) : null}
                {client.email ? (
                  <p className="mt-2 truncate text-xs text-muted">{client.email}</p>
                ) : null}
                <p className="mt-2 text-xs text-muted">
                  {client._count.projects} projeto(s)
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
