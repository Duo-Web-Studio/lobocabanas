import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const createSchema = z
  .object({
    cabinId: z.string().uuid(),
    checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    adults: z.number().int().min(1).max(20),
    children: z.number().int().min(0).max(20),
    guestName: z.string().trim().min(3, "Informe seu nome completo.").max(120),
    guestEmail: z.string().trim().email("E-mail inválido.").max(180),
    guestPhone: z.string().trim().min(10, "Telefone inválido.").max(30),
    guestDocument: z.string().trim().max(40).optional().or(z.literal("")),
    notes: z.string().trim().max(600).optional().or(z.literal("")),
  })
  .refine((v) => v.checkOut > v.checkIn, { message: "Check-out deve ser após o check-in." });

const ERROR_MESSAGES: Record<string, string> = {
  CABIN_UNAVAILABLE: "Esta cabana não está disponível para reservas.",
  INVALID_DATES: "Selecione um período válido de pelo menos uma noite.",
  PAST_DATES: "Não é possível reservar datas passadas.",
  INVALID_GUESTS: "Informe ao menos um adulto.",
  CAPACITY_EXCEEDED: "Esta cabana não acomoda essa quantidade de hóspedes.",
  INVALID_GUEST_DATA: "Verifique nome, telefone e e-mail informados.",
  DATES_UNAVAILABLE:
    "Essas datas acabaram de ficar indisponíveis. Outro hóspede concluiu uma reserva para este período.",
};

function translate(message: string): { message: string; code: string } {
  const minNights = message.match(/MIN_NIGHTS_(\d+)/);
  if (minNights) {
    return {
      code: "MIN_NIGHTS",
      message: `Esta data exige estadia mínima de ${minNights[1]} noites.`,
    };
  }
  for (const key of Object.keys(ERROR_MESSAGES)) {
    if (message.includes(key)) return { code: key, message: ERROR_MESSAGES[key]! };
  }
  return { code: "UNKNOWN", message: "Não foi possível concluir a reserva. Tente novamente." };
}

/**
 * Creates a booking. All validation, price recalculation and the
 * double-booking guard happen inside the database function `create_booking`,
 * which takes a per-cabin transaction lock before re-checking availability.
 */
export const createBooking = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => createSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: booking, error } = await supabaseAdmin.rpc("create_booking", {
      p_cabin_id: data.cabinId,
      p_check_in: data.checkIn,
      p_check_out: data.checkOut,
      p_adults: data.adults,
      p_children: data.children,
      p_guest_name: data.guestName,
      p_guest_email: data.guestEmail,
      p_guest_phone: data.guestPhone,
      ...(data.guestDocument ? { p_guest_document: data.guestDocument } : {}),
      ...(data.notes ? { p_notes: data.notes } : {}),
    });

    if (error) {
      const translated = translate(error.message);
      return { ok: false as const, ...translated };
    }

    const created = booking as unknown as { id: string; booking_code: string };

    // The booking is already persisted: a WhatsApp failure must not undo it.
    try {
      const { notifyBooking } = await import("./notifications.server");
      await notifyBooking(created.id, "booking_created");
    } catch (notificationError) {
      console.error("WhatsApp notification failed", notificationError);
    }

    return { ok: true as const, code: created.booking_code };
  });