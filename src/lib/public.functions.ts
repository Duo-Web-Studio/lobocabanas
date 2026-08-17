import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const slugSchema = z.object({ slug: z.string().min(1).max(80) });

const calendarSchema = z.object({
  cabinId: z.string().uuid(),
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

const codeSchema = z.object({ code: z.string().min(4).max(20) });

export const listCabins = createServerFn({ method: "GET" }).handler(async () => {
  const { publicClient } = await import("./supabase-public.server");
  const { data, error } = await publicClient()
    .from("cabins")
    .select(
      "id, name, slug, short_description, location, max_guests, bedrooms, beds, bathrooms, base_price, cleaning_fee, cover_image, gallery, amenities, status",
    )
    .eq("status", "active")
    .order("display_order");
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const getCabin = createServerFn({ method: "GET" })
  .inputValidator((input: { slug: string }) => slugSchema.parse(input))
  .handler(async ({ data }) => {
    const { publicClient } = await import("./supabase-public.server");
    const { data: cabin, error } = await publicClient()
      .from("cabins")
      .select(
        "id, name, slug, description, short_description, location, max_guests, bedrooms, beds, bathrooms, base_price, cleaning_fee, cover_image, gallery, amenities, status",
      )
      .eq("slug", data.slug)
      .eq("status", "active")
      .maybeSingle();
    if (error) throw new Error(error.message);
    return cabin;
  });

export const getCabinCalendar = createServerFn({ method: "GET" })
  .inputValidator((input: { cabinId: string; from: string; to: string }) =>
    calendarSchema.parse(input),
  )
  .handler(async ({ data }) => {
    const { publicClient } = await import("./supabase-public.server");
    const { data: days, error } = await publicClient().rpc("cabin_calendar", {
      p_cabin_id: data.cabinId,
      p_from: data.from,
      p_to: data.to,
    });
    if (error) throw new Error(error.message);
    return (days ?? []).map((d) => ({
      date: d.date as string,
      price: Number(d.price),
      minNights: Number(d.min_nights),
      available: Boolean(d.is_available),
    }));
  });

export const getBusinessInfo = createServerFn({ method: "GET" }).handler(async () => {
  const { publicClient } = await import("./supabase-public.server");
  const { data, error } = await publicClient().rpc("public_business_info");
  if (error) throw new Error(error.message);
  const info = data?.[0];
  return {
    businessName: info?.business_name ?? "Lobo Cabanas",
    whatsapp: info?.business_whatsapp ?? null,
    instagram: info?.instagram_url ?? null,
    email: info?.contact_email ?? null,
    address: info?.address ?? null,
  };
});

export const getBookingByCode = createServerFn({ method: "GET" })
  .inputValidator((input: { code: string }) => codeSchema.parse(input))
  .handler(async ({ data }) => {
    const { publicClient } = await import("./supabase-public.server");
    const { data: rows, error } = await publicClient().rpc("public_booking_by_code", {
      p_code: data.code,
    });
    if (error) throw new Error(error.message);
    const booking = rows?.[0];
    if (!booking) return null;
    return {
      code: booking.booking_code,
      cabinName: booking.cabin_name,
      cabinSlug: booking.cabin_slug,
      checkIn: booking.check_in,
      checkOut: booking.check_out,
      nights: booking.nights,
      guests: booking.guests,
      subtotal: Number(booking.accommodation_subtotal),
      cleaningFee: Number(booking.cleaning_fee),
      total: Number(booking.total_amount),
      status: booking.status,
      firstName: booking.guest_first_name,
    };
  });