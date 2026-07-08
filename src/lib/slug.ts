// Faixa de acentos combinados (Unicode combining diacritical marks).
const COMBINING_MARKS = /[̀-ͯ]/g;
const NON_ALNUM = /[^a-z0-9]+/g;
const EDGE_DASHES = /^-+|-+$/g;

/**
 * Gera um slug URL-safe a partir de um texto livre.
 * @example slugify("Cliente Açaí & Cia") // => "cliente-acai-cia"
 */
export function slugify(input: string): string {
  const slug = input
    .normalize("NFKD")
    .replace(COMBINING_MARKS, "")
    .toLowerCase()
    .trim()
    .replace(NON_ALNUM, "-")
    .replace(EDGE_DASHES, "");

  if (slug === "") {
    throw new Error(
      `Não consegui gerar um slug a partir de "${input}": informe ao menos uma letra ou número.`,
    );
  }
  return slug;
}
