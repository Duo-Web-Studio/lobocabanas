import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

import { SiteLayout } from "@/components/layout/SiteLayout";
import { NomaButton } from "@/components/premium/NomaButton";
import { brl } from "@/lib/format";
import { cabinCover } from "@/lib/images";
import { listCabins } from "@/lib/public.functions";

const TITLE = "Cabanas — Lobo Cabanas";
const DESCRIPTION =
  "Conheça as cabanas Aurora e Ipê: hidromassagem privativa, deck sobre a floresta e preços por noite atualizados. Consulte a disponibilidade.";

export const Route = createFileRoute("/cabanas/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: CabinsPage,
});

function CabinsPage() {
  const fetchCabins = useServerFn(listCabins);
  const { data: cabins, isPending } = useQuery({
    queryKey: ["cabins"],
    queryFn: () => fetchCabins(),
    staleTime: 60_000,
  });

  return (
    <SiteLayout>
      <section className="mx-auto max-w-[1400px] px-6 pt-32 lg:px-12 lg:pt-44">
        <p className="eyebrow">As cabanas</p>
        <h1 className="max-w-2xl pt-4 font-display text-[clamp(2.25rem,6vw,4.5rem)] leading-[1] text-ivory">
          Duas clareiras, dois jeitos de desaparecer.
        </h1>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 py-20 lg:px-12 lg:py-28">
        {isPending ? <p className="text-sm text-mist">Carregando cabanas…</p> : null}
        <div className="space-y-24">
          {(cabins ?? []).map((cabin, index) => (
            <motion.article
              key={cabin.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1 }}
              className={`grid items-center gap-10 lg:grid-cols-2 ${
                index % 2 === 1 ? "lg:[&>figure]:order-2" : ""
              }`}
            >
              <figure className="aspect-[4/3] overflow-hidden">
                <img
                  src={cabinCover(cabin.slug, cabin.cover_image)}
                  alt={`Cabana ${cabin.name}`}
                  loading={index === 0 ? "eager" : "lazy"}
                  className="size-full object-cover"
                />
              </figure>
              <div>
                <p className="eyebrow">{cabin.location}</p>
                <h2 className="pt-3 font-display text-4xl text-ivory">{cabin.name}</h2>
                <p className="max-w-xl pt-4 leading-relaxed text-mist">{cabin.short_description}</p>
                <dl className="grid max-w-md grid-cols-2 gap-x-8 gap-y-3 border-y border-border py-5 pt-6 text-sm text-mist sm:grid-cols-4">
                  <div>
                    <dt className="text-[0.65rem] uppercase tracking-[0.18em] text-mist/60">
                      Hóspedes
                    </dt>
                    <dd className="pt-1 text-ivory">{cabin.max_guests}</dd>
                  </div>
                  <div>
                    <dt className="text-[0.65rem] uppercase tracking-[0.18em] text-mist/60">
                      Quartos
                    </dt>
                    <dd className="pt-1 text-ivory">{cabin.bedrooms}</dd>
                  </div>
                  <div>
                    <dt className="text-[0.65rem] uppercase tracking-[0.18em] text-mist/60">
                      Camas
                    </dt>
                    <dd className="pt-1 text-ivory">{cabin.beds}</dd>
                  </div>
                  <div>
                    <dt className="text-[0.65rem] uppercase tracking-[0.18em] text-mist/60">
                      Banheiros
                    </dt>
                    <dd className="pt-1 text-ivory">{cabin.bathrooms}</dd>
                  </div>
                </dl>
                <div className="flex flex-wrap items-center gap-6 pt-6">
                  <p className="font-display text-2xl text-ivory">
                    {brl(Number(cabin.base_price))}
                    <span className="pl-2 text-sm text-mist">/ noite</span>
                  </p>
                  <Link to="/cabanas/$slug" params={{ slug: cabin.slug }}>
                    <NomaButton>
                      Ver e reservar <ArrowRight className="size-3.5" />
                    </NomaButton>
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}