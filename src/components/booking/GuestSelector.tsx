import { Minus, Plus } from "lucide-react";

import { cn } from "@/lib/utils";

function Row({
  label,
  hint,
  value,
  onChange,
  min,
  max,
}: {
  label: string;
  hint: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
}) {
  return (
    <div className="flex items-center justify-between py-3.5">
      <div>
        <p className="text-sm text-ivory">{label}</p>
        <p className="text-xs text-mist/70">{hint}</p>
      </div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-label={`Diminuir ${label}`}
          disabled={value <= min}
          onClick={() => onChange(value - 1)}
          className="rounded-full border border-border p-1.5 text-mist transition-colors hover:border-sage hover:text-ivory disabled:opacity-25"
        >
          <Minus className="size-3.5" />
        </button>
        <span className="w-5 text-center text-sm text-ivory">{value}</span>
        <button
          type="button"
          aria-label={`Aumentar ${label}`}
          disabled={value >= max}
          onClick={() => onChange(value + 1)}
          className="rounded-full border border-border p-1.5 text-mist transition-colors hover:border-sage hover:text-ivory disabled:opacity-25"
        >
          <Plus className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

export function GuestSelector({
  adults,
  children,
  maxGuests,
  onChange,
  className,
}: {
  adults: number;
  children: number;
  maxGuests: number;
  onChange: (value: { adults: number; children: number }) => void;
  className?: string;
}) {
  const total = adults + children;
  return (
    <div className={cn("divide-y divide-border", className)}>
      <Row
        label="Adultos"
        hint="13 anos ou mais"
        value={adults}
        min={1}
        max={maxGuests - children}
        onChange={(value) => onChange({ adults: value, children })}
      />
      <Row
        label="Crianças"
        hint="Até 12 anos"
        value={children}
        min={0}
        max={maxGuests - adults}
        onChange={(value) => onChange({ adults, children: value })}
      />
      <p className="pt-3 text-xs text-mist/70">
        Capacidade máxima: {maxGuests} hóspedes · selecionados: {total}
      </p>
    </div>
  );
}