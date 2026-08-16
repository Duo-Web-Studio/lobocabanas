import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";

import { getDashboard } from "@/lib/admin.functions";
import { brl, formatShort, guestLabel, nightsLabel } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminDashboard,
});

const STATUS_LABEL: Record<string, string> = {
  pending: "Pendente",
  confirmed: "Confirmada",
  cancelled: "Cancelada",
  completed: "Concluída",
};

function Metric({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="border border-border p-6">
      <p className="eyebrow">{label}</p>
      <p className="pt-3 font-display text-3xl text-ivory">{value}</p>
      {hint ? <p className="pt-1 text-xs text-mist">{hint}</p> : null}
    </div>
  );
}

function AdminDashboard() {
  const fetchDashboard = useServerFn(getDashboard);
  const { data, isPending } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: () => fetchDashboard(),
  });

  if (isPending || !data) {
    return <p className="text-sm text-mist">Carregando indicadores…</p>;
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-3xl text-ivory">Visão geral</h1>
        <p className="pt-1 text-sm text-mist">Reservas ativas e movimentação das cabanas.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric
          label="Pendentes"
          value={String(data.pendingCount)}
          hint="aguardando confirmação"
        />
        <Metric label="Confirmadas" value={String(data.confirmedCount)} />
        <Metric
          label="Receita prevista"
          value={brl(data.expectedRevenue)}
          hint={`${data.occupiedNights} noites ocupadas`}
        />
        <Metric
          label="Notificações falhas"
          value={String(data.failedNotifications)}
          hint="reenvie na tela de reservas"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="border border-border p-6">
          <p className="eyebrow">Check-ins hoje</p>
          <List rows={data.todayCheckIns} empty="Nenhum check-in hoje." />
        </section>
        <section className="border border-border p-6">
          <p className="eyebrow">Check-outs hoje</p>
          <List rows={data.todayCheckOuts} empty="Nenhum check-out hoje." />
        </section>
      </div>

      <section className="border border-border p-6">
        <div className="flex items-center justify-between">
          <p className="eyebrow">Próximas chegadas</p>
          <Link
            to="/admin/reservas"
            className="text-[0.7rem] uppercase tracking-[0.18em] text-mist hover:text-ivory"
          >
            Ver todas
          </Link>
        </div>
        <List rows={data.upcomingCheckIns} empty="Sem chegadas futuras." />
      </section>

      <section className="border border-border p-6">
        <p className="eyebrow">Reservas recentes</p>
        <div className="divide-y divide-border pt-2">
          {data.recent.map((booking) => (
            <Link
              key={booking.id}
              to="/admin/reservas"
              search={{ status: booking.status }}
              className="flex flex-wrap items-center justify-between gap-3 py-4 text-sm transition-colors hover:text-ivory"
            >
              <div>
                <p className="text-ivory">{booking.guest_name}</p>
                <p className="text-xs text-mist">
                  {booking.cabins?.name} · {formatShort(booking.check_in)} →{" "}
                  {formatShort(booking.check_out)} · {nightsLabel(booking.nights)} ·{" "}
                  {guestLabel(booking.guests)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-ivory">{brl(Number(booking.total_amount))}</p>
                <p className="text-xs text-mist">
                  {STATUS_LABEL[booking.status] ?? booking.status}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

type Row = {
  id: string;
  guest_name: string;
  guest_phone?: string | null;
  check_in: string;
  check_out: string;
  guests: number;
  nights: number;
  cabins?: { name: string } | null;
};

function List({ rows, empty }: { rows: Row[]; empty: string }) {
  if (rows.length === 0) return <p className="pt-4 text-sm text-mist">{empty}</p>;
  return (
    <div className="divide-y divide-border pt-2">
      {rows.map((row) => (
        <div key={row.id} className="flex items-center justify-between gap-3 py-3.5 text-sm">
          <div>
            <p className="text-ivory">{row.guest_name}</p>
            <p className="text-xs text-mist">
              {row.cabins?.name} · {guestLabel(row.guests)}
            </p>
          </div>
          <p className="text-xs text-mist">
            {formatShort(row.check_in)} → {formatShort(row.check_out)}
          </p>
        </div>
      ))}
    </div>
  );
}