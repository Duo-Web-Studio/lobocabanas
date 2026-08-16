import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { BookingCalendar } from "@/components/booking/BookingCalendar";
import { GuestSelector } from "@/components/booking/GuestSelector";
import { useBooking } from "@/components/booking/booking-store";
import { NomaButton } from "@/components/premium/NomaButton";
import { PremiumInput, PremiumTextarea } from "@/components/premium/PremiumInput";
import { createBooking } from "@/lib/booking.functions";
import { brl, formatRange, guestLabel, nightsLabel } from "@/lib/format";
import { cabinDatesMessage, waLink } from "@/lib/whatsapp-link";

type Cabin = {
  id: string;
  name: string;
  slug: string;
  base_price: number;
  cleaning_fee: number;
  max_guests: number;
};

type Errors = Partial<Record<"guestName" | "guestEmail" | "guestPhone", string>>;

export function BookingPanel({
  cabin,
  whatsapp,
}: {
  cabin: Cabin;
  whatsapp?: string | null;
}) {
  const booking = useBooking();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const submit = useServerFn(createBooking);

  const [step, setStep] = useState<"dates" | "details">("dates");
  const [form, setForm] = useState({
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    guestDocument: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [estimate, setEstimate] = useState<number | null>(null);

  const checkIn = booking.cabinId === cabin.id ? booking.checkIn : null;
  const checkOut = booking.cabinId === cabin.id ? booking.checkOut : null;
  const nights = checkIn && checkOut ? booking.nights : 0;

  const accommodation = useMemo(
    () => (estimate !== null ? estimate : nights * Number(cabin.base_price)),
    [estimate, nights, cabin.base_price],
  );
  const total = nights > 0 ? accommodation + Number(cabin.cleaning_fee) : 0;

  const mutation = useMutation({
    mutationFn: () =>
      submit({
        data: {
          cabinId: cabin.id,
          checkIn: checkIn!,
          checkOut: checkOut!,
          adults: booking.adults,
          children: booking.children,
          guestName: form.guestName.trim(),
          guestEmail: form.guestEmail.trim(),
          guestPhone: form.guestPhone.trim(),
          guestDocument: form.guestDocument.trim(),
          notes: form.notes.trim(),
        },
      }),
    onSuccess: (result) => {
      if (!result.ok) {
        toast.error(result.message);
        if (result.code === "DATES_UNAVAILABLE" || result.code === "MIN_NIGHTS") {
          void queryClient.invalidateQueries({ queryKey: ["calendar", cabin.id] });
          booking.set({ checkIn: null, checkOut: null });
          setStep("dates");
        }
        return;
      }
      booking.reset();
      void navigate({ to: "/reserva/sucesso", search: { code: result.code } });
    },
    onError: () => toast.error("Não foi possível concluir a reserva. Tente novamente."),
  });

  function validate(): boolean {
    const next: Errors = {};
    if (form.guestName.trim().length < 3) next.guestName = "Informe seu nome completo.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.guestEmail.trim()))
      next.guestEmail = "E-mail inválido.";
    if (form.guestPhone.replace(/\D/g, "").length < 10)
      next.guestPhone = "Informe um WhatsApp válido com DDD.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  return (
    <div className="glass min-w-0 p-5 sm:p-8">
      <div className="flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <p className="eyebrow">A partir de</p>
          <p className="pt-1 font-display text-2xl text-ivory sm:text-3xl">
            {brl(Number(cabin.base_price))}
            <span className="pl-2 text-sm text-mist">/ noite</span>
          </p>
        </div>
        <p className="text-xs text-mist sm:text-right">
          até {cabin.max_guests} hóspedes
          <span className="hidden sm:inline">
            <br />
          </span>
          <span className="sm:hidden"> · </span>
          taxa de limpeza {brl(Number(cabin.cleaning_fee))}
        </p>
      </div>

      {step === "dates" ? (
        <div className="pt-6">
          <BookingCalendar
            cabinId={cabin.id}
            checkIn={checkIn}
            checkOut={checkOut}
            onChange={({ checkIn: nextIn, checkOut: nextOut }) => {
              setEstimate(null);
              booking.set({
                cabinId: cabin.id,
                cabinSlug: cabin.slug,
                cabinName: cabin.name,
                checkIn: nextIn,
                checkOut: nextOut,
              });
            }}
            onRangePrice={setEstimate}
          />

          <div className="border-t border-border pt-2">
            <GuestSelector
              adults={booking.adults}
              children={booking.children}
              maxGuests={cabin.max_guests}
              onChange={(value) => booking.set(value)}
            />
          </div>

          {nights > 0 ? (
            <div className="space-y-2 border-t border-border pt-5 text-sm">
              <div className="flex justify-between gap-3 text-mist">
                <span className="min-w-0">
                  {nightsLabel(nights)} · {formatRange(checkIn, checkOut)}
                </span>
                <span className="shrink-0">{brl(accommodation)}</span>
              </div>
              <div className="flex justify-between gap-3 text-mist">
                <span>Taxa de limpeza</span>
                <span className="shrink-0">{brl(Number(cabin.cleaning_fee))}</span>
              </div>
              <div className="flex items-baseline justify-between gap-3 pt-3 text-ivory">
                <span className="eyebrow">Total</span>
                <span className="shrink-0 font-display text-2xl">{brl(total)}</span>
              </div>
            </div>
          ) : null}

          <NomaButton
            className="mt-6 w-full"
            size="lg"
            disabled={nights === 0}
            onClick={() => setStep("details")}
          >
            {nights === 0 ? "Selecione as datas" : "Continuar"}
            {nights > 0 ? <ArrowRight className="size-3.5" /> : null}
          </NomaButton>
        </div>
      ) : (
        <form
          className="space-y-5 pt-6"
          onSubmit={(event) => {
            event.preventDefault();
            if (!checkIn || !checkOut) {
              setStep("dates");
              return;
            }
            if (validate()) mutation.mutate();
          }}
        >
          <div className="flex items-center justify-between gap-3 border-b border-border pb-4 text-sm">
            <div className="min-w-0">
              <p className="truncate text-ivory">{formatRange(checkIn, checkOut)}</p>
              <p className="truncate text-xs text-mist">
                {nightsLabel(nights)} · {guestLabel(booking.totalGuests)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setStep("dates")}
              className="shrink-0 text-[0.7rem] uppercase tracking-[0.18em] text-mist transition-colors hover:text-ivory"
            >
              Alterar
            </button>
          </div>

          <PremiumInput
            label="Nome completo"
            value={form.guestName}
            error={errors.guestName}
            autoComplete="name"
            onChange={(event) => setForm({ ...form, guestName: event.target.value })}
          />
          <PremiumInput
            label="E-mail"
            type="email"
            value={form.guestEmail}
            error={errors.guestEmail}
            autoComplete="email"
            onChange={(event) => setForm({ ...form, guestEmail: event.target.value })}
          />
          <PremiumInput
            label="WhatsApp"
            value={form.guestPhone}
            error={errors.guestPhone}
            autoComplete="tel"
            placeholder="(11) 99999-9999"
            onChange={(event) => setForm({ ...form, guestPhone: event.target.value })}
          />
          <PremiumInput
            label="CPF (opcional)"
            value={form.guestDocument}
            onChange={(event) => setForm({ ...form, guestDocument: event.target.value })}
          />
          <PremiumTextarea
            label="Observações (opcional)"
            value={form.notes}
            maxLength={600}
            placeholder="Chegada prevista, ocasião especial…"
            onChange={(event) => setForm({ ...form, notes: event.target.value })}
          />

          <div className="flex items-baseline justify-between gap-3 border-t border-border pt-4">
            <span className="eyebrow">Total</span>
            <span className="shrink-0 font-display text-2xl text-ivory">{brl(total)}</span>
          </div>

          <NomaButton type="submit" size="lg" className="w-full" disabled={mutation.isPending}>
            {mutation.isPending ? (
              <>
                <Loader2 className="size-3.5 animate-spin" /> Confirmando
              </>
            ) : (
              "Confirmar reserva"
            )}
          </NomaButton>
          <p className="text-center text-xs text-mist/70">
            Sem pagamento online. Confirmamos os detalhes com você pelo WhatsApp.
          </p>
        </form>
      )}

      <a
        href={waLink(
          whatsapp,
          checkIn && checkOut
            ? cabinDatesMessage(cabin.name, checkIn, checkOut, booking.totalGuests)
            : `Olá! Gostaria de saber mais sobre a Cabana ${cabin.name}.`,
        )}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 block"
      >
        <NomaButton variant="whatsapp" className="w-full" type="button">
          Tirar dúvida no WhatsApp
        </NomaButton>
      </a>
    </div>
  );
}