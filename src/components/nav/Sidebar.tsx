import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { logout } from "@/server/auth";
import { WorkspaceNav } from "./WorkspaceNav";
import { TopLink } from "./TopLink";

/**
 * Barra lateral do dashboard. Lista as workspaces (cada uma com seus links) e
 * os atalhos globais. É um Server Component: busca as workspaces direto no banco.
 */
export async function Sidebar() {
  const workspaces = await prisma.workspace.findMany({
    orderBy: { name: "asc" },
    select: { id: true, slug: true, name: true, color: true },
  });

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-border bg-surface">
      <div className="border-b border-border px-4 py-4">
        <Link href="/" className="text-lg font-semibold text-white">
          Nucleo
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-3">
        <TopLink href="/" label="Início" exact />
        <TopLink href="/agenda" label="Agenda geral" />

        {workspaces.map((workspace) => (
          <WorkspaceNav
            key={workspace.id}
            slug={workspace.slug}
            name={workspace.name}
            color={workspace.color}
          />
        ))}

        <div className="pt-3">
          <TopLink href="/workspaces/new" label="+ Nova workspace" />
        </div>
      </nav>

      <form action={logout} className="border-t border-border p-3">
        <button type="submit" className="btn-ghost w-full">
          Sair
        </button>
      </form>
    </aside>
  );
}
