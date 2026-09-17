## Desenvolvimento com agentes de IA

Desenvolvo com agentes de IA dentro de um fluxo definido em cada repositório:

- **Contexto canonizado.** Um `AGENTS.md` na raiz descreve stack, arquitetura, convenções e regras do projeto. Os arquivos específicos de cada ferramenta apenas apontam para ele, sem duplicar texto, então o mesmo contexto serve a qualquer agente.
- **Comandos de fluxo.** Issue, branch, commit, review, pull request e merge seguem roteiros versionados no próprio repositório. Um comando encadeia todos eles, e outro gera a estrutura de uma feature nova no padrão de arquitetura do projeto.
- **Skills.** Tarefas recorrentes ficam descritas uma vez:
  - acompanhar a CI de um pull request até passar;
  - percorrer as páginas no navegador nos temas claro e escuro, em celular e desktop;
  - diagnosticar erros de console e de rede;
  - auditar SEO, acessibilidade e performance;
  - verificar a versão antes de publicar.
- **Subagente revisor.** Antes do pull request, um revisor lê o diff e classifica os achados por severidade (crítico, aviso, sugestão), com arquivo e linha.
- **Trabalho em paralelo.** Tarefas simultâneas rodam em git worktrees separadas. Cada uma tem branch, dependências e servidor de desenvolvimento próprios, e dois agentes nunca editam os mesmos arquivos.

## Qualidade antes do merge

- Toda mudança começa por uma issue; a branch leva o número da issue e o pull request a fecha.
- Antes do pull request, a mudança é validada localmente (lint, formatação, tipos, testes e build) e, quando é visual, conferida no navegador.
- A CI roda em etapas encadeadas: segurança (auditoria de dependências e varredura de configuração), qualidade (lint, formatação e tipos), testes e build. O pull request é acompanhado até a CI passar, e as falhas são corrigidas na própria branch.
- Commits seguem Conventional Commits. Versão, changelog e release são gerados automaticamente a partir deles.
- Antes de cada versão, a branch de integração é verificada numa cópia limpa:
  - instalação com o lockfile congelado;
  - testes e auditoria de dependências;
  - build e imagem Docker saudável;
  - varredura de segredos no histórico;
  - simulação da release.

## Infraestrutura e entrega

- Provisionamento automatizado com Ansible, de um servidor vazio até produção.
- Aplicações em containers, com healthcheck e imagem publicada pelo pipeline de release.
- Staging e produção isolados, com TLS, backups e monitoramento.
- Resposta a incidentes de DNS, certificados, domínio e indisponibilidade.

## Exemplo público

O código deste site segue o mesmo fluxo e é aberto: [github.com/elvisea/elvisea.dev](https://github.com/elvisea/elvisea.dev). No repositório estão:

- o `AGENTS.md`;
- os comandos em `.claude/commands`;
- as skills em `.claude/skills`;
- o revisor em `.claude/agents`;
- a CI em `.github/workflows`;
- o histórico de issues e pull requests.
