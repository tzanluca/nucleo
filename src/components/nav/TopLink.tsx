"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** Link de nível superior da sidebar (Início, Agenda geral, etc.). */
export function TopLink({
  href,
  label,
  exact = false,
}: {
  href: string;
  label: string;
  exact?: boolean;
}) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`block rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
        active ? "bg-panel text-white" : "text-muted hover:bg-panel hover:text-white"
      }`}
    >
      {label}
    </Link>
  );
}
