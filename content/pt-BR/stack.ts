/**
 * Stack agrupada por área. Base: bloco STACK do "Sobre" e competências
 * publicadas no LinkedIn. Sem nível de proficiência (decisão de conteúdo).
 *
 * `key` é usada em `experiencias.ts`; `icon` é o export de `simple-icons`.
 */
import type { StackGroup } from "@/lib/content/types";

export const stack = [
  {
    title: "Linguagens",
    items: [
      { key: "typescript", label: "TypeScript", icon: "siTypescript" },
      { key: "javascript", label: "JavaScript", icon: "siJavascript" },
      { key: "elixir", label: "Elixir", icon: "siElixir" },
      { key: "java", label: "Java", icon: "siOpenjdk" },
      { key: "kotlin", label: "Kotlin", icon: "siKotlin" },
    ],
  },
  {
    title: "Back-end",
    items: [
      { key: "nodejs", label: "Node.js", icon: "siNodedotjs" },
      { key: "nestjs", label: "NestJS", icon: "siNestjs" },
      { key: "express", label: "Express", icon: "siExpress" },
      { key: "fastify", label: "Fastify", icon: "siFastify" },
      { key: "phoenix", label: "Phoenix", icon: "siPhoenixframework" },
    ],
  },
  {
    title: "Front-end e mobile",
    items: [
      { key: "react", label: "React", icon: "siReact" },
      { key: "nextjs", label: "Next.js", icon: "siNextdotjs" },
      { key: "react-native", label: "React Native", icon: "siReact" },
    ],
  },
  {
    title: "Dados",
    items: [
      { key: "postgresql", label: "PostgreSQL", icon: "siPostgresql" },
      { key: "mongodb", label: "MongoDB", icon: "siMongodb" },
      { key: "clickhouse", label: "ClickHouse", icon: "siClickhouse" },
      { key: "prisma", label: "Prisma", icon: "siPrisma" },
    ],
  },
  {
    title: "Infraestrutura e entrega",
    items: [
      { key: "docker", label: "Docker", icon: "siDocker" },
      { key: "ansible", label: "Ansible", icon: "siAnsible" },
      { key: "linux", label: "Linux", icon: "siLinux" },
      { key: "cicd", label: "CI/CD", icon: "siGithubactions" },
    ],
  },
] as const satisfies readonly StackGroup[];
