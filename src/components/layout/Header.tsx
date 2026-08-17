import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import { NomaButton } from "@/components/premium/NomaButton";
import logoAsset from "@/assets/lobo-cabanas-logo.jpg.asset.json";
import { cn } from "@/lib/utils";
import { generalMessage, waLink } from "@/lib/whatsapp-link";

const NAV = [
  { to: "/", label: "Início" },
  { to: "/cabanas", label: "Cabanas" },
  { to: "/experiencia", label: "Experiência" },
  { to: "/contato", label: "Contato" },
] as const;

export function Header({ whatsapp }: { whatsapp?: string | null }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-all duration-700 ease-[var(--ease-noma)]",
        scrolled ? "glass py-3" : "py-6",
      )}
    >
      {!scrolled ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[140%] bg-gradient-to-b from-black/70 via-black/35 to-transparent"
        />
      ) : null}
      <div className="relative mx-auto flex max-w-[1400px] items-center justify-between px-6 lg:px-12">
        <Link to="/" aria-label="Lobo Cabanas — página inicial" className="flex items-center">
          <img
            src={logoAsset.url}
            alt="Lobo Cabanas"
            className="h-[30px] w-auto rounded-sm md:h-9"
          />
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "text-[0.7rem] uppercase tracking-[0.2em] transition-colors duration-500 hover:text-ivory",
                scrolled
                  ? "text-mist"
                  : "text-ivory/90 [text-shadow:0_1px_10px_rgba(0,0,0,0.75)]",
              )}
              activeProps={{ className: "text-ivory" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={waLink(whatsapp, generalMessage())}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:block"
          >
            <NomaButton variant="outline" size="sm">
              WhatsApp
            </NomaButton>
          </a>
          <Link to="/cabanas" className="hidden md:block">
            <NomaButton size="sm">Reservar</NomaButton>
          </Link>
          <button
            type="button"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            onClick={() => setOpen((value) => !value)}
            className="p-2 text-ivory md:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="glass mt-3 md:hidden">
          <nav className="flex flex-col px-6 py-4">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="border-b border-border py-4 text-sm uppercase tracking-[0.2em] text-mist last:border-0"
                activeProps={{ className: "text-ivory" }}
              >
                {item.label}
              </Link>
            ))}
            <a
              href={waLink(whatsapp, generalMessage())}
              target="_blank"
              rel="noopener noreferrer"
              className="py-4 text-sm uppercase tracking-[0.2em] text-sage"
            >
              Falar no WhatsApp
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}