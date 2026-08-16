import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { nightsBetween } from "@/lib/format";

export type BookingSelection = {
  cabinId: string | null;
  cabinSlug: string | null;
  cabinName: string | null;
  checkIn: string | null;
  checkOut: string | null;
  adults: number;
  children: number;
};

const EMPTY: BookingSelection = {
  cabinId: null,
  cabinSlug: null,
  cabinName: null,
  checkIn: null,
  checkOut: null,
  adults: 2,
  children: 0,
};

const STORAGE_KEY = "noma.booking.selection";

type Store = BookingSelection & {
  totalGuests: number;
  nights: number;
  set: (patch: Partial<BookingSelection>) => void;
  reset: () => void;
};

const BookingContext = createContext<Store | null>(null);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [selection, setSelection] = useState<BookingSelection>(EMPTY);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) setSelection({ ...EMPTY, ...(JSON.parse(raw) as BookingSelection) });
    } catch {
      /* ignore */
    }
  }, []);

  const set = useCallback((patch: Partial<BookingSelection>) => {
    setSelection((current) => {
      const next = { ...current, ...patch };
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setSelection(EMPTY);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<Store>(
    () => ({
      ...selection,
      totalGuests: selection.adults + selection.children,
      nights:
        selection.checkIn && selection.checkOut
          ? nightsBetween(selection.checkIn, selection.checkOut)
          : 0,
      set,
      reset,
    }),
    [selection, set, reset],
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking(): Store {
  const context = useContext(BookingContext);
  if (!context) throw new Error("useBooking must be used inside BookingProvider");
  return context;
}