# Contribuindo com o Nucleo

Obrigado pelo interesse! Este guia cobre o essencial para contribuir.

## Ambiente

Requisitos: **Node 20+**.

```bash
npm install
cp .env.example .env
npm run gen-keys                       # SESSION_SECRET + ENCRYPTION_KEY
npm run hash-password -- "suaSenha"    # AUTH_PASSWORD_HASH
npm run db:push
npm run dev
```

## Antes de abrir um PR

Rode a mesma verificação que a CI executa:

```bash
npm run typecheck
npm run lint
npm run format:check
npm test
npm run build
```

`npm run format` aplica o Prettier automaticamente.

## Padrões de código

O projeto segue as convenções de [`CLAUDE.md`](./CLAUDE.md). Em resumo:

- Funções de 4–20 linhas; arquivos abaixo de 500 linhas; uma responsabilidade por módulo.
- Tipos explícitos — nada de `any`. Early returns, no máximo 2 níveis de indentação.
- Toda função nova ganha teste; correção de bug ganha teste de regressão.
- Mensagens de exceção incluem o valor recebido e o formato esperado.
- Dependências de terceiros ficam atrás de um módulo fino próprio
  (veja `src/lib/crypto`, `src/lib/auth`, `src/lib/storage`).
- Comentários explicam o **porquê**, não o **quê**.

## Estrutura

Convenção do Next.js (App Router). Server Actions ficam em `src/server/`,
o domínio puro em `src/lib/`, e a UI em `src/components/`. Veja o README para o mapa.

## Commits

Mensagens no imperativo, curtas e descritivas. Um PR por assunto.

## Reportando bugs de segurança

Não abra issue pública. Veja [`SECURITY.md`](./SECURITY.md).
