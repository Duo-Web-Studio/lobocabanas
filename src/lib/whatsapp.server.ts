/**
 * WhatsApp delivery layer. Provider-agnostic on purpose: swapping the provider
 * means changing only `sendWhatsAppMessage`.
 * Credentials live in server-side env vars and never reach the browser.
 */

export type WhatsAppResult =
  | { ok: true; providerMessageId: string | null }
  | { ok: false; error: string };

export function whatsappConfigured(): boolean {
  return Boolean(
    process.env["WHATSAPP_ACCESS_TOKEN"] && process.env["WHATSAPP_PHONE_NUMBER_ID"],
  );
}

function normalize(phone: string): string {
  return phone.replace(/\D/g, "");
}

export async function sendWhatsAppMessage(to: string, body: string): Promise<WhatsAppResult> {
  const token = process.env["WHATSAPP_ACCESS_TOKEN"];
  const phoneNumberId = process.env["WHATSAPP_PHONE_NUMBER_ID"];
  const recipient = normalize(to);

  if (!recipient) return { ok: false, error: "Número de destino ausente." };
  if (!token || !phoneNumberId) {
    return {
      ok: false,
      error:
        "Provedor de WhatsApp não configurado (WHATSAPP_ACCESS_TOKEN / WHATSAPP_PHONE_NUMBER_ID).",
    };
  }

  try {
    const response = await fetch(`https://graph.facebook.com/v21.0/${phoneNumberId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: recipient,
        type: "text",
        text: { preview_url: false, body },
      }),
    });

    const payload = (await response.json().catch(() => null)) as {
      messages?: { id?: string }[];
      error?: { message?: string };
    } | null;

    if (!response.ok) {
      return {
        ok: false,
        error: payload?.error?.message ?? `Falha do provedor (HTTP ${response.status}).`,
      };
    }

    return { ok: true, providerMessageId: payload?.messages?.[0]?.id ?? null };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Erro desconhecido." };
  }
}