import { MessageCircle } from "lucide-react";

import { generalMessage, waLink } from "@/lib/whatsapp-link";

export function WhatsAppFab({ whatsapp }: { whatsapp?: string | null }) {
  return (
    <a
      href={waLink(whatsapp, generalMessage())}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex size-13 items-center justify-center rounded-full border border-sage/40 bg-moss/80 text-ivory shadow-[var(--shadow-lift)] backdrop-blur-md transition-all duration-500 hover:bg-moss"
    >
      <MessageCircle className="size-5" />
    </a>
  );
}