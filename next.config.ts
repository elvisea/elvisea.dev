import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  /**
   * Garante que os `.md` do blog acompanhem o build standalone (Docker).
   * As páginas são geradas em build, mas o trace protege contra leitura
   * tardia do filesystem.
   */
  outputFileTracingIncludes: {
    "/blog/**": ["./content/pt-BR/blog/posts/**/*.md"],
    "/como-trabalho": ["./content/pt-BR/como-trabalho.md"],
    "/projetos/**": ["./content/pt-BR/projetos/casos/**/*.md"],
  },

  /**
   * Next 16: em `next dev`, pedidos a `/_next/*` com Origin fora de localhost
   * recebem 403. Libera acesso pela rede local (ex.: testar no celular).
   * Só vale em development.
   */
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "172.*.*.*", "100.*.*.*"],

  /**
   * Desliga a linha `└─ ƒ submitContact(...)` do `next dev`: ela trunca os
   * argumentos e expõe dados digitados. Os eventos do formulário saem pelo
   * logger estruturado (`lib/log/logger.ts`). Só afeta desenvolvimento.
   */
  logging: {
    serverFunctions: false,
  },

  /**
   * Rotas do portfólio antigo (Next 15, em inglês) que podem estar indexadas
   * ou em links externos. 308 transfere a relevância para as rotas novas.
   * Não remover: links antigos continuam existindo fora do site.
   */
  async redirects() {
    return [
      {
        source: "/experiences/:slug*",
        destination: "/experiencia",
        permanent: true,
      },
      { source: "/projects/:name*", destination: "/projetos", permanent: true },
      { source: "/contact", destination: "/contato", permanent: true },
    ];
  },
};

export default nextConfig;
