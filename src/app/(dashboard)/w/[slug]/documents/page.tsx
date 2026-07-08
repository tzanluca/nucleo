import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { DeleteButton } from "@/components/ui/DeleteButton";
import { requireWorkspaceBySlug } from "@/lib/workspace-context";
import { deleteDocument, uploadDocument } from "@/server/documents";
import { formatBytes } from "@/lib/format/bytes";
import { formatDate } from "@/lib/format/date";
import { DocumentUploadForm } from "./DocumentUploadForm";

export default async function DocumentsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const workspace = await requireWorkspaceBySlug(slug);
  const [documents, projects] = await Promise.all([
    prisma.document.findMany({
      where: { workspaceId: workspace.id },
      orderBy: { createdAt: "desc" },
      include: { project: { select: { name: true } } },
    }),
    prisma.project.findMany({
      where: { workspaceId: workspace.id },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  const upload = uploadDocument.bind(null, workspace.id, slug);
  const remove = deleteDocument.bind(null, slug);

  return (
    <>
      <PageHeader title="Documentos" subtitle={`${documents.length} arquivo(s)`} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <DocumentUploadForm action={upload} projects={projects} />
        </div>

        <div className="lg:col-span-2">
          {documents.length === 0 ? (
            <EmptyState
              title="Nenhum documento"
              description="Envie contratos, briefings e arquivos do projeto."
            />
          ) : (
            <ul className="space-y-2">
              {documents.map((doc) => (
                <li key={doc.id} className="card flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <a
                      href={`/api/documents/${doc.id}`}
                      className="truncate font-medium text-accent hover:underline"
                    >
                      {doc.originalName}
                    </a>
                    <p className="mt-1 text-xs text-muted">
                      {formatBytes(doc.sizeBytes)} · {formatDate(doc.createdAt)}
                      {doc.project ? ` · ${doc.project.name}` : ""}
                    </p>
                  </div>
                  <DeleteButton id={doc.id} action={remove} label="Remover" />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
