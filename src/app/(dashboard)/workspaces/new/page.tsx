import { PageHeader } from "@/components/ui/PageHeader";
import { createWorkspace } from "@/server/workspaces";
import { WorkspaceForm } from "../WorkspaceForm";

export default function NewWorkspacePage() {
  return (
    <>
      <PageHeader title="Nova workspace" />
      <WorkspaceForm action={createWorkspace} />
    </>
  );
}
