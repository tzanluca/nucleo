import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { requireWorkspaceBySlug } from "@/lib/workspace-context";
import { CredentialItem, type CredentialView } from "./CredentialItem";

export default async function CredentialsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const workspace = await requireWorkspaceBySlug(slug);
  const credentials = await prisma.credential.findMany({
    where: { workspaceId: workspace.id },
    orderBy: { label: "asc" },
    include: { project: { select: { name: true } } },
  });
  const base = `/w/${slug}`;

  // Nunca enviamos o ciphertext ao cliente; só o que a UI precisa listar.
  const views: CredentialView[] = credentials.map((cred) => ({
    id: cred.id,
    label: cred.label,
    username: cred.username,
    url: cred.url,
    projectName: cred.project?.name ?? null,
    editHref: `${base}/credentials/${cred.id}/edit`,
  }));

  return (
    <>
      <PageHeader
        title="Credenciais"
        subtitle="Segredos criptografados em repouso (AES-256-GCM)."
        actions={
          <Link href={`${base}/credentials/new`} className="btn-primary">
            Nova credencial
          </Link>
        }
      />

      {views.length === 0 ? (
        <EmptyState
          title="Nenhuma credencial"
          description="Guarde senhas e tokens com segurança, vinculados aos projetos."
          action={
            <Link href={`${base}/credentials/new`} className="btn-primary">
              Adicionar credencial
            </Link>
          }
        />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {views.map((credential) => (
            <CredentialItem key={credential.id} credential={credential} />
          ))}
        </ul>
      )}
    </>
  );
}
