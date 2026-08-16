import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const getAdminSession = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const [{ data: roles }, { data: profile }] = await Promise.all([
      supabase.from("user_roles").select("role").eq("user_id", userId),
      supabase.from("profiles").select("id, full_name, email, whatsapp_number").eq("id", userId).maybeSingle(),
    ]);
    const roleList = (roles ?? []).map((r) => r.role);
    const isSuper = roleList.includes("super_admin");

    let cabinIds: string[] | null = null;
    if (!isSuper) {
      const { data: assignments } = await supabase
        .from("cabin_admins")
        .select("cabin_id")
        .eq("user_id", userId);
      cabinIds = (assignments ?? []).map((a) => a.cabin_id);
    }

    let cabinsQuery = supabase
      .from("cabins")
      .select("id, name, slug, base_price, cleaning_fee, max_guests, status")
      .order("display_order");
    if (cabinIds) cabinsQuery = cabinsQuery.in("id", cabinIds.length ? cabinIds : ["00000000-0000-0000-0000-000000000000"]);
    const { data: cabins } = await cabinsQuery;

    return {
      userId,
      profile: profile ?? null,
      roles: roleList,
      isSuperAdmin: isSuper,
      hasAccess: roleList.length > 0,
      cabins: cabins ?? [],
    };
  });

/** Bootstrap: the very first signed-in account can claim super admin. */
export const claimFirstSuperAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { count } = await supabaseAdmin
      .from("user_roles")
      .select("id", { count: "exact", head: true })
      .eq("role", "super_admin");
    if ((count ?? 0) > 0) return { ok: false as const, message: "Já existe um super admin." };
    const { error } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: context.userId, role: "super_admin" });
    if (error) return { ok: false as const, message: error.message };
    return { ok: true as const, message: "Acesso de super admin concedido." };
  });

export const getDashboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const today = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(
      new Date(),
    );

    const { data: bookings } = await supabase
      .from("bookings")
      .select(
        "id, booking_code, guest_name, check_in, check_out, guests, nights, total_amount, status, created_at, whatsapp_notification_status, cabin_id, cabins(name)",
      )
      .order("created_at", { ascending: false })
      .limit(300);

    const list = bookings ?? [];
    const active = list.filter((b) => b.status === "pending" || b.status === "confirmed");

    return {
      today,
      todayCheckIns: active.filter((b) => b.check_in === today),
      todayCheckOuts: active.filter((b) => b.check_out === today),
      upcomingCheckIns: active.filter((b) => b.check_in > today).slice(0, 6),
      pendingCount: list.filter((b) => b.status === "pending").length,
      confirmedCount: list.filter((b) => b.status === "confirmed").length,
      expectedRevenue: active
        .filter((b) => b.check_out >= today)
        .reduce((sum, b) => sum + Number(b.total_amount), 0),
      occupiedNights: active
        .filter((b) => b.check_out >= today)
        .reduce((sum, b) => sum + b.nights, 0),
      recent: list.slice(0, 8),
      failedNotifications: list.filter((b) => b.whatsapp_notification_status === "failed").length,
    };
  });

export const listBookings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { status?: string; cabinId?: string }) =>
    z.object({ status: z.string().optional(), cabinId: z.string().uuid().optional() }).parse(input ?? {}),
  )
  .handler(async ({ data, context }) => {
    let query = context.supabase
      .from("bookings")
      .select(
        "id, booking_code, guest_name, guest_phone, check_in, check_out, guests, nights, total_amount, status, created_at, whatsapp_notification_status, cabin_id, cabins(name)",
      )
      .order("created_at", { ascending: false })
      .limit(500);
    if (data.status && data.status !== "all") query = query.eq("status", data.status as never);
    if (data.cabinId) query = query.eq("cabin_id", data.cabinId);
    const { data: rows, error } = await query;
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const getBookingDetails = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: booking } = await supabase
      .from("bookings")
      .select("*, cabins(id, name, slug)")
      .eq("id", data.id)
      .maybeSingle();
    if (!booking) return null;
    const [{ data: nights }, { data: logs }] = await Promise.all([
      supabase.from("booking_nights").select("date, nightly_rate").eq("booking_id", data.id).order("date"),
      supabase
        .from("notification_logs")
        .select("id, type, recipient, status, error_message, created_at, sent_at")
        .eq("booking_id", data.id)
        .order("created_at", { ascending: false }),
    ]);
    return { booking, nights: nights ?? [], logs: logs ?? [] };
  });

