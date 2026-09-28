import { siWhatsapp } from "simple-icons";

import type { WhatsAppButtonViewModel } from "@/features/layout/shell/view-model/get-layout-view-model";

/** Botão flutuante, no canto inferior direito, que abre a conversa no WhatsApp. */
export function WhatsAppButton({ model }: { model: WhatsAppButtonViewModel }) {
  return (
    <a
      aria-label={model.label}
      className="fixed right-4 bottom-4 z-50 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none motion-reduce:transition-none sm:right-6 sm:bottom-6"
      href={model.href}
      rel="noopener noreferrer"
      target="_blank"
    >
      <svg
        aria-hidden
        className="size-7 fill-current"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d={siWhatsapp.path} />
      </svg>
    </a>
  );
}
