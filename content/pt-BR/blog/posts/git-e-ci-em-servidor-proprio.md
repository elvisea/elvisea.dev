---
title: "Git e CI rodando num servidor próprio"
description: "Como mantenho código e integração contínua no meu servidor com Gitea, com os jobs de CI isolados dos outros serviços e sem depender de plataforma."
date: "2026-09-28"
tags: ["Self-hosted", "Git", "CI/CD", "Infraestrutura"]
---

Segundo texto da série sobre o [servidor que mantenho em casa](/blog/site-em-servidor-proprio).
Desta vez, o lugar onde o código fica e onde os testes rodam.

## Onde o código mora

Uso o [Gitea](https://about.gitea.com/), um servidor de git de código aberto, no mesmo
computador que roda este site. Ele guarda os repositórios, as issues e os pull requests,
e tem um sistema de CI próprio, o Gitea Actions, que usa workflows no formato do GitHub
Actions.

Escolhi o Gitea depois de testar o Forgejo, um projeto derivado dele. O critério foi
prático: no Gitea, o log de cada job de CI pode ser lido por API. Isso permite acompanhar
uma pipeline e ler o erro sem abrir a interface.

O cadastro de usuários é fechado: ninguém de fora cria conta, então ninguém de fora dispara
uma pipeline nesse servidor.

O GitHub continua no fluxo. O código deste site, por exemplo, fica no GitHub, e o Gitea
guarda um espelho dele. O Gitea serve para o que não precisa estar no GitHub.

## Como o CI roda sem tocar no resto

Um job de CI executa código: o do projeto e o de cada dependência que ele instala. Se
alguma dessas dependências for maliciosa, é esse código que roda no servidor.

Por isso o CI não usa o Docker do servidor. Ele tem um Docker só dele, numa rede que sai
para a internet e mais nada. Um job não enxerga o banco de dados, os arquivos nem os outros
serviços da máquina, e não consegue parar nenhum deles. Cada execução começa num container
limpo, que é descartado no fim.

## O dia em que o CI deixou tudo lento

O processador desse servidor é de 2012. Quando comecei a rodar builds de imagem Docker no
CI, um build ocupava todos os 8 threads, e o próprio Gitea ficava lento para responder
enquanto isso.

A correção foi limitar o CI a no máximo 6 dos 8 threads. O build demora um pouco mais, e o
resto do servidor continua respondendo. Pelo mesmo motivo, o build deste site não roda em
casa: ele acontece no GitHub Actions, e o servidor só baixa a versão pronta.

## O que isso significa para uma empresa

- **Onde o código fica:** com um servidor de git próprio, o código da empresa fica numa
  máquina que a empresa controla. Não depende da conta de uma pessoa nem de um fornecedor.
- **Custo previsível:** no plano gratuito do GitHub, repositórios privados têm
  [2.000 minutos de Actions por mês](https://docs.github.com/en/billing/concepts/product-billing/github-actions).
  Passando disso, cada minuto é cobrado. No servidor próprio, o limite é a máquina.
- **Não ficar refém:** o workflow do Gitea Actions é compatível com o do GitHub Actions na
  maior parte dos casos. Mudar de um para o outro é mover arquivos, e não reescrever a
  pipeline.
- **CI que não põe o resto em risco:** CI isolado do resto é o que impede que um pacote
  malicioso ou um build pesado derrube o sistema que atende o cliente.

Uma ressalva: o GitHub também aceita um runner instalado num servidor da empresa, e não
cobra por esse uso. Com isso se resolve o custo dos minutos, mas o código continua fora de
casa. O que o Gitea acrescenta é justamente o lugar onde o código fica.

## O que ainda falta

O servidor ainda não tem backup fora de casa. Para um servidor de git isso pesa: se o disco
falhar, os repositórios que existem só aqui se perdem. Até o backup remoto existir, o Gitea
não deve ser a única cópia de nada importante. O backup é o próximo item da lista.

## Como conferir

Criei um repositório público pequeno só para mostrar o fluxo:
[git.elvisea.dev/elvisea/gitea-actions-exemplo](https://git.elvisea.dev/elvisea/gitea-actions-exemplo).
Ele tem uma validação de CPF, os testes dela e um workflow que roda os testes a cada push.
As execuções ficam na aba
[Actions](https://git.elvisea.dev/elvisea/gitea-actions-exemplo/actions), sem precisar de
login.

Se a sua empresa quer código e pipelines num ambiente próprio, veja o serviço de
[infraestrutura e DevOps](/servicos/infraestrutura-devops) ou [fale comigo](/contato).
