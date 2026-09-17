/**
 * Textos de interface de `/servicos`, das páginas de serviço e da seção da
 * home. O conteúdo de cada serviço fica em `content/pt-BR/servicos.ts`.
 */
import type {
  EvidenceKind,
  ServiceFaqItem,
} from "@/features/services/repository/types";

export const servicosPage = {
  /** Nome curto no menu e na trilha. */
  label: "Serviços",
  metaTitle: "Serviços de desenvolvimento",
  metaDescription:
    "Chatbot com IA, integração de sistemas, PIX, sistemas web, aplicativos, modernização de legado e infraestrutura. Atendimento remoto em todo o Brasil.",
  header: {
    eyebrow: "Serviços",
    title: "Serviços de desenvolvimento de software",
    description:
      "Para empresas de todo o Brasil, com atendimento remoto a partir de Curitiba. Cada serviço mostra o que é entregue e onde isso já foi feito.",
  },
  card: {
    more: "Ver serviço",
  },
  detail: {
    back: "Todos os serviços",
    forWho: "Para quem é",
    deliverables: "O que é entregue",
    process: "Como funciona",
    evidence: "Onde isso já foi feito",
    stack: "Tecnologias",
    faq: "Perguntas frequentes",
    note: "Importante",
    evidenceLink: "Ver detalhes",
  },
  evidenceKinds: {
    experiencia: "Experiência profissional",
    "projeto-proprio": "Projeto próprio",
    "codigo-aberto": "Código aberto",
  } satisfies Record<EvidenceKind, string>,
  /** Perguntas que valem para todos os serviços (entram depois das específicas). */
  commonFaq: [
    {
      question: "Atende empresas de outras cidades?",
      answer:
        "Sim. O trabalho é remoto, para empresas de todo o Brasil, a partir de Curitiba.",
    },
    {
      question: "Como começar?",
      answer:
        "Pelo formulário de contato, contando o problema e o que existe hoje. A resposta chega no e-mail informado.",
    },
  ] satisfies readonly ServiceFaqItem[],
  contact: {
    title: "Falar sobre este serviço",
    description:
      "Conte o problema e o que existe hoje. A resposta chega no e-mail informado.",
    cta: "Enviar mensagem",
  },
  catalogContact: {
    title: "Outro assunto",
    description:
      "Envie uma mensagem contando o problema e o que existe hoje. A resposta chega no e-mail informado.",
    cta: "Enviar mensagem",
  },
  home: {
    eyebrow: "Serviços",
    title: "Serviços para empresas",
    description:
      "Sistemas, integrações, aplicativos e infraestrutura, com base no que já foi feito em empresas e em projetos próprios.",
    all: "Ver todos os serviços",
    heroCta: "Serviços para empresas",
  },
} as const;
