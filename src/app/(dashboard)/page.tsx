import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";

export default async function HomePage() {
  const workspaces = await prisma.workspace.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { projects: true, clients: true, contacts: true } },
    },
  });

  return (
    <>
      <PageHeader
        title="Seus hubs"
        subtitle="Cada workspace reúne clientes, projetos, agenda, documentos e credenciais."
        actions={
          <Link href="/workspaces/new" className="btn-primary">
            Nova workspace
          </Link>
        }
      />

      {workspaces.length === 0 ? (
        <EmptyState
          title="Nenhuma workspace ainda"
          description="Crie sua primeira área de trabalho para começar a organizar."
          action={
            <Link href="/workspaces/new" className="btn-primary">
              Criar workspace
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {workspaces.map((workspace) => (
            <Link
              key={workspace.id}
              href={`/w/${workspace.slug}`}
              className="card transition-colors hover:border-accent"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: workspace.color }}
                />
                <h2 className="font-medium text-white">{workspace.name}</h2>
              </div>
              {workspace.description ? (
                <p className="mt-2 line-clamp-2 text-sm text-muted">
                  {workspace.description}
                </p>
              ) : null}
              <div className="mt-4 flex gap-4 text-xs text-muted">
                <span>{workspace._count.projects} projetos</span>
                <span>{workspace._count.clients} clientes</span>
                <span>{workspace._count.contacts} contatos</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
