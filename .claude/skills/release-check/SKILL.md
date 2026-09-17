---
name: release-check
description: Verificação completa da develop antes do merge de release para a main — worktree limpa, instalação congelada, lint, formatação, tipos, testes, bun audit, build, imagem Docker saudável com rotas conferidas, gitleaks e semantic-release em dry-run. Use antes de pedir o OK de uma release ou quando pedirem para "verificar se dá para lançar a versão".
argument-hint: "[ref, padrão develop]"
---

# Verificação de release

Roda numa **worktree destacada** da `develop`, sem depender do estado da pasta
principal (que pode ter mudanças locais ou o dev server rodando).

## Passos

1. **Worktree limpa** (a `develop` pode estar em uso na pasta principal, por
   isso `--detach`):

   ```bash
   git fetch origin develop
   W="$(mktemp -d)/elvisea.dev-release"
   git worktree add --detach "$W" origin/develop
   cd "$W" && git log --oneline -1
   ```

2. **Qualidade:**

   ```bash
   bun install --frozen-lockfile
   bun run lint && bun run format:check && bun run typecheck
   bun test
   bun run security:check
   bun --bun run build
   ```

3. **Imagem Docker:**

   ```bash
   docker build -q -t elvisea-dev:release-check .
   docker run -d --name elvisea-release-check -p 127.0.0.1:3103:3000 \
     -e EMAIL_TRANSPORT=console elvisea-dev:release-check
   until [ "$(docker inspect -f '{{.State.Health.Status}}' elvisea-release-check)" != "starting" ]; do sleep 3; done
   docker inspect -f '{{.State.Health.Status}}' elvisea-release-check   # healthy
   ```

   Conferir o status HTTP em `http://127.0.0.1:3103`:

   | Status | Rotas                                                                                                                                                          |
   | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | 200    | `/`, páginas internas, `/servicos` e cada serviço, `/contato` com parâmetros, `/rss.xml`, `/sitemap.xml`, `/robots.txt`, `/opengraph-image`, PDFs do currículo |
   | 308    | `/experiences`, `/projects/x`, `/contact`                                                                                                                      |
   | 404    | `/servicos/nao-existe`, `/nao-existe`                                                                                                                          |

4. **Segredos** no histórico, rodando a partir da pasta principal do
   repositório (numa worktree o `.git` é um arquivo que aponta para fora do
   volume montado, e o gitleaks não lê nada):

   ```bash
   cd <pasta principal do repositório>
   docker run --rm -v "$PWD:/repo" zricethezav/gitleaks:latest detect --source /repo --no-banner
   ```

5. **Release simulada:**

   ```bash
   GITHUB_TOKEN="$(gh auth token)" bunx semantic-release --dry-run --no-ci --branches develop
   ```

   Anotar a versão anunciada.

6. **Limpeza** (sempre, mesmo com falha):

   ```bash
   docker rm -f elvisea-release-check; docker rmi elvisea-dev:release-check
   git worktree remove --force "$W"
   ```

## Relatório

Uma linha por etapa (✅/❌) com números reais: commit verificado, total de
testes, vulnerabilidades, rotas por status, resultado do gitleaks e versão
anunciada. Esse bloco vai para a seção "Verificação" do PR de release. Com
qualquer ❌, não pedir o OK da release: reportar a falha.
