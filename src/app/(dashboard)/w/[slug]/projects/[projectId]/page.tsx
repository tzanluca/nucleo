import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { requireWorkspaceBySlug } from "@/lib/workspace-context";
import { isProjectStatus } from "@/lib/constants/project-status";
import { formatDate, formatDateTime } from "@/lib/format/date";

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border py-2 last:border-0">
      <span className="text-sm text-muted">{label}</span>
      <span className="text-sm text-white">{value}</span>
    </div>
  );
}

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ slug: string; projectId: string }>;
}) {
  const { slug, projectId } = await params;
  const workspace = await requireWorkspaceBySlug(slug);
  const project = await prisma.project.findFirst({
    where: { id: projectId, workspaceId: workspace.id },
    include: {
      client: { select: { name: true } },
      documents: { orderBy: { createdAt: "desc" } },
      credentials: { orderBy: { label: "asc" } },
      events: {
        where: { startsAt: { gte: new Date() } },
        orderBy: { startsAt: "asc" },
        take: 5,
      },
    },
  });
  if (!project) notFound();
  const base = `/w/${slug}`;

  return (
    <>
      <PageHeader
        title={project.name}
        subtitle={project.description ?? undefined}
        actions={
          <Link href={`${base}/projects/${project.id}/edit`} className="btn-ghost">
            Editar
          </Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card lg:col-span-1">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold uppercase tracking-wide text-muted">
              Detalhes
            </span>
            {isProjectStatus(project.status) ? (
              <StatusBadge status={project.status} />
            ) : null}
          </div>
          {project.client ? (
            <InfoRow label="Cliente" value={project.client.name} />
          ) : null}
          {project.startDate ? (
            <InfoRow label="Início" value={formatDate(project.startDate)} />
          ) : null}
          {project.dueDate ? (
            <InfoRow label="Entrega" value={formatDate(project.dueDate)} />
          ) : null}
          <InfoRow label="Criado" value={formatDate(project.createdAt)} />
        </div>

        <div className="space-y-6 lg:col-span-2">
          <section className="card">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
              Próximos compromissos
            </h2>
            {project.events.length === 0 ? (
              <p className="text-sm text-muted">Nada agendado para este projeto.</p>
            ) : (
              <ul className="space-y-2">
                {project.events.map((event) => (
                  <li key={event.id} className="flex justify-between text-sm">
                    <span className="text-white">{event.title}</span>
                    <span className="text-muted">{formatDateTime(event.startsAt)}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="card">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
              Documentos ({project.documents.length})
            </h2>
            {project.documents.length === 0 ? (
              <p className="text-sm text-muted">
                Nenhum documento vinculado.{" "}
                <Link href={`${base}/documents`} className="text-accent">
                  Enviar
                </Link>
              </p>
            ) : (
              <ul className="space-y-1">
                {project.documents.map((doc) => (
                  <li key={doc.id}>
                    <a
                      href={`/api/documents/${doc.id}`}
                      className="text-sm text-accent hover:underline"
                    >
                      {doc.originalName}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="card">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
              Credenciais ({project.credentials.length})
            </h2>
            {project.credentials.length === 0 ? (
              <p className="text-sm text-muted">
                Nenhuma credencial vinculada.{" "}
                <Link href={`${base}/credentials`} className="text-accent">
                  Adicionar
                </Link>
              </p>
            ) : (
              <ul className="space-y-1">
                {project.credentials.map((cred) => (
                  <li key={cred.id} className="text-sm text-white">
                    {cred.label}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
