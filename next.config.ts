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
  },

  /**
   * Next 16: em `next dev`, pedidos a `/_next/*` com Origin fora de localhost
   * recebem 403. Libera acesso pela rede local (ex.: testar no celular).
   * Só vale em development.
   */
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "172.*.*.*", "100.*.*.*"],
};

export default nextConfig;
