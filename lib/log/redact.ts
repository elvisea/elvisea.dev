/**
 * Mascaramento de dados pessoais para logs.
 *
 * Regra: logs nunca levam nome nem texto de mensagem; e-mail e IP só
 * parcialmente, o suficiente para diagnosticar (domínio, faixa de rede).
 */

/** `maria@example.com` → `m***@example.com`. Valor sem `@` vira `***`. */
export function maskEmail(email: string): string {
  const at = email.lastIndexOf("@");
  if (at <= 0) return "***";
  return `${email[0]}***${email.slice(at)}`;
}

/**
 * Faixa de rede do IP: IPv4 `/24` (`203.0.113.0/24`) e IPv6 `/48`.
 * Hash sem salt de IPv4 é reversível por força bruta; o prefixo não é.
 */
export function ipPrefix(ip: string): string {
  const value = ip.trim();
  const v4 = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.\d{1,3}$/.exec(value);
  if (v4) return `${v4[1]}.${v4[2]}.${v4[3]}.0/24`;
  if (value.includes(":")) {
    const groups = value.split(":").filter(Boolean).slice(0, 3);
    if (groups.length > 0) return `${groups.join(":")}::/48`;
  }
  return "unknown";
}
