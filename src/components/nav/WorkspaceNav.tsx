"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
}

/** Seção de links de uma workspace, com destaque do item ativo. */
export function WorkspaceNav({
  slug,
  name,
  color,
}: {
  slug: string;
  name: string;
  color: string;
}) {
  const pathname = usePathname();
  const base = `/w/${slug}`;
  const items: NavItem[] = [
    { href: base, label: "Visão geral" },
    { href: `${base}/projects`, label: "Projetos" },
    { href: `${base}/clients`, label: "Clientes" },
    { href: `${base}/contacts`, label: "Contatos" },
    { href: `${base}/agenda`, label: "Agenda" },
    { href: `${base}/documents`, label: "Documentos" },
    { href: `${base}/credentials`, label: "Credenciais" },
  ];

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 px-2 pb-1 pt-3">
        <span
          className="h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span className="truncate text-xs font-semibold uppercase tracking-wide text-muted">
          {name}
        </span>
      </div>
      {items.map((item) => {
        const active =
          item.href === base ? pathname === base : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`block rounded-md px-3 py-1.5 text-sm transition-colors ${
              active
                ? "bg-panel text-white"
                : "text-muted hover:bg-panel hover:text-white"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
