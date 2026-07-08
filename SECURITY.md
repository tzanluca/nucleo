# Política de Segurança

O Nucleo guarda dados sensíveis (credenciais, documentos, contatos), então
levamos segurança a sério mesmo sendo uma ferramenta single-user self-hosted.

## Reportando uma vulnerabilidade

**Não abra uma issue pública** para falhas de segurança. Use os
[Security Advisories privados do GitHub](https://github.com/zanlucathiago/nucleo/security/advisories/new)
ou abra um contato privado com o mantenedor.

Descreva o problema, o impacto e um passo a passo de reprodução. Respondemos o
quanto antes e coordenamos a divulgação após a correção.

## Modelo de ameaça (resumo)

O Nucleo foi desenhado para rodar **na sua própria máquina ou servidor privado**,
atrás do seu HTTPS/rede. Não é feito para exposição direta à internet pública
sem um proxy reverso com TLS.

Garantias no código:

- **Senha** guardada apenas como hash bcrypt (custo 12); nunca em texto puro.
- **Sessão** em cookie `httpOnly`, `sameSite=lax`, assinado (JWT HS256);
  `secure` em produção.
- **Credenciais** cifradas com **AES-256-GCM** (autenticado) antes de tocar o
  banco. O texto puro só é decifrado sob demanda e nunca é serializado para
  listagens nem logs.
- **Middleware** bloqueia todas as rotas exceto `/login` e assets.
- **Uploads** validam tamanho e são gravados com nome opaco; o caminho é checado
  contra path traversal.

## Responsabilidades do operador

- Gere `SESSION_SECRET` e `ENCRYPTION_KEY` fortes (`npm run gen-keys`) e
  **nunca** os versione (o `.env` está no `.gitignore`).
- Faça backup da `ENCRYPTION_KEY`: **perdê-la torna as credenciais irrecuperáveis.**
- Sirva sempre atrás de HTTPS.
- Mantenha as dependências atualizadas (o Dependabot ajuda via PRs semanais).
