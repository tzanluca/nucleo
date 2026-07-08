# Nucleo

Hub central **self-hosted** para gestão pessoal de clientes e projetos. Organize
tudo por **workspace** (uma frente de trabalho / cliente) e dentro dela gerencie
**projetos, clientes, contatos, agenda, documentos e credenciais** — num só lugar,
rodando na sua máquina ou no seu servidor.

> Single-user por design: uma pessoa, seus dados, seu servidor. Open source (MIT).

## Recursos

- **Workspaces** — agrupe por cliente ou área de trabalho, cada uma com sua cor.
- **Projetos** — status, prazos, cor e vínculo opcional a um cliente.
- **Clientes & Contatos** — quem é quem em cada workspace.
- **Agenda** — compromissos com hora, local e vínculo a projeto; mais uma
  **agenda geral** unificando todas as workspaces.
- **Documentos** — upload de arquivos por workspace/projeto (guardados no disco).
- **Cofre de credenciais** — segredos **criptografados em repouso** (AES-256-GCM),
  revelados só sob demanda.

## Stack

Next.js 15 (App Router, Server Actions) · TypeScript · Prisma · SQLite (padrão)
ou Postgres · Tailwind CSS · Vitest.

## Como rodar

Pré-requisito: **Node 20+**.

```bash
# 1. Instale as dependências
npm install

# 2. Configure o ambiente
cp .env.example .env
npm run gen-keys                       # gera SESSION_SECRET e ENCRYPTION_KEY
npm run hash-password -- "suaSenha"    # gera AUTH_PASSWORD_HASH
#   -> cole os três valores no .env, e defina AUTH_EMAIL

# 3. Prepare o banco (SQLite por padrão)
npm run db:push
npm run db:seed        # opcional: dados de exemplo

# 4. Suba o app
npm run dev            # http://localhost:3000
```

Faça login com o `AUTH_EMAIL` e a senha que você usou no `hash-password`.

## Variáveis de ambiente

Veja [`.env.example`](./.env.example). As principais:

| Variável             | Para que serve                                                         |
| -------------------- | ---------------------------------------------------------------------- |
| `DATABASE_URL`       | Conexão do Prisma (SQLite por padrão).                                 |
| `AUTH_EMAIL`         | Email do único usuário.                                                |
| `AUTH_PASSWORD_HASH` | Hash bcrypt da senha (via `npm run hash-password`).                    |
| `SESSION_SECRET`     | Assina o cookie de sessão (JWT).                                       |
| `ENCRYPTION_KEY`     | Chave AES-256 do cofre. **Perdê-la torna os segredos irrecuperáveis.** |
| `STORAGE_DIR`        | Onde os uploads são gravados (padrão `storage/`).                      |
| `MAX_UPLOAD_BYTES`   | Limite de tamanho de upload (padrão 25 MB).                            |

### Usar Postgres em vez de SQLite

1. Em `prisma/schema.prisma`, troque `provider = "sqlite"` por `"postgresql"`.
2. Ajuste `DATABASE_URL` no `.env` para a string do Postgres.
3. Rode `npm run db:push`.

## Scripts

| Comando                   | O que faz                          |
| ------------------------- | ---------------------------------- |
| `npm run dev`             | Ambiente de desenvolvimento.       |
| `npm run build` / `start` | Build e execução de produção.      |
| `npm test`                | Testes (Vitest).                   |
| `npm run typecheck`       | Checagem de tipos (tsc).           |
| `npm run db:push`         | Aplica o schema no banco.          |
| `npm run db:studio`       | Prisma Studio (inspecionar dados). |
| `npm run db:seed`         | Popula dados de exemplo.           |

## Arquitetura

```
src/
  app/
    login/                 tela de login
    (dashboard)/           tudo autenticado (layout com sidebar)
      w/[slug]/            páginas por workspace (projetos, clientes, agenda…)
      agenda/              agenda geral (todas as workspaces)
    api/documents/[id]/    download de arquivos (autenticado)
  server/                  Server Actions (uma por entidade) + estado de form
  lib/                     domínio puro: crypto, auth, validação, formatação
  components/              UI reutilizável, navegação e agenda
prisma/                    schema + seed
scripts/                   utilitários de CLI (chaves, hash de senha)
tests/                     testes unitários do domínio
```

Princípios: Server Actions validadas com **Zod**, segredos **nunca** trafegam em
claro para o cliente, e cada dependência de terceiros fica atrás de um módulo
fino próprio (`lib/crypto`, `lib/auth`, `lib/storage`, `lib/prisma`).

## Segurança

- Autenticação por cookie **httpOnly** assinado (HS256).
- Credenciais cifradas com **AES-256-GCM** (autenticado) antes de tocar o banco.
- Middleware protege todas as rotas exceto `/login` e assets.
- Feito para rodar **atrás da sua própria rede/HTTPS**. Não exponha à internet
  pública sem um proxy com TLS.

## Licença

[MIT](./LICENSE).
