/** Banner de erro geral do formulário (não atrelado a um campo). */
export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div className="rounded-lg border border-red-900/60 bg-red-950/40 px-3 py-2 text-sm text-red-300">
      {message}
    </div>
  );
}
