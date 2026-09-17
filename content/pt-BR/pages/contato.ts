/** Textos de `/contato`, do formulário e das mensagens da action. */
export const contatoPage = {
  metaTitle: "Contato",
  metaDescription:
    "Fale com Elvis Amancio sobre vagas, projetos ou outros assuntos.",
  header: {
    eyebrow: "Contato",
    title: "Enviar mensagem",
    description:
      "Para vagas, projetos ou outros assuntos. A resposta chega no e-mail informado.",
  },
  aside: {
    title: "Outros canais",
  },
  fields: {
    name: { label: "Nome", autoComplete: "name" },
    email: { label: "E-mail", autoComplete: "email" },
    company: {
      label: "Empresa",
      hint: "Opcional",
      autoComplete: "organization",
    },
    reason: {
      label: "Assunto",
      placeholder: "Selecione",
      options: [
        { value: "vaga", label: "Vaga de emprego" },
        { value: "projeto", label: "Projeto ou consultoria" },
        { value: "outro", label: "Outro assunto" },
      ],
    },
    message: { label: "Mensagem" },
    /** Campo isca (honeypot): invisível para pessoas, preenchido por robôs. */
    honeypot: { label: "Site (deixe em branco)" },
  },
  submit: "Enviar mensagem",
  submitting: "Enviando…",
  success: {
    title: "Mensagem enviada",
    description: "Obrigado pelo contato. Respondo pelo e-mail informado.",
    again: "Enviar outra mensagem",
  },
  home: {
    eyebrow: "Contato",
    title: "Vamos conversar",
    description: "Vagas, projetos ou outros assuntos.",
    cta: "Enviar mensagem",
  },
} as const;

export const contatoMessages = {
  nameRequired: "Informe seu nome.",
  nameTooLong: "Use no máximo 80 caracteres.",
  emailInvalid: "Informe um e-mail válido.",
  companyTooLong: "Use no máximo 100 caracteres.",
  reasonRequired: "Selecione o assunto.",
  messageTooShort: "Escreva pelo menos 20 caracteres.",
  messageTooLong: "Use no máximo 4.000 caracteres.",
  validationSummary: "Revise os campos destacados.",
  rateLimited:
    "Muitas mensagens em pouco tempo. Tente de novo em alguns minutos.",
  sendFailed:
    "Não foi possível enviar agora. Tente de novo mais tarde ou use o LinkedIn.",
} as const;
