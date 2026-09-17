/**
 * Certificados. Fonte: `info_linkedin/knowledge-base/certification/`.
 *
 * Links: os encurtadores bit.ly do LinkedIn foram resolvidos para o destino
 * final (conferido em 16/09/2026, todos respondendo 200). Entradas sem data e
 * sem link ficam com `visible: false`.
 */
import type { Certificate } from "@/lib/content/types";

export const certificados = [
  {
    slug: "rocketseat-introducao-go",
    title: "Introdução ao Go",
    issuer: "Rocketseat",
    issued: "2025-03",
    url: "https://app.rocketseat.com.br/certificates/438289f5-b66a-430d-be59-a66b9b4ba889",
    visible: true,
  },
  {
    slug: "rocketseat-minicurso-java",
    title: "Minicurso de Java",
    issuer: "Rocketseat",
    issued: "2024-07",
    url: "https://app.rocketseat.com.br/certificates/38682567-01e9-411e-8522-10a584a3e9cd",
    visible: true,
  },
  {
    slug: "b7web-firebase",
    title: "Firebase",
    issuer: "B7Web",
    issued: "2021-04",
    url: "https://www.dropbox.com/scl/fi/l5y4qyiiqfrxkwcj2m9c7/Elvis-Certificado-Firebase-B7Web.jpg?rlkey=dfuiejgwnw3xove60r1lrdqyx&dl=0",
    visible: true,
  },
  {
    slug: "rocketseat-gostack",
    title: "GoStack",
    issuer: "Rocketseat",
    issued: "2021-03",
    url: "https://www.dropbox.com/scl/fi/nkrbfh9o1ooreqbk4rq9r/Elvis-GoStack-Rocketseat.png?rlkey=hm6rsa6q2mqyhlgvdifrb1i4w&dl=0",
    visible: true,
  },
  {
    slug: "rocketseat-dowhile-2020",
    title: "DoWhile 2020",
    issuer: "Rocketseat",
    issued: "2021-01",
    url: "https://www.dropbox.com/scl/fi/u0t815ky6s901wbdm4q37/Elvis-DoWhile-Rocketseat-Certificado.pdf?rlkey=nqgi7t51pd6p1zfjwzlo1uukz&dl=0",
    visible: true,
  },
  {
    slug: "rocketseat-semana-omnistack-11",
    title: "Semana OmniStack 11",
    issuer: "Rocketseat",
    issued: "2020-03",
    url: "https://www.dropbox.com/scl/fi/0a6ewuba14x2xqvgtnq4x/elvis.e.amancio-gmail.com.pdf?rlkey=c8oy6y6u0epaershse07lozkd&dl=0",
    visible: true,
  },
  {
    slug: "fundacao-bradesco-processo-desenvolvimento-software",
    title: "Processo de Desenvolvimento de Software",
    issuer: "Fundação Bradesco",
    issued: null,
    url: "https://www.dropbox.com/scl/fi/nfekhe76xvgo2f63ta4tx/Processo-de-Desenvolvimento-de-Software.pdf?rlkey=rwsyfx0y922tp3k4sol8gqt21&dl=0",
    visible: true,
  },
  {
    slug: "fundacao-bradesco-engenharia-requisitos",
    title: "Engenharia de Requisitos",
    issuer: "Fundação Bradesco",
    issued: null,
    url: "https://www.dropbox.com/scl/fi/eq8qypb0s56oi13pj3b4d/ENGENHARIA-DE-REQUISITOS.pdf?rlkey=jh9bqvlt80ijia37491x0hekf&dl=0",
    visible: true,
  },
  {
    slug: "curso-em-video-mysql",
    title: "Banco de Dados com MySQL",
    issuer: "Curso em Vídeo",
    issued: null,
    url: "https://www.dropbox.com/scl/fi/fuz5rlwqn5qqmc5vplwzv/Curso-De-MySQL.pdf?rlkey=thu7x8dtzg89uq6hagmgbf9bn&dl=0",
    visible: true,
  },
  {
    slug: "curso-em-video-php",
    title: "PHP",
    issuer: "Curso em Vídeo",
    issued: null,
    url: "https://www.dropbox.com/scl/fi/gm09vqyx26q9596d9wf7x/Curso-De-PHP.pdf?rlkey=spv7b2qcnwaegb4s6049b8kf8&dl=0",
    visible: true,
  },
  {
    slug: "curso-em-video-html5",
    title: "HTML5",
    issuer: "Curso em Vídeo",
    issued: null,
    url: "https://www.dropbox.com/scl/fi/pep7fa7ykm321q42z68de/HTML5-CSS3.pdf?rlkey=533pniwo9wjyhkba4akcb9eb5&dl=0",
    visible: true,
  },
  {
    slug: "rocketseat-nodejs",
    title: "Node.js",
    issuer: "Rocketseat",
    issued: null,
    url: null,
    visible: false,
  },
  {
    slug: "rocketseat-reactjs",
    title: "ReactJS",
    issuer: "Rocketseat",
    issued: null,
    url: null,
    visible: false,
  },
  {
    slug: "rocketseat-react-native",
    title: "React Native",
    issuer: "Rocketseat",
    issued: null,
    url: null,
    visible: false,
  },
  {
    slug: "rocketseat-javascript",
    title: "JavaScript",
    issuer: "Rocketseat",
    issued: null,
    url: null,
    visible: false,
  },
  {
    slug: "rocketseat-javascript-es6",
    title: "JavaScript ES6+",
    issuer: "Rocketseat",
    issued: null,
    url: null,
    visible: false,
  },
] as const satisfies readonly Certificate[];
