import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

import {
  addDays,
  addMonths,
  brl,
  dateToISO,
  isoToDate,
  monthLabel,
  nightsBetween,
  todayISO,
  WEEKDAYS_SHORT,
} from "@/lib/format";
import { getCabinCalendar } from "@/lib/public.functions";
import { cn } from "@/lib/utils";

export type CalendarDay = {
  date: string;
  price: number;
  minNights: number;
  available: boolean;
};

function monthStart(iso: string): string {
  const d = isoToDate(iso);
  d.setUTCDate(1);
  return dateToISO(d);
}

function monthEnd(iso: string): string {
  const d = isoToDate(iso);
  d.setUTCMonth(d.getUTCMonth() + 1);
  d.setUTCDate(0);
  return dateToISO(d);
}

function monthDays(iso: string): string[] {
  const start = monthStart(iso);
  const total = isoToDate(monthEnd(iso)).getUTCDate();
  return Array.from({ length: total }, (_, index) => addDays(start, index));
}

export function BookingCalendar({
  cabinId,
  checkIn,
  checkOut,
  onChange,
  months = 1,
  className,
}: {
  cabinId: string;
  checkIn: string | null;
  checkOut: string | null;
  onChange: (value: { checkIn: string | null; checkOut: string | null }) => void;
  months?: 1 | 2;
  className?: string;
}) {
  const today = todayISO();
  const [cursor, setCursor] = useState(() => monthStart(checkIn ?? today));
  const [hover, setHover] = useState<string | null>(null);

  const from = monthStart(cursor);
  const to = monthEnd(addMonths(cursor, months - 1 + 1));
  const fetchCalendar = useServerFn(getCabinCalendar);

  const { data, isPending } = useQuery({
    queryKey: ["calendar", cabinId, from, to],
    queryFn: () => fetchCalendar({ data: { cabinId, from, to } }),
    staleTime: 60_000,
  });

  const dayMap = useMemo(() => {
    const map = new Map<string, CalendarDay>();
    for (const day of data ?? []) map.set(day.date, day);
    return map;
  }, [data]);

  const canGoBack = monthStart(cursor) > monthStart(today);

  function rangeIsFree(start: string, end: string): boolean {
    for (let date = start; date < end; date = addDays(date, 1)) {
      const day = dayMap.get(date);
      if (day && !day.available) return false;
    }
    return true;
  }

  function handleSelect(date: string) {
    const day = dayMap.get(date);
    if (date < today || (day && !day.available)) return;

    if (!checkIn || (checkIn && checkOut)) {
      onChange({ checkIn: date, checkOut: null });
      return;
    }
    if (date <= checkIn) {
      onChange({ checkIn: date, checkOut: null });
      return;
    }
    if (!rangeIsFree(checkIn, date)) {
      onChange({ checkIn: date, checkOut: null });
      return;
    }
    const min = dayMap.get(checkIn)?.minNights ?? 1;
    if (nightsBetween(checkIn, date) < min) return;
    onChange({ checkIn, checkOut: date });
  }

  const previewEnd = checkIn && !checkOut && hover && hover > checkIn ? hover : checkOut;
  const minNightsForStart = checkIn ? (dayMap.get(checkIn)?.minNights ?? 1) : 1;

  return (
    <div className={cn("select-none", className)}>
      <div className="flex items-center justify-between pb-5">
        <button
          type="button"
          aria-label="Mês anterior"
          disabled={!canGoBack}
          onClick={() => setCursor(addMonths(cursor, -1))}
          className="rounded-full border border-border p-2 text-mist transition-colors duration-500 hover:border-sage hover:text-ivory disabled:opacity-25 disabled:hover:border-border"
        >
          <ChevronLeft className="size-4" />
        </button>
        <p className="font-display text-lg capitalize text-ivory">
          {months === 2
            ? `${monthLabel(cursor).split(" ")[0]} — ${monthLabel(addMonths(cursor, 1))}`
            : monthLabel(cursor)}
        </p>
        <button
          type="button"
          aria-label="Próximo mês"
          onClick={() => setCursor(addMonths(cursor, 1))}
          className="rounded-full border border-border p-2 text-mist transition-colors duration-500 hover:border-sage hover:text-ivory"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      <div className={cn("grid gap-8", months === 2 && "sm:grid-cols-2")}>
        {Array.from({ length: months }, (_, offset) => {
          const monthIso = addMonths(cursor, offset);
          const days = monthDays(monthIso);
          const leading = isoToDate(days[0]!).getUTCDay();
          return (
            <div key={monthIso}>
              {months === 2 ? (
                <p className="pb-3 text-center text-xs capitalize text-mist">
                  {monthLabel(monthIso)}
                </p>
              ) : null}
              <div className="grid grid-cols-7 gap-y-1 pb-2 text-center">
                {WEEKDAYS_SHORT.map((label, index) => (
                  <span key={index} className="text-[0.65rem] tracking-[0.15em] text-mist/50">
                    {label}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-y-1">
                {Array.from({ length: leading }, (_, index) => (
                  <span key={`pad-${index}`} />
                ))}
                {days.map((date) => {
                  const day = dayMap.get(date);
                  const past = date < today;
                  const blocked = past || (day ? !day.available : false);
                  const isStart = date === checkIn;
                  const isEnd = date === checkOut;
                  const inRange =
                    Boolean(checkIn && previewEnd) && date > checkIn! && date < previewEnd!;
                  const tooShort =
                    Boolean(checkIn) &&
                    !checkOut &&
                    date > checkIn! &&
                    nightsBetween(checkIn!, date) < minNightsForStart;

                  return (
                    <button
                      key={date}
                      type="button"
                      disabled={blocked || tooShort}
                      onMouseEnter={() => setHover(date)}
                      onMouseLeave={() => setHover(null)}
                      onClick={() => handleSelect(date)}
                      aria-label={date}
                      aria-pressed={isStart || isEnd}
                      className={cn(
                        "group relative flex h-11 flex-col items-center justify-center text-sm transition-colors duration-300",
                        blocked && "cursor-not-allowed text-mist/25 line-through decoration-1",
                        tooShort && "cursor-not-allowed text-mist/30",
                        !blocked && !tooShort && "text-ivory hover:bg-moss/25",
                        inRange && "bg-moss/20",
                        (isStart || isEnd) && "bg-sage text-background hover:bg-sage",
                      )}
                    >
                      <span className="leading-none">{isoToDate(date).getUTCDate()}</span>
                      {day && !blocked ? (
                        <span
                          className={cn(
                            "text-[0.55rem] leading-none opacity-0 transition-opacity duration-300 group-hover:opacity-70",
                            (isStart || isEnd) && "opacity-80",
                          )}
                        >
                          {brl(day.price)}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-5 text-[0.7rem] text-mist/70">
        <span>{isPending ? "Carregando disponibilidade…" : "Datas riscadas não disponíveis"}</span>
        {checkIn ? (
          <button
            type="button"
            onClick={() => onChange({ checkIn: null, checkOut: null })}
            className="uppercase tracking-[0.18em] text-mist transition-colors hover:text-ivory"
          >
            Limpar
          </button>
        ) : null}
      </div>
    </div>
  );
}