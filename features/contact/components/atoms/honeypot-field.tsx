/**
 * Isca para robôs: fora da tela, fora da ordem de tabulação e da árvore de
 * acessibilidade. Inputs nativos de propósito (exceção aceita no AGENTS.md):
 * componentes do Base UI acrescentam comportamento (foco, estados) que não
 * cabe num campo oculto.
 */
export function HoneypotField({ label }: { label: string }) {
  return (
    <div
      aria-hidden
      className="absolute -left-[9999px] h-px w-px overflow-hidden"
    >
      <label htmlFor="contato-website">{label}</label>
      <input
        autoComplete="off"
        id="contato-website"
        name="website"
        tabIndex={-1}
        type="text"
      />
    </div>
  );
}
