import { Link } from "@tanstack/react-router";

import { generalMessage, waLink } from "@/lib/whatsapp-link";

export function Footer({
  businessName,
  whatsapp,
  instagram,
  email,
  address,
}: {
  businessName: string;
  whatsapp?: string | null;
  instagram?: string | null;
  email?: string | null;
  address?: string | null;
}) {
  return (
    <footer className="border-t border-border bg-pine/40">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-6 py-16 md:grid-cols-3 lg:px-12">
        <div>
          <p className="font-display text-2xl tracking-[0.35em] text-ivory">NOMA</p>
          <p className="max-w-xs pt-4 text-sm leading-relaxed text-mist">
            Cabanas de luxo na floresta, perto de Goiânia. Poucas unidades, muito silêncio.
          </p>
        </div>

        <div>
          <p className="eyebrow">Navegar</p>
          <div className="flex flex-col gap-3 pt-4 text-sm text-mist">
            <Link to="/cabanas" className="transition-colors hover:text-ivory">
              Cabanas
            </Link>
            <Link to="/experiencia" className="transition-colors hover:text-ivory">
              Experiência
            </Link>
            <Link to="/contato" className="transition-colors hover:text-ivory">
              Contato
            </Link>
            <a href="/admin" className="transition-colors hover:text-ivory">
              Área administrativa
            </a>
          </div>
        </div>

        <div>
          <p className="eyebrow">Contato</p>
          <div className="flex flex-col gap-3 pt-4 text-sm text-mist">
            <a
              href={waLink(whatsapp, generalMessage())}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-ivory"
            >
              WhatsApp
            </a>
            {email ? (
              <a href={`mailto:${email}`} className="transition-colors hover:text-ivory">
                {email}
              </a>
            ) : null}
            {instagram ? (
              <a
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-ivory"
              >
                Instagram
              </a>
            ) : null}
            {address ? <p className="max-w-xs leading-relaxed">{address}</p> : null}
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-2 px-6 py-6 text-[0.7rem] uppercase tracking-[0.18em] text-mist/60 sm:flex-row sm:items-center sm:justify-between lg:px-12">
          <span>
            © {new Date().getFullYear()} {businessName}
          </span>
          <span>Goiânia · Goiás · Brasil</span>
        </div>
      </div>
    </footer>
  );
}