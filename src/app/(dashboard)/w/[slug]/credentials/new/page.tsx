import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui/PageHeader";
import { requireWorkspaceBySlug } from "@/lib/workspace-context";
import { createCredential } from "@/server/credentials";
import { CredentialForm } from "../CredentialForm";

export default async function NewCredentialPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const workspace = await requireWorkspaceBySlug(slug);
  const projects = await prisma.project.findMany({
    where: { workspaceId: workspace.id },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
  const action = createCredential.bind(null, workspace.id, slug);

  return (
    <>
      <PageHeader title="Nova credencial" />
      <CredentialForm action={action} projects={projects} />
    </>
  );
}
