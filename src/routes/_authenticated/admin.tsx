import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

import { NomaButton } from "@/components/premium/NomaButton";
import { supabase } from "@/integrations/supabase/client";
import { claimFirstSuperAdmin, getAdminSession } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Painel — Lobo Cabanas" },
      { name: "description", content: "Painel administrativo das cabanas Lobo Cabanas." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Painel — Lobo Cabanas" },
      { property: "og:description", content: "Painel administrativo das cabanas Lobo Cabanas." },
    ],
  }),
  component: AdminLayout,
});

const NAV = [
  { to: "/admin", label: "Visão geral", exact: true },
  { to: "/admin/reservas", label: "Reservas" },
  { to: "/admin/calendario", label: "Calendário e tarifas" },
  { to: "/admin/equipe", label: "Equipe" },
  { to: "/admin/configuracoes", label: "Configurações" },
] as const;

export function useAdminSession() {
  const fetchSession = useServerFn(getAdminSession);
  return useQuery({
    queryKey: ["admin-session"],
    queryFn: () => fetchSession(),
    staleTime: 60_000,
  });
}

function AdminLayout() {
  const navigate = useNavigate();
  const { data: session, isPending, refetch } = useAdminSession();
  const claim = useServerFn(claimFirstSuperAdmin);

  async function signOut() {
    await supabase.auth.signOut();
    await navigate({ to: "/auth", search: {} });
  }

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-mist">
        Carregando painel…
      </div>
    );
  }

  if (!session?.hasAccess) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 text-center">
        <h1 className="font-display text-3xl text-ivory">Acesso pendente</h1>
        <p className="pt-3 text-sm text-mist">
          Sua conta ainda não tem permissão no painel. Se você é o proprietário e ainda não há
          nenhum administrador, assuma o acesso agora.
        </p>
        <div className="flex flex-col items-center gap-3 pt-8">
          <NomaButton
            onClick={async () => {
              const result = await claim({});
              toast[result.ok ? "success" : "error"](result.message);
              if (result.ok) await refetch();
            }}
          >
            Assumir como super admin
          </NomaButton>
          <button
            type="button"
            onClick={signOut}
            className="text-xs uppercase tracking-[0.18em] text-mist hover:text-ivory"
          >
            Sair
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4 px-6 py-5 lg:px-10">
          <div className="flex items-baseline gap-4">
            <Link to="/" className="font-display text-lg tracking-[0.3em] text-ivory">
              Lobo Cabanas
            </Link>
            <span className="text-[0.65rem] uppercase tracking-[0.22em] text-mist">
              {session.isSuperAdmin ? "Super admin" : "Cabana admin"}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-xs text-mist sm:block">
              {session.profile?.email ?? ""}
            </span>
            <NomaButton variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="size-3.5" /> Sair
            </NomaButton>
          </div>
        </div>
        <nav className="mx-auto flex max-w-[1400px] gap-7 overflow-x-auto px-6 pb-3 lg:px-10">
          {NAV.filter((item) => item.to !== "/admin/equipe" || session.isSuperAdmin).map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: "exact" in item ? item.exact : false }}
              activeProps={{ className: "text-ivory border-sage" }}
              className="shrink-0 border-b-2 border-transparent pb-2 text-[0.7rem] uppercase tracking-[0.18em] text-mist transition-colors hover:text-ivory"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-[1400px] px-6 py-10 lg:px-10">
        <Outlet />
      </main>
    </div>
  );
}