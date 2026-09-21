/**
 * Layout base das imagens OG (1200×630): fundo e brilhos do banner do
 * LinkedIn, título grande, linha de apoio e rodapé com autor e domínio.
 *
 * Renderizado pelo `ImageResponse` de `next/og` (satori): só estilo inline e
 * `display: flex`.
 */
export const OG_SIZE = { width: 1200, height: 630 };

interface OgCardTemplateProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  author: string;
  domain: string;
}

export function OgCardTemplate({
  eyebrow,
  title,
  subtitle,
  author,
  domain,
}: OgCardTemplateProps) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        backgroundColor: "#0A0F1C",
        backgroundImage:
          "radial-gradient(circle at 88% 0%, rgba(99,102,241,0.35), transparent 45%), radial-gradient(circle at 0% 100%, rgba(45,212,191,0.28), transparent 45%)",
        fontFamily: "Geist",
        color: "#E2E8F0",
      }}
    >
      <div style={{ display: "flex", fontSize: 30, color: "#2DD4BF" }}>
        {eyebrow}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div
          style={{
            display: "flex",
            fontSize: title.length > 60 ? 60 : 76,
            fontWeight: 600,
            lineHeight: 1.1,
            color: "#F8FAFC",
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </div>
        {subtitle ? (
          <div style={{ display: "flex", fontSize: 34, color: "#94A3B8" }}>
            {subtitle}
          </div>
        ) : null}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 28,
          color: "#94A3B8",
        }}
      >
        <span>{author}</span>
        <span style={{ color: "#818CF8" }}>{domain}</span>
      </div>
    </div>
  );
}
