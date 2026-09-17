/**
 * Serviços em `/servicos`. Cada afirmação tem evidência: experiência publicada
 * (`experiencias.ts`) ou projeto próprio conferido no código.
 *
 * Regras (AGENTS.md): sem preço, prazo, garantia ou número inventado; projetos
 * de nicho sensível só como capacidade, sem nome nem link; integrações de
 * WhatsApp dizem que não usam a API oficial. Termos de busca em `docs/SEO.md`.
 */
import type { Service } from "@/features/services/repository/types";

const github = (repo: string) => `https://github.com/elvisea/${repo}`;

export const servicos = [
  {
    slug: "chatbot-ia-whatsapp",
    title: "Chatbot com IA e atendimento no WhatsApp",
    shortTitle: "Chatbot com IA e WhatsApp",
    metaTitle: "Chatbot com IA para WhatsApp",
    metaDescription:
      "Desenvolvimento de chatbot com IA para WhatsApp: respostas, consulta de horários, agendamento e atendimento humano no mesmo número.",
    summary:
      "Atendente virtual com IA que conversa pelo WhatsApp, responde dúvidas sobre a empresa, consulta horários livres e faz agendamentos. Quando a conversa precisa de uma pessoa, ela continua no mesmo número, numa central com vários atendentes e o histórico da conversa.",
    forWho: [
      "Empresas que recebem muitas mensagens no WhatsApp com as mesmas perguntas.",
      "Negócios que trabalham com agenda, como clínicas, salões, barbearias e prestadores de serviço.",
      "Equipes de venda ou suporte que dividem um único número entre várias pessoas.",
    ],
    deliverables: [
      "Atendente virtual com IA configurado com as informações da empresa: serviços, horários e regras de atendimento.",
      "Agendamento pela conversa, com consulta de horários livres e profissionais disponíveis.",
      "Central de atendimento (Chatwoot) com vários atendentes no mesmo número e distribuição das conversas.",
      "Integração com o sistema da empresa por API, quando houver.",
      "Implantação em servidor, com monitoramento.",
    ],
    process: [
      {
        title: "Entendimento",
        description:
          "Levantamento das perguntas mais comuns, das regras de atendimento e do que deve passar para uma pessoa.",
      },
      {
        title: "Configuração",
        description:
          "Conexão do número, comportamento do atendente virtual e integrações com agenda e sistema.",
      },
      {
        title: "Testes",
        description:
          "Conversas de teste com a equipe antes de o atendimento chegar aos clientes.",
      },
      {
        title: "Implantação",
        description:
          "Publicação, monitoramento e ajustes a partir das conversas reais.",
      },
    ],
    evidence: [
      {
        kind: "experiencia",
        title: "Contabilizei",
        description:
          "Migração das APIs do chatbot de WhatsApp e do chat de suporte do site para uma arquitetura BFF, com Google Pub/Sub para não perder mensagens em picos de volume.",
        href: "/experiencia#contabilizei",
      },
      {
        kind: "projeto-proprio",
        title: "Atendente virtual com IA",
        description:
          "SaaS de atendente virtual no WhatsApp: IA com comportamento configurável, agenda com horários e ausências e assinatura paga por PIX.",
      },
      {
        kind: "projeto-proprio",
        title: "Gestão de barbearias",
        description:
          "Agendamento online, clientes, equipe e financeiro, com WhatsApp e uma IA que consulta serviços, profissionais e horários livres e cria o agendamento pela conversa.",
      },
      {
        kind: "projeto-proprio",
        title: "Central de atendimento",
        description:
          "Implantação automatizada de Chatwoot com WhatsApp, distribuindo as conversas entre os atendentes disponíveis.",
      },
    ],
    stack: ["typescript", "nestjs", "prisma", "postgresql", "nextjs", "docker"],
    note: "As integrações feitas até aqui usam a Evolution API, que conecta um número comum de WhatsApp sem a API oficial da Meta. É mais simples de começar, mas o WhatsApp pode bloquear números que fujam das regras de uso. Esse risco é explicado antes de começar.",
    faq: [
      {
        question: "Usa a API oficial do WhatsApp?",
        answer:
          "Não. Os projetos feitos até aqui usam a Evolution API, que conecta um número comum de WhatsApp. Não há o respaldo da Meta, e o número pode ser bloqueado se o uso fugir das regras do WhatsApp.",
      },
      {
        question: "Qual IA é usada?",
        answer:
          "Os projetos já usaram modelos do Google (Gemini), da DeepSeek e da OpenAI. O atendente consulta os dados do sistema, como serviços e horários, antes de responder.",
      },
      {
        question: "A conversa pode passar para uma pessoa?",
        answer:
          "Sim. Com a central de atendimento, a conversa continua no mesmo número com um atendente, que vê o histórico.",
      },
    ],
  },
  {
    slug: "automacao-integracao",
    title: "Automação de processos e integração de sistemas",
    shortTitle: "Automação e integração",
    metaTitle: "Integração de sistemas e automação",
    metaDescription:
      "Integração entre sistemas próprios, de terceiros e legados por API, filas e webhooks, e automação de tarefas manuais, inclusive leitura de PDFs com IA.",
    summary:
      "Ligação entre o sistema da empresa e outros sistemas, como provedores financeiros, serviços de terceiros e sistemas antigos, por APIs, filas e webhooks. Tarefas repetidas, como exportar dados para planilhas ou copiar informações de documentos, viram rotinas automáticas.",
    forWho: [
      "Empresas que copiam dados à mão de um sistema para outro.",
      "Times que dependem de exportar planilhas para ter relatórios.",
      "Sistemas que precisam conversar com provedores externos de pagamento, mensagens ou dados públicos.",
      "Empresas com sistema antigo que precisa de integração sem ser reescrito.",
    ],
    deliverables: [
      "Integrações por API REST, webhooks e filas de mensagens, com tratamento de falhas.",
      "Automação de rotinas manuais, com registro do que foi executado.",
      "Extração de dados de documentos em PDF com IA, com validação do resultado.",
      "Documentação das APIs em OpenAPI (Swagger).",
      "Testes automatizados dos fluxos de integração.",
    ],
    process: [
      {
        title: "Mapeamento",
        description:
          "Sistemas envolvidos, dados trocados, frequência e o que deve acontecer quando algo falha.",
      },
      {
        title: "Desenho",
        description:
          "Contrato das APIs, formato dos dados e escolha entre chamada direta, fila ou webhook.",
      },
      {
        title: "Implementação",
        description: "Integração com testes automatizados e documentação.",
      },
      {
        title: "Implantação",
        description:
          "Publicação e monitoramento, com registro das execuções e das falhas.",
      },
    ],
    evidence: [
      {
        kind: "experiencia",
        title: "MAG Finanças (via SH Squads)",
        description:
          "Integração com os provedores financeiros Pismo, Celcoin e Comtele, com o fluxo coberto por testes automatizados antes do deploy.",
        href: "/experiencia#sh-squads",
      },
      {
        kind: "experiencia",
        title: "Contabilizei",
        description:
          "Camada BFF integrada a serviços legados em Java e Kotlin, sem exigir reescrita, e comunicação entre APIs por Google Pub/Sub.",
        href: "/experiencia#contabilizei",
      },
      {
        kind: "experiencia",
        title: "Trio",
        description:
          "Analytics em tempo real sobre ClickHouse no lugar da exportação manual de dados, e APIs documentadas em OpenAPI para integrações externas.",
        href: "/experiencia#trio",
      },
      {
        kind: "experiencia",
        title: "ATZ AERO",
        description:
          "API integrada aos dados abertos da ANAC (RAB) e ao AISWEB.",
        href: "/experiencia#atz-aero",
      },
      {
        kind: "codigo-aberto",
        title: "Extração de dados de contratos",
        description:
          "Prova de conceito: extração de dados de contratos sociais em PDF com IA (Gemini ou Claude), com resultado validado, em TypeScript e em Elixir.",
        href: github("envio-de-documentos"),
      },
    ],
    stack: [
      "typescript",
      "nodejs",
      "nestjs",
      "elixir",
      "postgresql",
      "clickhouse",
    ],
    faq: [
      {
        question: "Precisa trocar o sistema atual?",
        answer:
          "Não necessariamente. A integração pode ser feita por fora do sistema existente, como na Contabilizei, onde a camada nova conversou com serviços em Java e Kotlin sem reescrevê-los.",
      },
      {
        question: "A IA consegue ler qualquer documento?",
        answer:
          "O trabalho feito até aqui foi com contratos sociais em PDF digital, com o resultado conferido contra um formato esperado. Documentos escaneados ainda não foram testados.",
      },
    ],
  },
  {
    slug: "pagamentos-pix",
    title: "Pagamentos com PIX e cobrança recorrente",
    shortTitle: "Pagamentos com PIX",
    metaTitle: "Integração PIX e cobrança recorrente",
    metaDescription:
      "Integração de PIX, PIX automático e assinaturas em sistemas web: cobrança, confirmação por webhook e integração com gateways e provedores de pagamento.",
    summary:
      "Cobrança por PIX dentro do sistema: geração do pagamento, confirmação automática por webhook e liberação do que foi pago. Inclui PIX automático e cobranças recorrentes para planos e assinaturas.",
    forWho: [
      "Sistemas e SaaS que cobram assinatura.",
      "Plataformas que cobram por serviço ou pedido e liberam o acesso depois do pagamento.",
      "Empresas que conferem pagamentos à mão no extrato.",
    ],
    deliverables: [
      "Cobrança por PIX com código copia e cola.",
      "Confirmação do pagamento por webhook, com atualização automática do pedido ou da assinatura.",
      "Planos, assinaturas e cobrança recorrente.",
      "Integração com gateway ou provedor de pagamento.",
      "Testes automatizados do fluxo de cobrança.",
    ],
    process: [
      {
        title: "Escolha do provedor",
        description:
          "Comparação dos provedores de pagamento compatíveis com o modelo de cobrança da empresa.",
      },
      {
        title: "Modelagem",
        description:
          "Planos, cobranças, estados do pagamento e o que acontece em atraso ou cancelamento.",
      },
      {
        title: "Implementação",
        description: "Integração e testes no ambiente de testes do provedor.",
      },
      {
        title: "Produção",
        description: "Publicação e acompanhamento das primeiras cobranças.",
      },
    ],
    evidence: [
      {
        kind: "experiencia",
        title: "MAG Finanças (via SH Squads)",
        description:
          "PIX automático e recorrente para instituição financeira, seguindo a regulamentação do Banco Central.",
        href: "/experiencia#sh-squads",
      },
      {
        kind: "codigo-aberto",
        title: "Lawyers & Clients",
        description:
          "Plataforma que liga clientes a advogados, com cobrança por PIX via Pagar.me, confirmação por webhook e assinatura para advogados.",
        href: github("frontend_lawyers_and_clients"),
      },
      {
        kind: "projeto-proprio",
        title: "Assinaturas por PIX",
        description:
          "Planos e assinaturas pagos por PIX (Efí) num SaaS de atendimento com IA.",
      },
    ],
    stack: [
      "typescript",
      "nodejs",
      "express",
      "nestjs",
      "prisma",
      "postgresql",
    ],
    faq: [
      {
        question: "Quais provedores já foram integrados?",
        answer:
          "Pagar.me e Efí em cobranças por PIX, e Pismo e Celcoin no trabalho com PIX automático para instituição financeira.",
      },
      {
        question: "O que é PIX automático?",
        answer:
          "É a modalidade do Banco Central para cobranças recorrentes: o cliente autoriza uma vez e os pagamentos seguintes acontecem nas datas combinadas, sem gerar um novo PIX a cada mês.",
      },
    ],
  },
  {
    slug: "sistemas-web-saas",
    title: "Sistemas web sob medida e SaaS",
    shortTitle: "Sistemas web e SaaS",
    metaTitle: "Desenvolvimento de sistema web e SaaS",
    metaDescription:
      "Desenvolvimento de sistemas web sob medida e SaaS, do levantamento de requisitos à produção: painel, API, controle de acesso, relatórios e infraestrutura.",
    summary:
      "Sistema feito para o processo da empresa, do levantamento de requisitos até a produção: painel web, API, banco de dados, controle de acesso por perfil, relatórios e servidor. Também produtos SaaS, com planos e cobrança.",
    forWho: [
      "Empresas que controlam a operação em planilhas.",
      "Negócios cujo processo não cabe num software pronto.",
      "Quem quer lançar um produto SaaS.",
    ],
    deliverables: [
      "Levantamento de requisitos com quem vai usar o sistema.",
      "Painel web em Next.js e API em NestJS, com banco PostgreSQL.",
      "Controle de acesso por perfil, auditoria e gestão de documentos.",
      "Relatórios e painéis.",
      "Infraestrutura, deploy automatizado e monitoramento.",
    ],
    process: [
      {
        title: "Requisitos",
        description:
          "Conversa com quem vai usar o sistema para entender o processo atual e o que precisa mudar.",
      },
      {
        title: "Arquitetura",
        description:
          "Definição das partes do sistema, do banco de dados e da infraestrutura.",
      },
      {
        title: "Implementação em etapas",
        description:
          "Entregas em partes, validadas por quem vai usar o sistema.",
      },
      {
        title: "Produção",
        description: "Publicação, monitoramento e correções.",
      },
    ],
    evidence: [
      {
        kind: "experiencia",
        title: "ATZ AERO",
        description:
          "Plataforma de gestão de aeródromos usada por operadores, coordenadores e equipes técnicas: API em NestJS e frontend em Next.js com controle de acesso por papel, mapas e relatórios.",
        href: "/experiencia#atz-aero",
      },
      {
        kind: "experiencia",
        title: "SPRO IT Solutions",
        description:
          "Projetos do zero para o setor agro: requisitos levantados com quem ia usar, arquitetura e acompanhamento até a produção.",
        href: "/experiencia#spro",
      },
      {
        kind: "projeto-proprio",
        title: "Gestão de barbearias",
        description:
          "Sistema com agendamento online, clientes, equipe, serviços, planos e financeiro, em versão web e aplicativo.",
      },
      {
        kind: "codigo-aberto",
        title: "Lawyers & Clients",
        description:
          "Plataforma de casos jurídicos com painéis para clientes e advogados, documentos, planos e cobrança.",
        href: github("frontend_lawyers_and_clients"),
      },
    ],
    stack: ["typescript", "nextjs", "nestjs", "prisma", "postgresql", "docker"],
    faq: [
      {
        question: "Quais tecnologias são usadas?",
        answer:
          "Na maior parte dos projetos, Next.js no painel, NestJS na API e PostgreSQL no banco, com Docker na infraestrutura. Elixir e Phoenix também fazem parte da experiência, na Trio.",
      },
    ],
  },
  {
    slug: "aplicativos-mobile",
    title: "Aplicativos mobile para Android e iOS",
    shortTitle: "Aplicativos mobile",
    metaTitle: "Desenvolvimento de aplicativos mobile",
    metaDescription:
      "Desenvolvimento de aplicativos Android e iOS em React Native: apps que funcionam sem internet, conexão com equipamentos por Bluetooth e painéis de dados.",
    summary:
      "Aplicativos para Android e iOS em React Native, com o mesmo código para os dois sistemas. Inclui apps que funcionam sem internet e sincronizam quando a conexão volta, comunicação com equipamentos por Bluetooth e painéis de dados.",
    forWho: [
      "Equipes de campo que trabalham onde a internet falha.",
      "Empresas com equipamentos que precisam ser configurados ou monitorados pelo celular.",
      "Negócios que querem oferecer agendamento ou atendimento por aplicativo.",
    ],
    deliverables: [
      "Aplicativo em React Native e Expo para Android e iOS.",
      "Funcionamento offline, com sincronização quando a conexão volta.",
      "Comunicação com equipamentos por Bluetooth.",
      "Painéis e relatórios dentro do aplicativo.",
      "Otimização para aparelhos antigos e de baixo desempenho.",
    ],
    process: [
      {
        title: "Requisitos",
        description:
          "Quem usa o aplicativo, onde, com que aparelho e com que conexão.",
      },
      {
        title: "Telas",
        description: "Fluxo das telas validado antes da implementação.",
      },
      {
        title: "Implementação",
        description: "Aplicativo e API, com testes.",
      },
      {
        title: "Entrega",
        description: "Distribuição do aplicativo e acompanhamento do uso.",
      },
    ],
    evidence: [
      {
        kind: "experiencia",
        title: "b2k Technology Solutions",
        description:
          "Aplicativo de gestão de equipamentos agrícolas que opera 100% offline, configura equipamentos por Bluetooth e mostra painéis de horas, deslocamento e velocidade.",
        href: "/experiencia#b2k",
      },
      {
        kind: "experiencia",
        title: "SPRO IT Solutions",
        description:
          "Interfaces em React Native para soluções sob medida do setor agro.",
        href: "/experiencia#spro",
      },
      {
        kind: "codigo-aberto",
        title: "Barber Master",
        description:
          "Aplicativo de agendamento de serviços para barbearias, em React Native e Expo.",
        href: github("barber-master-app-backup"),
      },
    ],
    stack: ["react-native", "typescript", "nodejs"],
    faq: [
      {
        question: "Um aplicativo serve para Android e iPhone?",
        answer:
          "Sim. Com React Native, o mesmo código gera os dois aplicativos, com ajustes quando um recurso é específico de um sistema.",
      },
      {
        question: "O aplicativo funciona sem internet?",
        answer:
          "Pode funcionar. No aplicativo da b2k, o uso em campo era todo offline, com sincronização quando a conexão voltava.",
      },
    ],
  },
  {
    slug: "modernizacao-legado",
    title: "Modernização de sistemas legados",
    shortTitle: "Modernização de legado",
    metaTitle: "Modernização de sistemas legados",
    metaDescription:
      "Modernização de sistemas legados sem parar a operação: migração gradual de telas e APIs, camada nova sobre o sistema antigo e saída do Firebase.",
    summary:
      "Troca gradual de um sistema antigo por tecnologia atual, sem tirar a operação do ar. A migração acontece por partes, ou com uma camada nova que conversa com o sistema existente. Inclui a saída de plataformas proprietárias, como o Firebase, para infraestrutura própria.",
    forWho: [
      "Empresas com sistema antigo difícil de manter.",
      "Produtos presos a uma plataforma proprietária.",
      "Sistemas lentos nas telas mais usadas.",
    ],
    deliverables: [
      "Diagnóstico do sistema atual e plano de migração por etapas.",
      "Migração gradual de telas, por exemplo de jQuery para React e Next.js.",
      "Camada BFF ou API nova sobre serviços existentes.",
      "Migração de dados e saída do Firebase para API e banco próprios.",
      "Testes automatizados dos fluxos migrados.",
    ],
    process: [
      {
        title: "Diagnóstico",
        description:
          "O que o sistema faz hoje, onde estão os problemas e quais partes são mais usadas.",
      },
      {
        title: "Plano",
        description:
          "Ordem da migração e como o sistema antigo e o novo convivem durante a transição.",
      },
      {
        title: "Migração por partes",
        description: "Cada parte vai para produção antes da próxima começar.",
      },
      {
        title: "Desligamento",
        description: "Retirada do que ficou sem uso no sistema antigo.",
      },
    ],
    evidence: [
      {
        kind: "experiencia",
        title: "ztrax",
        description:
          "Migração gradual de uma aplicação em jQuery para React e Next.js, com o sistema disponível durante a transição.",
        href: "/experiencia#ztrax",
      },
      {
        kind: "experiencia",
        title: "Contabilizei",
        description:
          "Camada BFF integrada a serviços legados em Java e Kotlin, sem exigir reescrita desses serviços.",
        href: "/experiencia#contabilizei",
      },
      {
        kind: "experiencia",
        title: "ATZ AERO",
        description:
          "Saída do Firebase para infraestrutura própria, com API, PostgreSQL e MinIO.",
        href: "/experiencia#atz-aero",
      },
      {
        kind: "projeto-proprio",
        title: "Saída do Firebase em SaaS próprio",
        description:
          "Troca do Firebase por API própria em NestJS, PostgreSQL e armazenamento de arquivos compatível com S3.",
      },
    ],
    stack: ["react", "nextjs", "nodejs", "nestjs", "postgresql"],
    faq: [
      {
        question: "Precisa parar o sistema para migrar?",
        answer:
          "Nos projetos feitos até aqui, não. Na ztrax, a aplicação continuou disponível durante toda a migração.",
      },
    ],
  },
  {
    slug: "infraestrutura-devops",
    title: "Infraestrutura, servidores e DevOps",
    shortTitle: "Infraestrutura e DevOps",
    metaTitle: "Infraestrutura, servidores e DevOps",
    metaDescription:
      "Configuração de servidores com Ansible, segurança, Docker, CI/CD, backups e monitoramento, com provisionamento reproduzível e resposta a incidentes.",
    summary:
      "Servidor configurado do zero por automação (Ansible), com segurança de acesso, firewall, TLS, containers, backups e monitoramento. Deploy automatizado por CI/CD e serviços internos acessíveis só por VPN, sem expor banco e painéis à internet.",
    forWho: [
      "Empresas com servidor configurado à mão, que ninguém sabe refazer.",
      "Produtos sem deploy automatizado ou sem monitoramento.",
      "Times que precisam separar ambiente de testes e de produção.",
    ],
    deliverables: [
      "Provisionamento em Ansible, versionado e reproduzível.",
      "Hardening de SSH, firewall (UFW), Fail2Ban e certificados TLS.",
      "Aplicações em Docker com deploy por CI/CD.",
      "Ambientes de staging e produção isolados.",
      "Monitoramento, backups e error tracking.",
      "VPN mesh (Headscale/Tailscale) para serviços internos.",
    ],
    process: [
      {
        title: "Levantamento",
        description: "O que roda hoje, onde e como é publicado.",
      },
      {
        title: "Automação",
        description:
          "Configuração do servidor e do deploy descrita em código e versionada.",
      },
      {
        title: "Migração",
        description:
          "Aplicações movidas para o ambiente novo, com staging antes de produção.",
      },
      {
        title: "Operação",
        description:
          "Monitoramento, backups, procedimentos de incidente e documentação.",
      },
    ],
    evidence: [
      {
        kind: "experiencia",
        title: "ATZ AERO",
        description:
          "Provisionamento em Ansible com 24 roles, da VPS vazia à produção; staging e produção isolados; VPN mesh e streaming de câmeras IP no navegador.",
        href: "/experiencia#atz-aero",
      },
      {
        kind: "experiencia",
        title: "SPRO IT Solutions",
        description:
          "Pipeline de CI/CD para build, testes e publicação automatizados no Azure DevOps.",
        href: "/experiencia#spro",
      },
      {
        kind: "projeto-proprio",
        title: "Servidor próprio",
        description:
          "Serviços self-hosted atrás de Cloudflare Tunnel, sem portas abertas para a internet, com backup e plano de recuperação.",
      },
      {
        kind: "codigo-aberto",
        title: "elvisea.dev",
        description:
          "Este site: CI com lint, testes, varredura de segurança e build, release automática e imagem Docker publicada.",
        href: github("elvisea.dev"),
      },
    ],
    stack: ["ansible", "docker", "linux", "cicd", "postgresql"],
    faq: [
      {
        question: "Em que tipo de servidor funciona?",
        answer:
          "Os projetos feitos até aqui usaram VPS com Ubuntu e servidor próprio com Docker.",
      },
    ],
  },
] as const satisfies readonly Service[];
