/**
 * Experiências profissionais, da mais recente para a mais antiga.
 *
 * Texto canônico: `~/projects/presenca-digital/perfil/linkedin-experiencias.md`
 * (o mesmo publicado no LinkedIn). Mudou lá, copia aqui. Regras do AGENTS.md:
 * sem frases de efeito, sem licitações; a Trio fica sem link de empresa.
 */
import type { Experience } from "@/lib/content/types";

export const experiencias = [
  {
    slug: "atz-aero",
    company: "ATZ AERO",
    companyUrl: "https://www.linkedin.com/company/atzaero/",
    role: "Desenvolvedor Full-Stack e Infraestrutura",
    mode: "remoto",
    start: "2026-02",
    end: null,
    summary: [
      "Plataforma de gestão de aeródromos: solicitações de pouso, movimentos, manutenções, visitas técnicas e monitoramento por câmera, usada por operadores, coordenadores e equipes técnicas.",
      "Respondo pela infraestrutura de ponta a ponta — VPS, deploys, domínios, backups e monitoramento — além da API e do frontend.",
    ],
    groups: [
      {
        title: "Infraestrutura",
        bullets: [
          "Automatizei o provisionamento em Ansible: de uma VPS vazia até produção, com 24 roles versionadas (hardening SSH, UFW, Fail2Ban, PostgreSQL, Nginx com TLS, Docker). Servidor novo sobe reproduzível, sem passo manual.",
          "Opero staging e produção isolados e respondo pelos incidentes: DNS, certificados, domínio e indisponibilidade.",
          "Montei VPN mesh self-hosted (Headscale/Tailscale) ligando servidor e nós em aeródromos, para que banco, painéis e cofre de senhas não ficassem expostos à internet.",
          "Subi a plataforma de apoio self-hosted: object storage, cache, cofre de senhas, monitoramento e error tracking.",
          "Levei streaming de câmeras IP ao navegador com MediaMTX em Raspberry Pi na ponta (RTSP→HLS).",
        ],
      },
      {
        title: "Produto",
        bullets: [
          "Conduzi a saída do Firebase para infraestrutura própria (API + PostgreSQL + MinIO), eliminando dependência de plataforma proprietária.",
          "Construí a API em NestJS e Prisma, integrada aos dados abertos da ANAC (RAB) e ao AISWEB, com documentos, notificações e auditoria.",
          "Desenvolvi o frontend em Next.js com controle de acesso por papel, mapas e relatórios.",
        ],
      },
      {
        title: "Engenharia com IA",
        bullets: [
          "Desenvolvi o produto com agentes de IA sob um fluxo que desenhei: contexto canonizado por repositório, comandos de fluxo (branch → commit → review → PR), skills de domínio e subagentes revisores que classificam achados por severidade.",
          "Mantive o fluxo agnóstico de ferramenta: fonte de contexto única, sem duplicação, servindo a qualquer agente.",
          "Amarrei tudo a quality gates encadeados no CI (segurança → qualidade → testes) e rastreabilidade obrigatória de issue a PR.",
        ],
      },
    ],
    stack: [
      "typescript",
      "nestjs",
      "prisma",
      "postgresql",
      "nextjs",
      "ansible",
      "docker",
      "linux",
      "cicd",
    ],
    highlight: true,
  },
  {
    slug: "trio",
    company: "Trio",
    role: "Desenvolvedor Full-Stack",
    location: "Curitiba, Paraná, Brasil",
    mode: "híbrido",
    start: "2025-08",
    end: "2026-05",
    summary: [
      "Desenvolvimento de sistemas de alto volume com Elixir e Phoenix.",
    ],
    groups: [
      {
        title: null,
        bullets: [
          "Construí a camada de analytics em tempo real sobre ClickHouse, substituindo exportação manual de dados (ClickHouse, Metabase).",
          "Entreguei interfaces reativas sem time de front-end dedicado (Phoenix LiveView, Tailwind, DaisyUI).",
          "Implementei autenticação com dois fatores e trilha de auditoria por operação (Guardian JWT, Argon2, 2FA).",
          "Documentei as APIs em OpenAPI para uso por integrações externas (Swagger/OpenAPI).",
        ],
      },
    ],
    stack: ["elixir", "phoenix", "clickhouse"],
    highlight: true,
  },
  {
    slug: "sh-squads",
    company: "SH Squads",
    companyUrl: "https://www.linkedin.com/company/shsquads/",
    role: "Desenvolvedor Backend",
    engagement: "alocado na MAG Finanças",
    location: "Curitiba, Paraná, Brasil",
    mode: "remoto",
    start: "2025-03",
    end: "2025-06",
    summary: [
      "Pagamentos PIX automático e recorrente para instituição financeira, sob as normas do BACEN. Alocado na MAG Finanças pela consultoria SH Squads.",
    ],
    groups: [
      {
        title: null,
        bullets: [
          "Desenvolvi as funcionalidades de PIX automático e recorrente seguindo a regulamentação do Banco Central (Node.js, TypeScript, Express).",
          "Integrei o sistema a provedores financeiros de terceiros: Pismo, Celcoin e Comtele.",
          "Estruturei o código em Clean Architecture e DDD, com a regra de negócio financeira isolada e testável (injeção de dependências, Sequelize, PostgreSQL).",
          "Cobri o fluxo com testes automatizados antes do deploy (Jest, Supertest, Nock).",
          "Protegi credenciais e dados sensíveis com Azure Key Vault e usei Service Bus e Blob Storage na comunicação e no armazenamento (JWT, bcrypt, RSA).",
          "Atuei no ciclo completo: análise, implementação, testes, documentação em Swagger/OpenAPI e deploy.",
        ],
      },
    ],
    stack: ["nodejs", "typescript", "express", "postgresql"],
    highlight: true,
  },
  {
    slug: "contabilizei",
    company: "Contabilizei",
    companyUrl: "https://www.linkedin.com/company/contabilizei/",
    role: "Desenvolvedor Backend",
    location: "Curitiba, Paraná, Brasil",
    mode: "remoto",
    start: "2024-05",
    end: "2024-08",
    summary: [
      "Migração das APIs de comunicação com o cliente — chatbot de WhatsApp e chat de suporte do site.",
    ],
    groups: [
      {
        title: null,
        bullets: [
          "Migrei os canais de atendimento ao cliente para uma arquitetura BFF, reduzindo o acoplamento entre o app e os serviços internos (NestJS, Prisma ORM, TypeScript).",
          "Reestruturei a comunicação entre APIs para que mensagens de cliente não se perdessem em picos de volume (Google Pub/Sub).",
          "Integrei a camada BFF a serviços legados escritos em Java e Kotlin, sem exigir reescrita desses serviços.",
          "Participei da definição de escopo e prazo com o time de produto e da validação com QA antes de cada deploy em produção.",
        ],
      },
    ],
    stack: ["typescript", "nestjs", "prisma", "kotlin"],
    highlight: true,
  },
  {
    slug: "b2k",
    company: "b2k Technology Solutions",
    companyUrl: "https://www.linkedin.com/company/b2k-technology-solutions/",
    role: "Desenvolvedor Mobile",
    engagement: "meio período",
    location: "Curitiba, Paraná, Brasil",
    mode: "remoto",
    start: "2022-05",
    end: "2024-04",
    summary: [
      "Aplicativo de gestão de equipamentos agrícolas, usado em campo, onde não existe internet garantida.",
    ],
    groups: [
      {
        title: null,
        bullets: [
          "Desenvolvi o app para operar 100% offline e sincronizar quando a conexão volta (React Native, Expo, TypeScript).",
          "Implementei configuração e monitoramento de equipamento por Bluetooth, eliminando a necessidade de técnico no local para ajustes.",
          "Entreguei dashboards de horas trabalhadas, deslocamento e velocidade dos equipamentos.",
          "Otimizei o app para rodar em aparelhos antigos e de baixo desempenho.",
        ],
      },
    ],
    stack: ["react-native", "typescript"],
  },
  {
    slug: "spro",
    company: "SPRO IT Solutions",
    companyUrl: "https://www.linkedin.com/company/spro-it-solutions/",
    role: "Desenvolvedor Full-Stack",
    location: "Curitiba, Paraná, Brasil",
    mode: "remoto",
    start: "2022-01",
    end: "2024-04",
    summary: [
      "Soluções sob medida para o setor agro, do levantamento de requisitos à entrega.",
    ],
    groups: [
      {
        title: null,
        bullets: [
          "Coordenei o time de desenvolvimento e fui o ponto de contato técnico com o cliente.",
          "Conduzi projetos do zero: levantei requisitos com quem ia usar, defini a arquitetura e acompanhei até a produção.",
          "Modelei bancos de dados para suportar crescimento de volume (MongoDB, PostgreSQL, Prisma, TypeORM).",
          "Montei pipeline de CI/CD para build, testes e publicação automatizados (Azure DevOps).",
          "Construí backend em Node.js com Express e Fastify e as interfaces em React Native.",
        ],
      },
    ],
    stack: ["react-native", "nodejs", "fastify", "mongodb", "postgresql"],
  },
  {
    slug: "ztrax",
    company: "ztrax",
    companyUrl: "https://www.linkedin.com/company/ztrax/",
    role: "Desenvolvedor Full-Stack",
    location: "Curitiba, Paraná, Brasil",
    mode: "presencial",
    start: "2021-06",
    end: "2022-01",
    summary: [
      "Modernização de sistema legado em produção, sem interromper a operação.",
    ],
    groups: [
      {
        title: null,
        bullets: [
          "Migrei uma aplicação em jQuery para React e Next.js de forma gradual, mantendo o sistema disponível durante a transição.",
          "Reduzi o tempo de carregamento das telas mais usadas.",
          "Construí APIs REST em Node.js para sustentar a nova arquitetura de front-end.",
          "Traduzi requisito de negócio em decisão técnica junto a stakeholders não-técnicos (AWS, TypeScript, PostgreSQL, MongoDB).",
        ],
      },
    ],
    stack: ["react", "nextjs", "nodejs"],
  },
  {
    slug: "mobilesys",
    company: "MobileSys Sistemas",
    companyUrl: "https://www.linkedin.com/company/mobilesys-sistemas/",
    role: "Desenvolvedor Front-end",
    location: "Pinhais, Paraná, Brasil",
    mode: "presencial",
    start: "2020-01",
    end: "2020-09",
    summary: [
      "Primeira experiência formal em desenvolvimento, com carta de referência da empresa.",
    ],
    groups: [
      {
        title: null,
        bullets: [
          "Implementei novas funcionalidades na plataforma em ReactJS, acompanhando a expansão do produto.",
          "Assumi manutenção e correção de bugs, sustentando a estabilidade do sistema em uso por clientes (Firebase, JavaScript, Git).",
        ],
      },
    ],
    stack: ["react", "javascript"],
  },
] as const satisfies readonly Experience[];
