---
title: "Este site roda num PC de 2012 na minha casa"
description: "Como o elvisea.dev é publicado num servidor próprio, sem portas abertas para a internet: build no GitHub Actions, imagem Docker e deploy por troca de versão."
date: "2026-09-28"
tags: ["Self-hosted", "Infraestrutura", "Deploy", "Docker"]
---

Este é o primeiro texto de uma série sobre os serviços que mantenho num servidor próprio.
Começo pelo caso mais fácil de conferir: o site que você está lendo.

## Onde o site roda

O elvisea.dev não está numa hospedagem contratada. Ele roda num computador de mesa que
fica na minha casa: um Intel Core i7-3770, processador de 2012, com 16 GB de memória.
O disco do sistema e o disco de dados são criptografados. Se alguém levar um dos dois,
leva um disco que não consegue ler.

A mesma máquina roda outros serviços de uso diário (arquivos, git, mídia, monitoramento).
O site é a primeira aplicação feita por mim entre eles. Todas as outras são imagens
prontas de terceiros.

O servidor não tem nenhuma porta aberta para a internet. Quem acessa o site chega à
Cloudflare. A conexão entre a Cloudflare e o servidor é aberta de dentro para fora, pelo
próprio servidor (Cloudflare Tunnel). Na prática, o servidor não expõe porta para a
internet e o IP da casa não é divulgado. O site também não tem tela de login na frente: ele
existe para ser lido por quem está contratando e pelo Google.

## Como uma versão nova chega ao ar

O servidor não compila o site. Ele só baixa uma versão pronta e roda.

1. Cada mudança entra no repositório público
   [elvisea/elvisea.dev](https://github.com/elvisea/elvisea.dev) por pull request. A CI
   roda lint, formatação, tipos, testes, varredura de segurança e build.
2. Quando um conjunto de mudanças vai para a `main`, o semantic-release calcula o número
   da versão, gera o changelog e publica a imagem Docker em
   [`ghcr.io/elvisea/elvisea.dev`](https://github.com/elvisea/elvisea.dev/pkgs/container/elvisea.dev).
3. No servidor, a versão do site é um número escrito num arquivo de configuração
   versionado. Atualizar é trocar esse número, aplicar e registrar a troca num commit.

Voltar atrás é o mesmo passo ao contrário: trocar o número de volta. As versões antigas
continuam publicadas.

O build fica fora de casa por um motivo concreto: um processador de 2012 é o gargalo
dessa máquina. Compilar o site ali disputaria processador com todo o resto que roda nela.
No GitHub Actions, como o repositório é público, o build do site não gera custo e roda num
ambiente limpo a cada execução.

O site também não guarda estado. Não tem banco de dados nem arquivo gravado em disco: o
conteúdo é gerado no build, e a única parte que executa quando alguém acessa é o
formulário de [contato](/contato), que envia um e-mail. Se o servidor sumir amanhã, o
site volta em qualquer máquina que rode Docker, a partir da mesma imagem.

## O que isso significa para uma empresa

Troque "site pessoal" por "o sistema da sua empresa" e as perguntas são as mesmas.

- **Custo:** aqui não há mensalidade de hospedagem para o site. O que tem custo é o
  domínio e a energia da máquina, que eu ainda não medi. Por isso não coloco número neste
  texto.
- **Não depender de fornecedor:** o site é uma imagem Docker padrão. Roda igual neste
  servidor, numa VPS ou em qualquer nuvem que rode containers. Mudar de hospedagem é mudar
  de onde a imagem é baixada, e não reescrever nada.
- **Saber o que está no ar:** a versão em produção está escrita num arquivo versionado,
  com histórico de quem trocou e quando. Não existe "alguém mexeu no servidor e ninguém
  sabe o quê".
- **Controle do dado:** neste caso há pouco dado, porque o site não tem banco. O argumento
  pesa mais nos próximos artigos da série, sobre arquivos e código guardados no mesmo
  servidor.

## O que ainda falta

O servidor ainda não tem backup fora de casa. O site não depende disso, porque o código
está no GitHub e a imagem, no registro de containers. Para os serviços que guardam dado,
porém, o backup remoto é o próximo item da lista. Enquanto ele não existir, este servidor
não é o lugar para guardar nada que não tenha cópia em outro lugar.

## Como conferir

- Código do site no GitHub: [elvisea/elvisea.dev](https://github.com/elvisea/elvisea.dev).
- O mesmo código espelhado no Gitea do servidor, atualizado a partir do GitHub:
  [git.elvisea.dev/elvisea/elvisea.dev](https://git.elvisea.dev/elvisea/elvisea.dev).
- Imagens publicadas:
  [ghcr.io/elvisea/elvisea.dev](https://github.com/elvisea/elvisea.dev/pkgs/container/elvisea.dev).

Se a sua empresa tem servidor configurado à mão ou deploy que depende de uma pessoa, veja
o serviço de [infraestrutura e DevOps](/servicos/infraestrutura-devops).
