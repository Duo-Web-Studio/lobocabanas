import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { NomaButton } from "@/components/premium/NomaButton";
import { PremiumInput } from "@/components/premium/PremiumInput";
import { PremiumSelect } from "@/components/premium/PremiumSelect";
import { getSettings, updateSettings } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/configuracoes")({
  component: AdminSettings,
});

type FormState = {
  business_name: string;
  business_whatsapp: string;
  notification_whatsapp: string;
  notification_target: "business" | "cabin_admin" | "both";
  whatsapp_notifications_enabled: boolean;
  instagram_url: string;
  contact_email: string;
  address: string;
};

function AdminSettings() {
  const fetchSettings = useServerFn(getSettings);
  const persist = useServerFn(updateSettings);
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FormState | null>(null);

  const { data: settings } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: () => fetchSettings(),
  });

  useEffect(() => {
    if (!settings || form) return;
    setForm({
      business_name: settings.business_name ?? "",
      business_whatsapp: settings.business_whatsapp ?? "",
      notification_whatsapp: settings.notification_whatsapp ?? "",
      notification_target: (settings.notification_target ?? "business") as FormState["notification_target"],
      whatsapp_notifications_enabled: settings.whatsapp_notifications_enabled ?? true,
      instagram_url: settings.instagram_url ?? "",
      contact_email: settings.contact_email ?? "",
      address: settings.address ?? "",
    });
  }, [settings, form]);

  const mutation = useMutation({
    mutationFn: () =>
      persist({
        data: {
          id: settings!.id,
          business_name: form!.business_name,
          business_whatsapp: form!.business_whatsapp || null,
          notification_whatsapp: form!.notification_whatsapp || null,
          notification_target: form!.notification_target,
          whatsapp_notifications_enabled: form!.whatsapp_notifications_enabled,
          instagram_url: form!.instagram_url || null,
          contact_email: form!.contact_email || null,
          address: form!.address || null,
        },
      }),
    onSuccess: (result) => {
      toast[result.ok ? "success" : "error"](
        result.ok ? "Configurações salvas." : result.message,
      );
      void queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
      void queryClient.invalidateQueries({ queryKey: ["business-info"] });
    },
  });

  if (!form) return <p className="text-sm text-mist">Carregando configurações…</p>;

  return (
    <div className="max-w-xl space-y-8">
      <div>
        <h1 className="font-display text-3xl text-ivory">Configurações</h1>
        <p className="pt-1 text-sm text-mist">Dados públicos e destino das notificações.</p>
      </div>

      <form
        className="space-y-6"
        onSubmit={(event) => {
          event.preventDefault();
          mutation.mutate();
        }}
      >
        <PremiumInput
          label="Nome do negócio"
          value={form.business_name}
          onChange={(event) => setForm({ ...form, business_name: event.target.value })}
        />
        <PremiumInput
          label="WhatsApp público"
          value={form.business_whatsapp}
          hint="Aparece no site para os hóspedes."
          onChange={(event) => setForm({ ...form, business_whatsapp: event.target.value })}
        />
        <PremiumInput
          label="WhatsApp de notificações"
          value={form.notification_whatsapp}
          hint="Recebe o aviso automático de nova reserva."
          onChange={(event) => setForm({ ...form, notification_whatsapp: event.target.value })}
        />
        <PremiumSelect
          label="Enviar notificações para"
          value={form.notification_target}
          onValueChange={(value) =>
            setForm({ ...form, notification_target: value as FormState["notification_target"] })
          }
          options={[
            { value: "business", label: "Número do negócio" },
            { value: "cabin_admin", label: "Responsável pela cabana" },
            { value: "both", label: "Ambos" },
          ]}
        />
        <label className="flex items-center gap-3 text-sm text-mist">
          <input
            type="checkbox"
            checked={form.whatsapp_notifications_enabled}
            onChange={(event) =>
              setForm({ ...form, whatsapp_notifications_enabled: event.target.checked })
            }
            className="size-4 accent-[var(--sage)]"
          />
          Notificações automáticas por WhatsApp ativas
        </label>
        <PremiumInput
          label="Instagram"
          value={form.instagram_url}
          onChange={(event) => setForm({ ...form, instagram_url: event.target.value })}
        />
        <PremiumInput
          label="E-mail de contato"
          type="email"
          value={form.contact_email}
          onChange={(event) => setForm({ ...form, contact_email: event.target.value })}
        />
        <PremiumInput
          label="Endereço"
          value={form.address}
          onChange={(event) => setForm({ ...form, address: event.target.value })}
        />
        <NomaButton type="submit" disabled={mutation.isPending}>
          Salvar configurações
        </NomaButton>
      </form>
    </div>
  );
}