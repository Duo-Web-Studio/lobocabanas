import { sendWhatsAppMessage } from "./whatsapp.server";

export type NotificationType = "booking_created" | "booking_confirmed" | "booking_cancelled";

const TITLES: Record<NotificationType, string> = {
  booking_created: "🌲 Nova reserva Lobo Cabanas",
  booking_confirmed: "✅ Reserva confirmada — Lobo Cabanas",
  booking_cancelled: "⚠️ Reserva cancelada — Lobo Cabanas",
};

const STATUS_LABEL: Record<string, string> = {
  pending: "Pendente",
  confirmed: "Confirmada",
  cancelled: "Cancelada",
  completed: "Concluída",
};

function brl(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(value);
}

function br(date: string): string {
  return date.split("-").reverse().join("/");
}

function digits(value?: string | null): string {
  return (value ?? "").replace(/\D/g, "");
}

/**
 * Server-side notification for the business / cabin owner.
 * Never throws: a failed notification must never break a persisted booking.
 */
export async function notifyBooking(
  bookingId: string,
  type: NotificationType,
): Promise<{ sent: number; failed: number }> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const { data: booking } = await supabaseAdmin
    .from("bookings")
    .select("*, cabins(id, name, whatsapp_number)")
    .eq("id", bookingId)
    .maybeSingle();

  if (!booking) return { sent: 0, failed: 0 };

  const { data: settings } = await supabaseAdmin
    .from("business_settings")
    .select("*")
    .order("created_at")
    .limit(1)
    .maybeSingle();

  const cabin = booking.cabins as { id: string; name: string; whatsapp_number: string | null } | null;

  if (settings && settings.whatsapp_notifications_enabled === false) {
    await supabaseAdmin
      .from("bookings")
      .update({ whatsapp_notification_status: "disabled" })
      .eq("id", bookingId);
    await supabaseAdmin.from("notification_logs").insert({
      booking_id: bookingId,
      type,
      channel: "whatsapp",
      status: "disabled",
      error_message: "Notificações de WhatsApp desativadas nas configurações.",
    });
    return { sent: 0, failed: 0 };
  }

  // Recipient resolution: business number, cabin owner number, or both.
  const target = settings?.notification_target ?? "business";
  const recipients = new Set<string>();

  const businessNumber = digits(settings?.notification_whatsapp ?? settings?.business_whatsapp);
  if (target === "business" || target === "both") {
    if (businessNumber) recipients.add(businessNumber);
  }

  if (target === "cabin_admin" || target === "both") {
    if (cabin?.whatsapp_number) recipients.add(digits(cabin.whatsapp_number));
    if (cabin?.id) {
      const { data: admins } = await supabaseAdmin
        .from("cabin_admins")
        .select("user_id")
        .eq("cabin_id", cabin.id);
      const ids = (admins ?? []).map((a) => a.user_id);
      if (ids.length > 0) {
        const { data: profiles } = await supabaseAdmin
          .from("profiles")
          .select("whatsapp_number")
          .in("id", ids);
        for (const profile of profiles ?? []) {
          if (profile.whatsapp_number) recipients.add(digits(profile.whatsapp_number));
        }
      }
    }
    // Fall back to the business number so a booking is never silent.
    if (recipients.size === 0 && businessNumber) recipients.add(businessNumber);
  }

  const message = [
    TITLES[type],
    "",
    `Reserva: ${booking.booking_code}`,
    `Cabana: ${cabin?.name ?? "—"}`,
    `Hóspede: ${booking.guest_name}`,
    `Telefone: ${booking.guest_phone}`,
    `Check-in: ${br(booking.check_in)}`,
    `Check-out: ${br(booking.check_out)}`,
    `Hóspedes: ${booking.guests}`,
    `Noites: ${booking.nights}`,
    `Valor: ${brl(Number(booking.total_amount))}`,
    `Status: ${STATUS_LABEL[booking.status] ?? booking.status}`,
    "",
    type === "booking_created"
      ? "Uma nova reserva foi realizada pelo site."
      : "Atualização de reserva registrada no painel.",
  ].join("\n");

  let sent = 0;
  let failed = 0;

  if (recipients.size === 0) {
    await supabaseAdmin.from("notification_logs").insert({
      booking_id: bookingId,
      type,
      channel: "whatsapp",
      status: "failed",
      error_message: "Nenhum número de destino configurado.",
    });
    failed = 1;
  }

  for (const recipient of recipients) {
    const result = await sendWhatsAppMessage(recipient, message);
    if (result.ok) {
      sent += 1;
      await supabaseAdmin.from("notification_logs").insert({
        booking_id: bookingId,
        type,
        recipient,
        channel: "whatsapp",
        status: "sent",
        provider_message_id: result.providerMessageId,
        sent_at: new Date().toISOString(),
      });
    } else {
      failed += 1;
      await supabaseAdmin.from("notification_logs").insert({
        booking_id: bookingId,
        type,
        recipient,
        channel: "whatsapp",
        status: "failed",
        error_message: result.error,
      });
    }
  }

  if (type === "booking_created" || sent > 0) {
    await supabaseAdmin
      .from("bookings")
      .update({
        whatsapp_notification_status: sent > 0 ? "sent" : "failed",
        whatsapp_notification_sent_at: sent > 0 ? new Date().toISOString() : null,
      })
      .eq("id", bookingId);
  }

  return { sent, failed };
}