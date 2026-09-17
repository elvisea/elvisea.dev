/** E-mail que chega para o Elvis quando alguém usa o formulário. */
import type { ContactInput } from "@/app/actions/contact/schema";
import { contatoPage } from "@/content/pt-BR/pages/contato";
import { site } from "@/content/pt-BR/site";
import { servicesRepository } from "@/features/services/repository/services-repository";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildContactEmail(input: ContactInput, receivedAt: Date) {
  const reason =
    contatoPage.fields.reason.options.find((o) => o.value === input.reason)
      ?.label ?? input.reason;
  const service = input.service
    ? (servicesRepository.findBySlug(input.service)?.shortTitle ??
      input.service)
    : undefined;
  const when = receivedAt.toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
  });

  const rows: [string, string][] = [
    ["Nome", input.name],
    ["E-mail", input.email],
    ["Empresa", input.company ?? "—"],
    ["Assunto", reason],
    ...(service ? [["Serviço", service] as [string, string]] : []),
    ["Recebido em", when],
  ];

  const text = [...rows.map(([k, v]) => `${k}: ${v}`), "", input.message].join(
    "\n",
  );

  const html = `<!doctype html><html lang="pt-BR"><body style="font-family:system-ui,sans-serif;color:#0f172a;line-height:1.5">
<h2 style="margin:0 0 16px">Nova mensagem pelo ${escapeHtml(site.domain)}</h2>
<table style="border-collapse:collapse">${rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#475569">${escapeHtml(k)}</td><td style="padding:4px 0">${escapeHtml(v)}</td></tr>`,
    )
    .join("")}</table>
<p style="white-space:pre-wrap;margin-top:16px;padding:12px;background:#f1f5f9;border-radius:8px">${escapeHtml(input.message)}</p>
</body></html>`;

  return {
    subject: `[${site.domain}] ${reason}${service ? ` (${service})` : ""}: ${input.name}`,
    text,
    html,
  };
}
