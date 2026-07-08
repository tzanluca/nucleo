import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui/PageHeader";
import { DeleteButton } from "@/components/ui/DeleteButton";
import { requireWorkspaceBySlug } from "@/lib/workspace-context";
import { deleteCredential, updateCredential } from "@/server/credentials";
import { CredentialForm } from "../../CredentialForm";

export default async function EditCredentialPage({
  params,
}: {
  params: Promise<{ slug: string; credentialId: string }>;
}) {
  const { slug, credentialId } = await params;
  const workspace = await requireWorkspaceBySlug(slug);
  const [credential, projects] = await Promise.all([
    prisma.credential.findFirst({
      where: { id: credentialId, workspaceId: workspace.id },
    }),
    prisma.project.findMany({
      where: { workspaceId: workspace.id },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);
  if (!credential) notFound();

  const update = updateCredential.bind(null, credential.id, slug);
  const remove = deleteCredential.bind(null, slug);

  return (
    <>
      <PageHeader
        title={`Editar ${credential.label}`}
        actions={<DeleteButton id={credential.id} action={remove} />}
      />
      <CredentialForm action={update} projects={projects} credential={credential} />
    </>
  );
}
