import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Check } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

import { BookingPanel } from "@/components/booking/BookingPanel";
import { SiteLayout, useBusinessInfo } from "@/components/layout/SiteLayout";
import { cabinCover, cabinGallery } from "@/lib/images";
import { getCabin } from "@/lib/public.functions";

export const Route = createFileRoute("/cabanas/$slug")({
  head: ({ params }) => {
    const NAMES: Record<string, string> = { aurora: "Aurora", selva: "Ipê" };
    const name =
      NAMES[params.slug] ?? params.slug.charAt(0).toUpperCase() + params.slug.slice(1);
    const title = `Cabana ${name} — Lobo Cabanas`;
    const description = `Reserve a Cabana ${name}: hidromassagem privativa, deck sobre a floresta perto de Goiânia e disponibilidade em tempo real.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: CabinDetail,
});

function CabinDetail() {
  const { slug } = Route.useParams();
  const fetchCabin = useServerFn(getCabin);
  const { data: business } = useBusinessInfo();
  const [active, setActive] = useState(0);

  const { data: cabin, isPending } = useQuery({
    queryKey: ["cabin", slug],
    queryFn: () => fetchCabin({ data: { slug } }),
    staleTime: 60_000,
  });

  if (isPending) {
    return (
      <SiteLayout>
        <div className="flex min-h-[60vh] items-center justify-center text-sm text-mist">
          Carregando cabana…
        </div>
      </SiteLayout>
    );
  }

  if (!cabin) {
    return (
      <SiteLayout>
        <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-6 text-center">
          <h1 className="font-display text-3xl text-ivory">Cabana não encontrada</h1>
          <p className="pt-3 text-sm text-mist">
            Esta cabana pode ter saído do ar. Veja as opções disponíveis.
          </p>
          <Link
            to="/cabanas"
            className="mt-6 text-[0.7rem] uppercase tracking-[0.2em] text-sage hover:text-ivory"
          >
            Ver cabanas
          </Link>
        </div>
      </SiteLayout>
    );
  }

  const gallery = cabinGallery(cabin.slug, cabin.gallery);
  const amenities = Array.isArray(cabin.amenities) ? (cabin.amenities as string[]) : [];

  return (
    <SiteLayout>
      <section className="relative h-[70svh] overflow-hidden">
        <motion.img
          src={cabinCover(cabin.slug, cabin.cover_image)}
          alt={`Cabana ${cabin.name}`}
          className="absolute inset-0 size-full object-cover"
          initial={{ scale: 1.06 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
        />
        <div className="veil absolute inset-0" />
        <div className="relative mx-auto flex h-full max-w-[1400px] flex-col justify-end px-6 pb-14 lg:px-12">
          <p className="eyebrow">{cabin.location}</p>
          <h1 className="pt-3 font-display text-[clamp(2.5rem,7vw,5rem)] leading-none text-ivory">
            {cabin.name}
          </h1>
        </div>
      </section>

      <div className="mx-auto grid max-w-[1400px] gap-14 px-5 py-16 sm:px-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.9fr)] lg:px-12 lg:py-24">
        <div className="min-w-0">
          <p className="max-w-2xl text-lg leading-relaxed text-mist">{cabin.description}</p>

          <div className="grid grid-cols-2 gap-x-8 gap-y-4 border-y border-border py-6 pt-8 sm:grid-cols-4">
            {[
              ["Hóspedes", cabin.max_guests],
              ["Quartos", cabin.bedrooms],
              ["Camas", cabin.beds],
              ["Banheiros", cabin.bathrooms],
            ].map(([label, value]) => (
              <div key={String(label)}>
                <p className="text-[0.65rem] uppercase tracking-[0.18em] text-mist/60">{label}</p>
                <p className="pt-1 font-display text-2xl text-ivory">{value}</p>
              </div>
            ))}
          </div>

          {amenities.length > 0 ? (
            <div className="pt-10">
              <p className="eyebrow">O que está incluído</p>
              <ul className="grid gap-3 pt-5 sm:grid-cols-2">
                {amenities.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-mist">
                    <Check className="mt-0.5 size-3.5 shrink-0 text-sage" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="pt-14">
            <p className="eyebrow">Galeria</p>
            <div className="pt-5">
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={gallery[active]}
                  alt={`Cabana ${cabin.name} — imagem ${active + 1}`}
                  className="size-full object-cover"
                />
              </div>
              <div className="flex w-full gap-3 overflow-x-auto pt-3">
                {gallery.map((src, index) => (
                  <button
                    key={src + index}
                    type="button"
                    onClick={() => setActive(index)}
                    aria-label={`Ver imagem ${index + 1}`}
                    className={`h-16 w-24 shrink-0 overflow-hidden border transition-opacity duration-500 ${
                      active === index ? "border-sage opacity-100" : "border-transparent opacity-55"
                    }`}
                  >
                    <img src={src} alt="" loading="lazy" className="size-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="min-w-0 lg:sticky lg:top-28 lg:self-start">
          <BookingPanel
            cabin={{
              id: cabin.id,
              name: cabin.name,
              slug: cabin.slug,
              base_price: Number(cabin.base_price),
              cleaning_fee: Number(cabin.cleaning_fee),
              max_guests: cabin.max_guests,
            }}
            whatsapp={business?.whatsapp ?? null}
          />
        </div>
      </div>
    </SiteLayout>
  );
}