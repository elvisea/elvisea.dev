/**
 * Link `wa.me` com mensagem pré-preenchida. `number` no formato internacional
 * só com dígitos (país + DDD + número), como pede o WhatsApp.
 */
export function whatsappHref(number: string, message?: string): string {
  const digits = number.replace(/\D/g, "");
  if (digits.length < 12 || digits.length > 13) {
    throw new Error(`Número de WhatsApp inválido: ${number}`);
  }
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
