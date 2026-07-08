"use client";

import Link from "next/link";
import { useState } from "react";
import { revealSecret } from "@/server/credentials";

export interface CredentialView {
  id: string;
  label: string;
  username: string | null;
  url: string | null;
  projectName: string | null;
  editHref: string;
}

/**
 * Cartão de credencial com revelação sob demanda: o segredo só trafega quando
 * o usuário clica em "Revelar" (chama a Server Action que descriptografa).
 */
export function CredentialItem({ credential }: { credential: CredentialView }) {
  const [secret, setSecret] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function toggle(): Promise<void> {
    if (secret !== null) {
      setSecret(null);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      setSecret(await revealSecret(credential.id));
    } catch {
      setError("Não foi possível revelar. Verifique a ENCRYPTION_KEY.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <li className="card space-y-2">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-medium text-white">{credential.label}</p>
          {credential.username ? (
            <p className="text-sm text-muted">{credential.username}</p>
          ) : null}
          {credential.projectName ? (
            <p className="text-xs text-accent">{credential.projectName}</p>
          ) : null}
        </div>
        <div className="flex shrink-0 gap-2">
          <button type="button" onClick={toggle} className="btn-ghost" disabled={busy}>
            {busy ? "…" : secret !== null ? "Ocultar" : "Revelar"}
          </button>
          <Link href={credential.editHref} className="btn-ghost">
            Editar
          </Link>
        </div>
      </div>

      {secret !== null ? (
        <code className="block break-all rounded-md border border-border bg-surface px-3 py-2 text-sm text-emerald-300">
          {secret}
        </code>
      ) : null}
      {error ? <p className="field-error">{error}</p> : null}

      {credential.url ? (
        <a
          href={credential.url}
          target="_blank"
          rel="noreferrer"
          className="block truncate text-xs text-muted hover:text-accent"
        >
          {credential.url}
        </a>
      ) : null}
    </li>
  );
}
