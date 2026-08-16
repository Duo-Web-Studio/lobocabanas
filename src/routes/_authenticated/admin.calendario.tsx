import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { NomaButton } from "@/components/premium/NomaButton";
import { PremiumInput } from "@/components/premium/PremiumInput";
import { PremiumSelect } from "@/components/premium/PremiumSelect";
import { useAdminSession } from "@/routes/_authenticated/admin";
import { blockDates, getCabinManagement, removeBlock, saveRates } from "@/lib/admin.functions";
import {
  addDays,
  addMonths,
  brl,
  dateToISO,
  formatShort,
  isoToDate,
  monthLabel,
  todayISO,
  WEEKDAYS_SHORT,
} from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin/calendario")({
  component: AdminCalendar,
});

function monthStart(iso: string) {
  const d = isoToDate(iso);
  d.setUTCDate(1);
  return dateToISO(d);
}

function monthEnd(iso: string) {
  const d = isoToDate(iso);
  d.setUTCMonth(d.getUTCMonth() + 1);
  d.setUTCDate(0);
  return dateToISO(d);
}

function AdminCalendar() {
  const { data: session } = useAdminSession();
  const cabins = session?.cabins ?? [];
  const [cabinId, setCabinId] = useState("");
  const [cursor, setCursor] = useState(() => monthStart(todayISO()));
  const [selected, setSelected] = useState<string[]>([]);
  const [price, setPrice] = useState("");
  const [minNights, setMinNights] = useState("");
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!cabinId && cabins[0]) setCabinId(cabins[0].id);
  }, [cabins, cabinId]);

  const from = monthStart(cursor);
  const to = monthEnd(cursor);

  const fetchManagement = useServerFn(getCabinManagement);
  const persistRates = useServerFn(saveRates);
  const createBlock = useServerFn(blockDates);
  const deleteBlock = useServerFn(removeBlock);

  const { data } = useQuery({
    queryKey: ["admin-cabin-month", cabinId, from],
    queryFn: () => fetchManagement({ data: { cabinId, from, to } }),
    enabled: Boolean(cabinId),
  });

  const rateMap = useMemo(
    () => new Map((data?.rates ?? []).map((rate) => [rate.date, rate])),
    [data],
  );
  const bookedDates = useMemo(() => {
    const set = new Set<string>();
    for (const booking of data?.bookings ?? []) {
      for (let date = booking.check_in; date < booking.check_out; date = addDays(date, 1)) {
        set.add(date);
      }
    }
    return set;
  }, [data]);
  const blockedDates = useMemo(() => {
    const set = new Set<string>();
    for (const block of data?.blocks ?? []) {
      for (let date = block.start_date; date <= block.end_date; date = addDays(date, 1)) {
        set.add(date);
      }
    }
    return set;
  }, [data]);

  const days = useMemo(() => {
    const total = isoToDate(to).getUTCDate();
    return Array.from({ length: total }, (_, index) => addDays(from, index));
  }, [from, to]);

  const ratesMutation = useMutation({
    mutationFn: (input: { isAvailable?: boolean }) =>
      persistRates({
        data: {
          cabinId,
          dates: selected,
          ...(price ? { price: Number(price) } : {}),
          ...(minNights ? { minNights: Number(minNights) } : {}),
          ...(input.isAvailable === undefined ? {} : { isAvailable: input.isAvailable }),
        },
      }),
    onSuccess: (result) => {
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      toast.success(`${result.updated} data(s) atualizada(s).`);
      setSelected([]);
      setPrice("");
      setMinNights("");
      void queryClient.invalidateQueries({ queryKey: ["admin-cabin-month"] });
      void queryClient.invalidateQueries({ queryKey: ["calendar", cabinId] });
    },
  });

  const blockMutation = useMutation({
    mutationFn: () =>
      createBlock({
        data: {
          cabinId,
          startDate: selected[0]!,
          endDate: selected[selected.length - 1]!,
          reason: "Bloqueio manual",
        },
      }),
    onSuccess: (result) => {
      toast[result.ok ? "success" : "error"](result.ok ? "Período bloqueado." : result.message);
      setSelected([]);
      void queryClient.invalidateQueries({ queryKey: ["admin-cabin-month"] });
      void queryClient.invalidateQueries({ queryKey: ["calendar", cabinId] });
    },
  });

  const unblockMutation = useMutation({
    mutationFn: (id: string) => deleteBlock({ data: { id } }),
    onSuccess: () => {
      toast.success("Bloqueio removido.");
      void queryClient.invalidateQueries({ queryKey: ["admin-cabin-month"] });
      void queryClient.invalidateQueries({ queryKey: ["calendar", cabinId] });
    },
  });

  function toggle(date: string) {
    setSelected((current) =>
      current.includes(date) ? current.filter((item) => item !== date) : [...current, date].sort(),
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="font-display text-3xl text-ivory">Calendário e tarifas</h1>
          <p className="pt-1 text-sm text-mist">
            Selecione datas para ajustar preço, estadia mínima ou disponibilidade.
          </p>
        </div>
        <PremiumSelect
          label="Cabana"
          value={cabinId}
          onValueChange={(value) => {
            setCabinId(value);
            setSelected([]);
          }}
          options={cabins.map((cabin) => ({ value: cabin.id, label: cabin.name }))}
          className="w-56"
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="border border-border p-6">
          <div className="flex items-center justify-between pb-5">
            <button
              type="button"
              aria-label="Mês anterior"
              onClick={() => setCursor(addMonths(cursor, -1))}
              className="rounded-full border border-border p-2 text-mist hover:border-sage hover:text-ivory"
            >
              <ChevronLeft className="size-4" />
            </button>
            <p className="font-display text-lg capitalize text-ivory">{monthLabel(cursor)}</p>
            <button
              type="button"
              aria-label="Próximo mês"
              onClick={() => setCursor(addMonths(cursor, 1))}
              className="rounded-full border border-border p-2 text-mist hover:border-sage hover:text-ivory"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 pb-2 text-center">
            {WEEKDAYS_SHORT.map((label, index) => (
              <span key={index} className="text-[0.65rem] tracking-[0.15em] text-mist/50">
                {label}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: isoToDate(from).getUTCDay() }, (_, index) => (
              <span key={`pad-${index}`} />
            ))}
            {days.map((date) => {
              const rate = rateMap.get(date);
              const booked = bookedDates.has(date);
              const blocked = blockedDates.has(date);
              const closed = rate ? !rate.is_available : false;
              const isSelected = selected.includes(date);
              return (
                <button
                  key={date}
                  type="button"
                  onClick={() => toggle(date)}
                  className={cn(
                    "flex h-16 flex-col items-center justify-center gap-0.5 border border-border text-xs transition-colors",
                    isSelected ? "border-sage bg-sage/20 text-ivory" : "text-mist hover:bg-moss/15",
                    booked && "bg-moss/30 text-ivory",
                    (blocked || closed) && !booked && "bg-destructive/15",
                  )}
                >
                  <span className="text-sm text-ivory">{isoToDate(date).getUTCDate()}</span>
                  <span>{rate ? brl(Number(rate.price)) : "—"}</span>
                  {booked ? <span className="text-[0.6rem]">reservado</span> : null}
                  {(blocked || closed) && !booked ? (
                    <span className="text-[0.6rem]">fechado</span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="border border-border p-6">
            <p className="eyebrow">{selected.length} data(s) selecionada(s)</p>
            <div className="space-y-5 pt-5">
              <PremiumInput
                label="Preço por noite (R$)"
                type="number"
                min={0}
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                placeholder="Manter atual"
              />
              <PremiumInput
                label="Estadia mínima (noites)"
                type="number"
                min={1}
                value={minNights}
                onChange={(event) => setMinNights(event.target.value)}
                placeholder="Manter atual"
              />
              <div className="flex flex-wrap gap-2">
                <NomaButton
                  size="sm"
                  disabled={selected.length === 0 || ratesMutation.isPending}
                  onClick={() => ratesMutation.mutate({})}
                >
                  Salvar tarifas
                </NomaButton>
                <NomaButton
                  size="sm"
                  variant="outline"
                  disabled={selected.length === 0 || ratesMutation.isPending}
                  onClick={() => ratesMutation.mutate({ isAvailable: false })}
                >
                  Fechar datas
                </NomaButton>
                <NomaButton
                  size="sm"
                  variant="outline"
                  disabled={selected.length === 0 || ratesMutation.isPending}
                  onClick={() => ratesMutation.mutate({ isAvailable: true })}
                >
                  Reabrir datas
                </NomaButton>
                <NomaButton
                  size="sm"
                  variant="gold"
                  disabled={selected.length === 0 || blockMutation.isPending}
                  onClick={() => blockMutation.mutate()}
                >
                  Bloquear período
                </NomaButton>
              </div>
            </div>
          </div>

          <div className="border border-border p-6">
            <p className="eyebrow">Bloqueios do mês</p>
            <div className="divide-y divide-border pt-3 text-sm">
              {(data?.blocks ?? []).length === 0 ? (
                <p className="py-3 text-mist">Nenhum bloqueio.</p>
              ) : null}
              {(data?.blocks ?? []).map((block) => (
                <div key={block.id} className="flex items-center justify-between gap-4 py-3">
                  <div>
                    <p className="text-ivory">
                      {formatShort(block.start_date)} → {formatShort(block.end_date)}
                    </p>
                    <p className="text-xs text-mist">{block.reason}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => unblockMutation.mutate(block.id)}
                    className="text-[0.65rem] uppercase tracking-[0.18em] text-mist hover:text-ivory"
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}