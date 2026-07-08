"use client";

import { useFormStatus } from "react-dom";

/**
 * Botão de submit que fica desabilitado e mostra "..." enquanto a action roda.
 * Deve viver dentro de um <form> (usa o contexto de useFormStatus).
 */
export function SubmitButton({
  children,
  pendingLabel = "Salvando…",
  className = "btn-primary",
}: {
  children: React.ReactNode;
  pendingLabel?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={className} disabled={pending}>
      {pending ? pendingLabel : children}
    </button>
  );
}