export const setBookingStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string; status: string }) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.enum(["pending", "confirmed", "cancelled", "completed"]),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("bookings")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) return { ok: false as const, message: error.message };

    if (data.status === "confirmed" || data.status === "cancelled") {
      try {
        const { notifyBooking } = await import("./notifications.server");
        await notifyBooking(
          data.id,
          data.status === "confirmed" ? "booking_confirmed" : "booking_cancelled",
        );
      } catch (error_) {
        console.error("notification failed", error_);
      }
    }
    return { ok: true as const };
  });

export const resendNotification = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    // RLS: returns nothing when the caller does not manage this cabin.
    const { data: booking } = await context.supabase
      .from("bookings")
      .select("id")
      .eq("id", data.id)
      .maybeSingle();
    if (!booking) return { ok: false as const, message: "Acesso negado a esta reserva." };

    const { notifyBooking } = await import("./notifications.server");
    const result = await notifyBooking(data.id, "booking_created");
    return result.sent > 0
      ? { ok: true as const, message: "Notificação enviada." }
      : { ok: false as const, message: "Não foi possível enviar a notificação. Veja o histórico." };
  });

export const getCabinManagement = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { cabinId: string; from: string; to: string }) =>
    z.object({ cabinId: z.string().uuid(), from: isoDate, to: isoDate }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const [{ data: cabin }, { data: rates }, { data: blocks }, { data: bookings }] =
      await Promise.all([
        supabase
          .from("cabins")
          .select("id, name, slug, base_price, cleaning_fee, max_guests")
          .eq("id", data.cabinId)
          .maybeSingle(),
        supabase
          .from("cabin_daily_rates")
          .select("date, price, min_nights, is_available")
          .eq("cabin_id", data.cabinId)
          .gte("date", data.from)
          .lte("date", data.to),
        supabase
          .from("cabin_blocked_dates")
          .select("id, start_date, end_date, reason")
          .eq("cabin_id", data.cabinId)
          .lte("start_date", data.to)
          .gte("end_date", data.from),
        supabase
          .from("bookings")
          .select("id, booking_code, guest_name, check_in, check_out, status")
          .eq("cabin_id", data.cabinId)
          .in("status", ["pending", "confirmed"])
          .lt("check_in", data.to)
          .gt("check_out", data.from),
      ]);
    if (!cabin) throw new Error("Cabana não encontrada ou acesso negado.");
    return { cabin, rates: rates ?? [], blocks: blocks ?? [], bookings: bookings ?? [] };
  });

export const saveRates = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (input: {
      cabinId: string;
      dates: string[];
      price?: number;
      minNights?: number;
      isAvailable?: boolean;
    }) =>
      z
        .object({
          cabinId: z.string().uuid(),
          dates: z.array(isoDate).min(1).max(400),
          price: z.number().min(0).max(1_000_000).optional(),
          minNights: z.number().int().min(1).max(30).optional(),
          isAvailable: z.boolean().optional(),
        })
        .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: cabin } = await supabase
      .from("cabins")
      .select("id, base_price")
      .eq("id", data.cabinId)
      .maybeSingle();
    if (!cabin) return { ok: false as const, message: "Acesso negado a esta cabana." };

    const { data: existing } = await supabase
      .from("cabin_daily_rates")
      .select("date, price, min_nights, is_available")
      .eq("cabin_id", data.cabinId)
      .in("date", data.dates);
    const byDate = new Map((existing ?? []).map((r) => [r.date, r]));

    const rows = data.dates.map((date) => {
      const current = byDate.get(date);
      return {
        cabin_id: data.cabinId,
        date,
        price: data.price ?? Number(current?.price ?? cabin.base_price),
        min_nights: data.minNights ?? current?.min_nights ?? 1,
        is_available: data.isAvailable ?? current?.is_available ?? true,
      };
    });

    const { error } = await supabase
      .from("cabin_daily_rates")
      .upsert(rows, { onConflict: "cabin_id,date" });
    if (error) return { ok: false as const, message: error.message };
    return { ok: true as const, updated: rows.length };
  });

