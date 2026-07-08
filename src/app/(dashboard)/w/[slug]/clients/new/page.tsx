import { PageHeader } from "@/components/ui/PageHeader";
import { requireWorkspaceBySlug } from "@/lib/workspace-context";
import { createClient } from "@/server/clients";
import { ClientForm } from "../ClientForm";

export default async function NewClientPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const workspace = await requireWorkspaceBySlug(slug);
  const action = createClient.bind(null, workspace.id, slug);

  return (
    <>
      <PageHeader title="Novo cliente" />
      <ClientForm action={action} />
    </>
  );
}
