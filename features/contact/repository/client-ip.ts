/**
 * IP do cliente a partir do header confiável (`TRUSTED_IP_HEADER`, ex.:
 * `cf-connecting-ip` atrás da Cloudflare). O padrão é o primeiro valor de
 * `x-forwarded-for`, que só é confiável se o proxy o sobrescrever.
 */
export function getClientIp(
  headers: Pick<Headers, "get">,
  trustedHeader = "x-forwarded-for",
): string {
  const value = headers.get(trustedHeader);
  return value?.split(",")[0]?.trim() || "unknown";
}
