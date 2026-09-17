## Desenvolvimento com agentes de IA

Desenvolvo com agentes de IA dentro de um fluxo definido em cada repositório:

- **Contexto canonizado.** Um `AGENTS.md` na raiz descreve stack, arquitetura, convenções e regras do projeto. Os arquivos específicos de cada ferramenta apenas apontam para ele, sem duplicar texto, então o mesmo contexto serve a qualquer agente.
- **Comandos de fluxo.** Branch, commit, review e pull request seguem roteiros versionados no próprio repositório.
- **Skills de domínio.** Tarefas recorrentes de cada projeto ficam descritas uma vez e são reaproveitadas.
- **Subagentes revisores.** Antes do pull request, um revisor lê o diff e classifica os achados por severidade (crítico, aviso, sugestão), com arquivo e linha.

## Qualidade antes do merge

- Toda mudança começa por uma issue; a branch leva o número da issue e o pull request a fecha.
- A CI roda em etapas encadeadas: segurança (auditoria de dependências e varredura de configuração), qualidade (lint, formatação e tipos), testes e build.
- Commits seguem Conventional Commits. Versão, changelog e release são gerados automaticamente a partir deles.

## Infraestrutura e entrega

- Provisionamento automatizado com Ansible, de um servidor vazio até produção.
- Aplicações em containers, com healthcheck e imagem publicada pelo pipeline de release.
- Staging e produção isolados, com TLS, backups e monitoramento.
- Resposta a incidentes de DNS, certificados, domínio e indisponibilidade.

## Exemplo público

O código deste site segue o mesmo fluxo e é aberto: [github.com/elvisea/elvisea.dev](https://github.com/elvisea/elvisea.dev). No repositório estão o `AGENTS.md`, os comandos em `.claude/commands`, o revisor em `.claude/agents`, a CI em `.github/workflows` e o histórico de issues e pull requests.
