"use client";

import { useRef } from "react";

/**
 * Botão de exclusão que pede confirmação antes de submeter o form pai.
 * O `action` do <form> deve ser a Server Action de delete correspondente.
 */
export function DeleteButton({
  id,
  action,
  label = "Excluir",
  confirmMessage = "Tem certeza? Esta ação não pode ser desfeita.",
}: {
  id: string;
  action: (formData: FormData) => void | Promise<void>;
  label?: string;
  confirmMessage?: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} action={action}>
      <input type="hidden" name="id" value={id} />
      <button
        type="button"
        className="btn-danger"
        onClick={() => {
          if (window.confirm(confirmMessage)) formRef.current?.requestSubmit();
        }}
      >
        {label}
      </button>
    </form>
  );
}
