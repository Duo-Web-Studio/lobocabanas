import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { NomaButton } from "@/components/premium/NomaButton";
import { PremiumInput } from "@/components/premium/PremiumInput";
import { supabase } from "@/integrations/supabase/client";

const TITLE = "Acesso da equipe — Lobo Cabanas";
const DESCRIPTION = "Área restrita para a equipe Lobo Cabanas gerenciar reservas, tarifas e disponibilidade.";

export const Route = createFileRoute("/auth")({
  validateSearch: z.object({ redirect: z.string().optional().catch(undefined) }),
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: AuthPage,
});

function safePath(value?: string): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/admin";
  return value;
}

function normalizeAuthError(message: string): string {
  if (message.includes("Invalid login credentials")) return "E-mail ou senha incorretos.";
  if (message.includes("Email not confirmed")) return "E-mail ainda não confirmado. Verifique sua caixa de entrada.";
  if (message.includes("weak_password") || message.includes("Password is known")) return "Senha muito fraca. Use uma senha mais forte.";
  if (message.includes("User already registered")) return "Este e-mail já está cadastrado.";
  return message;
}

function AuthPage() {
  const { redirect } = Route.useSearch();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        await navigate({ to: safePath(redirect) });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}${safePath(redirect)}`,
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        toast.success("Conta criada. Agora você já pode entrar com e-mail e senha.");
        setMode("signin");
      }
    } catch (error) {
      const message = normalizeAuthError(error instanceof Error ? error.message : "Não foi possível entrar.");
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm">
        <p className="font-display text-xl tracking-[0.35em] text-ivory">LOBO CABANAS</p>
        <h1 className="pt-6 font-display text-3xl text-ivory">
          {mode === "signin" ? "Acesso da equipe" : "Criar acesso"}
        </h1>
        <p className="pt-2 text-sm text-mist">
          {mode === "signin"
            ? "Entre para gerenciar reservas, tarifas e disponibilidade."
            : "Crie sua conta. Se você for o primeiro usuário, poderá assumir o acesso de super admin depois de entrar."}
        </p>

        <form className="space-y-6 pt-10" onSubmit={handleSubmit}>
          {mode === "signup" ? (
            <PremiumInput
              label="Nome"
              value={fullName}
              autoComplete="name"
              onChange={(event) => setFullName(event.target.value)}
            />
          ) : null}
          <PremiumInput
            label="E-mail"
            type="email"
            required
            value={email}
            autoComplete="email"
            onChange={(event) => setEmail(event.target.value)}
          />
          <PremiumInput
            label="Senha"
            type="password"
            required
            minLength={6}
            value={password}
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            onChange={(event) => setPassword(event.target.value)}
          />
          <NomaButton type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? "Aguarde…" : mode === "signin" ? "Entrar" : "Criar conta"}
          </NomaButton>
        </form>

        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-6 text-xs uppercase tracking-[0.18em] text-mist transition-colors hover:text-ivory"
        >
          {mode === "signin" ? "Criar um acesso" : "Já tenho acesso"}
        </button>
      </div>
    </div>
  );
}