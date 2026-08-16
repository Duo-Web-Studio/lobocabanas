import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Check } from "lucide-react";
import { motion } from "motion/react";
import { z } from "zod";

import { SiteLayout, useBusinessInfo } from "@/components/layout/SiteLayout";
import { NomaButton } from "@/components/premium/NomaButton";
import { brl, formatLong, guestLabel, nightsLabel } from "@/lib/format";
import { getBookingByCode } from "@/lib/public.functions";
import { bookingDoneMessage, waLink } from "@/lib/whatsapp-link";

const TITLE = "Reserva confirmada — NOMA Forest Cabins";
const DESCRIPTION = "Sua solicitação de reserva foi registrada. Confira os detalhes da estadia.";

export const Route = createFileRoute("/reserva/sucesso")({
  validateSearch: z.object({ code: z.string().min(4).max(20).catch("") }),
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: SuccessPage,
});

function SuccessPage() {
  const { code } = Route.useSearch();
  const fetchBooking = useServerFn(getBookingByCode);
  const { data: business } = useBusinessInfo();

  const { data: booking, isPending } = useQuery({
    queryKey: ["booking", code],
    queryFn: () => fetchBooking({ data: { code } }),
    enabled: code.length >= 4,
  });

  return (
    <SiteLayout>
      <section className="mx-auto flex min-h-[80svh] max-w-2xl flex-col justify-center px-6 py-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="flex size-14 items-center justify-center rounded-full border border-sage/50"
        >
          <Check className="size-6 text-sage" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 1 }}
          className="pt-8 font-display text-[clamp(2rem,6vw,3.5rem)] leading-tight text-ivory"
        >
          {booking?.firstName ? `${booking.firstName}, está reservado.` : "Está reservado."}
        </motion.h1>
        <p className="max-w-md pt-4 leading-relaxed text-mist">
          Recebemos sua solicitação e vamos confirmar os últimos detalhes com você pelo WhatsApp. A
          floresta já sabe que você vem.
        </p>

        <div className="mt-10 glass p-7">
          {isPending && code ? (
            <p className="text-sm text-mist">Carregando reserva…</p>
          ) : booking ? (
            <div className="space-y-4 text-sm">
              <div className="flex items-baseline justify-between border-b border-border pb-4">
                <span className="eyebrow">Código</span>
                <span className="font-display text-2xl tracking-[0.15em] text-ivory">
                  {booking.code}
                </span>
              </div>
              <Row label="Cabana" value={booking.cabinName} />
              <Row label="Check-in" value={`${formatLong(booking.checkIn)} · a partir das 15h`} />
              <Row label="Check-out" value={`${formatLong(booking.checkOut)} · até 11h`} />
              <Row
                label="Estadia"
                value={`${nightsLabel(booking.nights)} · ${guestLabel(booking.guests)}`}
              />
              <Row label="Hospedagem" value={brl(booking.subtotal)} />
              <Row label="Taxa de limpeza" value={brl(booking.cleaningFee)} />
              <div className="flex items-baseline justify-between border-t border-border pt-4">
                <span className="eyebrow">Total</span>
                <span className="font-display text-2xl text-ivory">{brl(booking.total)}</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-mist">
              Não encontramos essa reserva. Se você acabou de reservar, fale com a gente pelo
              WhatsApp com o código recebido.
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-3 pt-8">
          <a
            href={waLink(business?.whatsapp, bookingDoneMessage(booking?.code ?? code))}
            target="_blank"
            rel="noopener noreferrer"
          >
            <NomaButton variant="whatsapp" size="lg">
              Confirmar no WhatsApp
            </NomaButton>
          </a>
          <Link to="/">
            <NomaButton variant="outline" size="lg">
              Voltar ao início
            </NomaButton>
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}

function Row({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-baseline justify-between gap-6">
      <span className="text-mist">{label}</span>
      <span className="text-right text-ivory">{value}</span>
    </div>
  );
}