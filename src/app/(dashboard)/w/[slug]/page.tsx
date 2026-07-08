import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { requireWorkspaceBySlug } from "@/lib/workspace-context";
import { isProjectStatus } from "@/lib/constants/project-status";
import { formatDateTime } from "@/lib/format/date";

/** Um número grande com legenda, ligável a uma seção. */
function StatCard({
  href,
  label,
  value,
}: {
  href: string;
  label: string;
  value: number;
}) {
  return (
    <Link href={href} className="card transition-colors hover:border-accent">
      <p className="text-3xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-sm text-muted">{label}</p>
    </Link>
  );
}

export default async function WorkspaceOverview({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const workspace = await requireWorkspaceBySlug(slug);
  const base = `/w/${slug}`;

  const [counts, recentProjects, upcomingEvents] = await Promise.all([
    prisma.$transaction([
      prisma.project.count({ where: { workspaceId: workspace.id } }),
      prisma.client.count({ where: { workspaceId: workspace.id } }),
      prisma.contact.count({ where: { workspaceId: workspace.id } }),
      prisma.document.count({ where: { workspaceId: workspace.id } }),
      prisma.credential.count({ where: { workspaceId: workspace.id } }),
    ]),
    prisma.project.findMany({
      where: { workspaceId: workspace.id },
      orderBy: { updatedAt: "desc" },
      take: 5,
    }),
    prisma.event.findMany({
      where: { workspaceId: workspace.id, startsAt: { gte: new Date() } },
      orderBy: { startsAt: "asc" },
      take: 5,
    }),
  ]);

  const [projects, clients, contacts, documents, credentials] = counts;

  return (
    <>
      <PageHeader
        title={workspace.name}
        subtitle={workspace.description ?? undefined}
        actions={
          <>
            <Link href={`${base}/edit`} className="btn-ghost">
              Editar
            </Link>
            <Link href={`${base}/projects/new`} className="btn-primary">
              Novo projeto
            </Link>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard href={`${base}/projects`} label="Projetos" value={projects} />
        <StatCard href={`${base}/clients`} label="Clientes" value={clients} />
        <StatCard href={`${base}/contacts`} label="Contatos" value={contacts} />
        <StatCard href={`${base}/documents`} label="Documentos" value={documents} />
        <StatCard href={`${base}/credentials`} label="Credenciais" value={credentials} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
            Projetos recentes
          </h2>
          {recentProjects.length === 0 ? (
            <p className="text-sm text-muted">Nenhum projeto ainda.</p>
          ) : (
            <ul className="space-y-2">
              {recentProjects.map((project) => (
                <li key={project.id}>
                  <Link
                    href={`${base}/projects/${project.id}`}
                    className="card flex items-center justify-between transition-colors hover:border-accent"
                  >
                    <span className="text-white">{project.name}</span>
                    {isProjectStatus(project.status) ? (
                      <StatusBadge status={project.status} />
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
            Próximos compromissos
          </h2>
          {upcomingEvents.length === 0 ? (
            <p className="text-sm text-muted">Nada agendado.</p>
          ) : (
            <ul className="space-y-2">
              {upcomingEvents.map((event) => (
                <li key={event.id} className="card">
                  <p className="text-white">{event.title}</p>
                  <p className="mt-1 text-xs text-muted">
                    {formatDateTime(event.startsAt)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
