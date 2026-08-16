import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";

import { NomaButton } from "@/components/premium/NomaButton";
import { PremiumSelect } from "@/components/premium/PremiumSelect";
import {
  assignCabinAdmin,
  grantRole,
  listStaff,
  removeCabinAdmin,
} from "@/lib/admin.functions";
import { useAdminSession } from "@/routes/_authenticated/admin";

export const Route = createFileRoute("/_authenticated/admin/equipe")({
  component: AdminStaff,
});

function AdminStaff() {
  const { data: session } = useAdminSession();
  const queryClient = useQueryClient();
  const fetchStaff = useServerFn(listStaff);
  const assign = useServerFn(assignCabinAdmin);
  const unassign = useServerFn(removeCabinAdmin);
  const setRole = useServerFn(grantRole);
  const [cabinByUser, setCabinByUser] = useState<Record<string, string>>({});

  const { data } = useQuery({ queryKey: ["admin-staff"], queryFn: () => fetchStaff() });

  function invalidate() {
    void queryClient.invalidateQueries({ queryKey: ["admin-staff"] });
    void queryClient.invalidateQueries({ queryKey: ["admin-session"] });
  }

  const roleMutation = useMutation({
    mutationFn: (input: { userId: string; role: string }) => setRole({ data: input }),
    onSuccess: (result) => {
      toast[result.ok ? "success" : "error"](result.ok ? "Papel atualizado." : result.message);
      invalidate();
    },
  });

  const assignMutation = useMutation({
    mutationFn: (input: { userId: string; cabinId: string }) => assign({ data: input }),
    onSuccess: (result) => {
      toast[result.ok ? "success" : "error"](result.ok ? "Cabana atribuída." : result.message);
      invalidate();
    },
  });

  const unassignMutation = useMutation({
    mutationFn: (id: string) => unassign({ data: { id } }),
    onSuccess: () => {
      toast.success("Atribuição removida.");
      invalidate();
    },
  });

  if (!session?.isSuperAdmin) {
    return <p className="text-sm text-mist">Apenas super admins gerenciam a equipe.</p>;
  }

  const cabinOptions = (session.cabins ?? []).map((cabin) => ({
    value: cabin.id,
    label: cabin.name,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-ivory">Equipe</h1>
        <p className="pt-1 text-sm text-mist">
          Defina papéis e quais cabanas cada responsável administra.
        </p>
      </div>

      <div className="divide-y divide-border border-y border-border">
        {(data?.profiles ?? []).map((profile) => {
          const roles = (data?.roles ?? [])
            .filter((role) => role.user_id === profile.id)
            .map((role) => role.role);
          const assignments = (data?.assignments ?? []).filter(
            (item) => item.user_id === profile.id,
          );
          return (
            <div key={profile.id} className="space-y-4 py-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-ivory">{profile.full_name || profile.email}</p>
                  <p className="text-xs text-mist">
                    {profile.email} · {roles.length ? roles.join(", ") : "sem papel"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <NomaButton
                    size="sm"
                    variant="outline"
                    disabled={roles.includes("cabin_admin")}
                    onClick={() =>
                      roleMutation.mutate({ userId: profile.id, role: "cabin_admin" })
                    }
                  >
                    Tornar cabin admin
                  </NomaButton>
                  <NomaButton
                    size="sm"
                    variant="gold"
                    disabled={roles.includes("super_admin")}
                    onClick={() =>
                      roleMutation.mutate({ userId: profile.id, role: "super_admin" })
                    }
                  >
                    Tornar super admin
                  </NomaButton>
                </div>
              </div>

              <div className="flex flex-wrap items-end gap-4">
                <PremiumSelect
                  label="Atribuir cabana"
                  value={cabinByUser[profile.id] ?? cabinOptions[0]?.value ?? ""}
                  onValueChange={(value) =>
                    setCabinByUser({ ...cabinByUser, [profile.id]: value })
                  }
                  options={cabinOptions}
                  className="w-48"
                />
                <NomaButton
                  size="sm"
                  disabled={assignMutation.isPending}
                  onClick={() =>
                    assignMutation.mutate({
                      userId: profile.id,
                      cabinId: cabinByUser[profile.id] ?? cabinOptions[0]?.value ?? "",
                    })
                  }
                >
                  Atribuir
                </NomaButton>
                <div className="flex flex-wrap gap-2">
                  {assignments.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => unassignMutation.mutate(item.id)}
                      className="border border-border px-3 py-1.5 text-xs text-mist hover:border-destructive hover:text-ivory"
                    >
                      {item.cabins?.name} ✕
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}