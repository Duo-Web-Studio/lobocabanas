import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { NomaButton } from "@/components/premium/NomaButton";
import { PremiumModal } from "@/components/premium/PremiumModal";
import { PremiumSelect } from "@/components/premium/PremiumSelect";
import {
  getBookingDetails,
  listBookings,
  resendNotification,
  setBookingStatus,
} from "@/lib/admin.functions";
import { brl, formatLong, formatShort, guestLabel, nightsLabel } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/admin/reservas")({
  validateSearch: z.object({ status: z.string().optional().catch(undefined) }),
  component: AdminBookings,
});

const STATUS_LABEL: Record<string, string> = {
  pending: "Pendente",
  confirmed: "Confirmada",
  cancelled: "Cancelada",
  completed: "Concluída",
};

const STATUS_OPTIONS = [
  { value: "all", label: "Todas" },
  { value: "pending", label: "Pendentes" },
  { value: "confirmed", label: "Confirmadas" },
  { value: "completed", label: "Concluídas" },
  { value: "cancelled", label: "Canceladas" },
];

function AdminBookings() {
  const search = Route.useSearch();
  const [status, setStatus] = useState(search.status ?? "all");
  const [openId, setOpenId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const fetchBookings = useServerFn(listBookings);
  const fetchDetails = useServerFn(getBookingDetails);
  const changeStatus = useServerFn(setBookingStatus);
  const resend = useServerFn(resendNotification);

  const { data: bookings, isPending } = useQuery({
    queryKey: ["admin-bookings", status],
    queryFn: () => fetchBookings({ data: { status } }),
  });

  const { data: details } = useQuery({
    queryKey: ["admin-booking", openId],
    queryFn: () => fetchDetails({ data: { id: openId! } }),
    enabled: Boolean(openId),
  });

  const statusMutation = useMutation({
    mutationFn: (input: { id: string; status: string }) => changeStatus({ data: input }),
    onSuccess: (result) => {
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      toast.success("Reserva atualizada.");
      void queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
      void queryClient.invalidateQueries({ queryKey: ["admin-booking"] });
      void queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
    },
  });

  const resendMutation = useMutation({
    mutationFn: (id: string) => resend({ data: { id } }),
    onSuccess: (result) => {
      toast[result.ok ? "success" : "error"](result.message);
      void queryClient.invalidateQueries({ queryKey: ["admin-booking"] });
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="font-display text-3xl text-ivory">Reservas</h1>
          <p className="pt-1 text-sm text-mist">
            {bookings?.length ?? 0} reserva(s) na visualização atual.
          </p>
        </div>
        <PremiumSelect
          label="Status"
          value={status}
          onValueChange={setStatus}
          options={STATUS_OPTIONS}
          className="w-44"
        />
      </div>

      {isPending ? <p className="text-sm text-mist">Carregando reservas…</p> : null}

      <div className="divide-y divide-border border-y border-border">
        {(bookings ?? []).map((booking) => (
          <button
            key={booking.id}
            type="button"
            onClick={() => setOpenId(booking.id)}
            className="flex w-full flex-wrap items-center justify-between gap-4 py-5 text-left transition-colors hover:bg-moss/10"
          >
            <div className="min-w-0">
              <p className="text-sm text-ivory">
                {booking.guest_name}
                <span className="pl-3 text-xs tracking-[0.18em] text-mist">
                  {booking.booking_code}
                </span>
              </p>
              <p className="pt-1 text-xs text-mist">
                {booking.cabins?.name} · {formatShort(booking.check_in)} →{" "}
                {formatShort(booking.check_out)} · {nightsLabel(booking.nights)} ·{" "}
                {guestLabel(booking.guests)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-ivory">{brl(Number(booking.total_amount))}</p>
              <p className="text-xs text-mist">{STATUS_LABEL[booking.status] ?? booking.status}</p>
            </div>
          </button>
        ))}
        {!isPending && (bookings ?? []).length === 0 ? (
          <p className="py-6 text-sm text-mist">Nenhuma reserva encontrada.</p>
        ) : null}
      </div>

      <PremiumModal
        open={Boolean(openId)}
        onOpenChange={(open) => setOpenId(open ? openId : null)}
        title={details?.booking?.booking_code ?? "Reserva"}
        description={details?.booking?.guest_name ?? undefined}
      >
        {details?.booking ? (
          <div className="space-y-6 text-sm">
            <div className="space-y-2">
              <Row label="Cabana" value={details.booking.cabins?.name ?? "—"} />
              <Row label="Check-in" value={formatLong(details.booking.check_in)} />
              <Row label="Check-out" value={formatLong(details.booking.check_out)} />
              <Row
                label="Hóspedes"
                value={`${details.booking.adults} adulto(s) · ${details.booking.children} criança(s)`}
              />
              <Row label="Telefone" value={details.booking.guest_phone} />
              <Row label="E-mail" value={details.booking.guest_email} />
              <Row label="Hospedagem" value={brl(Number(details.booking.accommodation_subtotal))} />
              <Row label="Limpeza" value={brl(Number(details.booking.cleaning_fee))} />
              <Row label="Total" value={brl(Number(details.booking.total_amount))} />
              {details.booking.notes ? (
                <p className="pt-2 text-xs leading-relaxed text-mist">{details.booking.notes}</p>
              ) : null}
            </div>

            <div className="border-t border-border pt-5">
              <p className="eyebrow">Noites</p>
              <div className="flex flex-wrap gap-2 pt-3 text-xs text-mist">
                {details.nights.map((night) => (
                  <span key={night.date} className="border border-border px-2 py-1">
                    {formatShort(night.date)} · {brl(Number(night.nightly_rate))}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t border-border pt-5">
              <p className="eyebrow">Notificações</p>
              <div className="space-y-2 pt-3 text-xs text-mist">
                {details.logs.length === 0 ? <p>Nenhum envio registrado.</p> : null}
                {details.logs.map((log) => (
                  <p key={log.id}>
                    {log.status === "sent" ? "Enviada" : "Falhou"} · {log.recipient}
                    {log.error_message ? ` · ${log.error_message}` : ""}
                  </p>
                ))}
              </div>
              <NomaButton
                variant="outline"
                size="sm"
                className="mt-4"
                disabled={resendMutation.isPending}
                onClick={() => resendMutation.mutate(details.booking!.id)}
              >
                Reenviar WhatsApp
              </NomaButton>
            </div>

            <div className="flex flex-wrap gap-2 border-t border-border pt-5">
              {(["confirmed", "completed", "cancelled"] as const).map((next) => (
                <NomaButton
                  key={next}
                  size="sm"
                  variant={next === "cancelled" ? "outline" : "solid"}
                  disabled={statusMutation.isPending || details.booking!.status === next}
                  onClick={() => statusMutation.mutate({ id: details.booking!.id, status: next })}
                >
                  {STATUS_LABEL[next]}
                </NomaButton>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-mist">Carregando…</p>
        )}
      </PremiumModal>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string | number | null }) {
  return (
    <div className="flex items-baseline justify-between gap-6">
      <span className="text-mist">{label}</span>
      <span className="text-right text-ivory">{value ?? "—"}</span>
    </div>
  );
}