export const blockDates = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { cabinId: string; startDate: string; endDate: string; reason?: string }) =>
    z
      .object({
        cabinId: z.string().uuid(),
        startDate: isoDate,
        endDate: isoDate,
        reason: z.string().trim().max(200).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    if (data.endDate < data.startDate) {
      return { ok: false as const, message: "Período inválido." };
    }
    const { error } = await context.supabase.from("cabin_blocked_dates").insert({
      cabin_id: data.cabinId,
      start_date: data.startDate,
      end_date: data.endDate,
      reason: data.reason ?? "Bloqueio manual",
      created_by: context.userId,
    });
    if (error) return { ok: false as const, message: error.message };
    return { ok: true as const };
  });

export const removeBlock = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("cabin_blocked_dates")
      .delete()
      .eq("id", data.id);
    if (error) return { ok: false as const, message: error.message };
    return { ok: true as const };
  });

export const getSettings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("business_settings")
      .select("*")
      .order("created_at")
      .limit(1)
      .maybeSingle();
    return data ?? null;
  });

export const updateSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        business_name: z.string().trim().min(2).max(120),
        business_whatsapp: z.string().trim().max(30).nullable(),
        notification_whatsapp: z.string().trim().max(30).nullable(),
        notification_target: z.enum(["business", "cabin_admin", "both"]),
        whatsapp_notifications_enabled: z.boolean(),
        instagram_url: z.string().trim().max(200).nullable(),
        contact_email: z.string().trim().max(180).nullable(),
        address: z.string().trim().max(300).nullable(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { id, ...patch } = data;
    const { error } = await context.supabase.from("business_settings").update(patch).eq("id", id);
    if (error) return { ok: false as const, message: error.message };
    return { ok: true as const };
  });

export const listStaff = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: profiles } = await context.supabase
      .from("profiles")
      .select("id, full_name, email, whatsapp_number");
    const { data: roles } = await context.supabase.from("user_roles").select("user_id, role");
    const { data: assignments } = await context.supabase
      .from("cabin_admins")
      .select("id, cabin_id, user_id, cabins(name)");
    return {
      profiles: profiles ?? [],
      roles: roles ?? [],
      assignments: assignments ?? [],
    };
  });

export const assignCabinAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { userId: string; cabinId: string }) =>
    z.object({ userId: z.string().uuid(), cabinId: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("cabin_admins")
      .insert({ user_id: data.userId, cabin_id: data.cabinId });
    if (error) return { ok: false as const, message: error.message };
    return { ok: true as const };
  });

export const removeCabinAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("cabin_admins").delete().eq("id", data.id);
    if (error) return { ok: false as const, message: error.message };
    return { ok: true as const };
  });

export const grantRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { userId: string; role: string }) =>
    z
      .object({ userId: z.string().uuid(), role: z.enum(["super_admin", "cabin_admin"]) })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { data: isSuper } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "super_admin",
    });
    if (!isSuper) return { ok: false as const, message: "Apenas super admins podem alterar papéis." };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id: data.userId, role: data.role }, { onConflict: "user_id,role" });
    if (error) return { ok: false as const, message: error.message };
    return { ok: true as const };
  });

export const updateOwnProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { fullName: string; whatsapp: string }) =>
    z
      .object({ fullName: z.string().trim().max(120), whatsapp: z.string().trim().max(30) })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("profiles")
      .update({ full_name: data.fullName, whatsapp_number: data.whatsapp })
      .eq("id", context.userId);
    if (error) return { ok: false as const, message: error.message };
    return { ok: true as const };
  });