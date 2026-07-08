import { PageHeader } from "@/components/ui/PageHeader";
import { requireWorkspaceBySlug } from "@/lib/workspace-context";
import { updateWorkspace } from "@/server/workspaces";
import { WorkspaceForm } from "../../../workspaces/WorkspaceForm";

export default async function EditWorkspacePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const workspace = await requireWorkspaceBySlug(slug);
  const action = updateWorkspace.bind(null, workspace.id);

  return (
    <>
      <PageHeader title={`Editar ${workspace.name}`} />
      <WorkspaceForm action={action} workspace={workspace} />
    </>
  );
}
