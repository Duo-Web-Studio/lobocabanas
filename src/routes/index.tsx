import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

import { SiteLayout, useBusinessInfo } from "@/components/layout/SiteLayout";
import { NomaButton } from "@/components/premium/NomaButton";
import { brl } from "@/lib/format";
import { cabinCover, EDITORIAL_GALLERY, IMAGES } from "@/lib/images";
import { listCabins } from "@/lib/public.functions";
import { generalMessage, waLink } from "@/lib/whatsapp-link";

const TITLE = "Lobo Cabanas — Cabanas de luxo perto de Goiânia";
const DESCRIPTION =
  "Duas cabanas privativas na floresta, a poucos minutos de Goiânia: hidromassagem no deck, fogueira e silêncio absoluto. Reserve direto, sem intermediários.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: Index,
});

function Index() {
  const fetchCabins = useServerFn(listCabins);
  const { data: cabins } = useQuery({
    queryKey: ["cabins"],
    queryFn: () => fetchCabins(),
    staleTime: 60_000,
  });
  const { data: business } = useBusinessInfo();

  return (
    <SiteLayout>
      <section className="relative flex min-h-[100svh] items-end overflow-hidden">
        <motion.img
          src={IMAGES.heroForest}
          alt="Fogueira acesa à noite com luzes penduradas e a cabana A-Frame ao fundo"
          className="absolute inset-0 size-full object-cover"
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1] }}
        />
        <div className="veil absolute inset-0" />
        <div className="relative mx-auto w-full max-w-[1400px] px-6 pb-20 lg:px-12 lg:pb-28">
          <motion.p
            className="eyebrow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1 }}
          >
            Perto de Goiânia · Goiás
          </motion.p>
          <motion.h1
            className="max-w-3xl pt-5 font-display text-[clamp(2.75rem,8vw,6rem)] leading-[0.95] text-ivory"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 1.2 }}
          >
            Onde a floresta
            <br />
            encontra o conforto.
          </motion.h1>
          <motion.p
            className="max-w-md pt-6 text-base leading-relaxed text-mist"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
          >
            Cabanas privadas criadas para desaparecer da rotina.
          </motion.p>
          <motion.div
            className="flex flex-wrap items-center gap-3 pt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
          >
            <Link to="/cabanas">
              <NomaButton size="lg">
                Ver disponibilidade <ArrowRight className="size-3.5" />
              </NomaButton>
            </Link>
            <a
              href={waLink(business?.whatsapp, generalMessage())}
              target="_blank"
              rel="noopener noreferrer"
            >
              <NomaButton variant="outline" size="lg">
                Falar no WhatsApp
              </NomaButton>
            </a>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 py-24 lg:px-12 lg:py-36">
        <div className="grid gap-12 md:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="eyebrow">A ideia</p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="pt-6"
            >
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={IMAGES.auroraExterior}
                  alt="Cabana A-Frame de madeira com deck, guarda-sol e hidromassagem ao lado"
                  loading="lazy"
                  className="size-full object-cover"
                />
              </div>
              <p className="pt-3 text-[0.65rem] uppercase tracking-[0.18em] text-mist/60">
                Perto de Goiânia · duas cabanas · zero vizinhos
              </p>
            </motion.div>
          </div>
          <div>
            <h2 className="font-display text-[clamp(1.75rem,4vw,3rem)] leading-tight text-ivory">
              Duas cabanas de madeira em formato A-Frame, escondidas onde a floresta é mais fechada.
            </h2>
            <p className="max-w-xl pt-6 leading-relaxed text-mist">
              Telhado inclinado, madeira aparente, teto alto e janela triangular voltada para as
              árvores. Cada cabana fica isolada em sua própria clareira, com fogueira e deck
              privativo. Sem recepção, sem corredores, sem trilha sonora ambiente — apenas madeira,
              luz quente, água aquecida e o barulho real da floresta.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 pb-24 lg:px-12 lg:pb-36">
        <div className="flex items-end justify-between gap-6 border-b border-border pb-6">
          <div>
            <p className="eyebrow">As cabanas</p>
            <h2 className="pt-3 font-display text-4xl text-ivory">Escolha o seu refúgio</h2>
          </div>
          <Link
            to="/cabanas"
            className="hidden text-[0.7rem] uppercase tracking-[0.2em] text-mist transition-colors hover:text-ivory sm:block"
          >
            Ver todas
          </Link>
        </div>

        <div className="grid gap-10 pt-12 md:grid-cols-2">
          {(cabins ?? []).map((cabin, index) => (
            <motion.div
              key={cabin.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1, delay: index * 0.1 }}
            >
              <Link
                to="/cabanas/$slug"
                params={{ slug: cabin.slug }}
                className="group block"
                aria-label={`Ver a cabana ${cabin.name}`}
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={cabinCover(cabin.slug, cabin.cover_image)}
                    alt={`Cabana ${cabin.name}`}
                    className="size-full object-cover transition-transform duration-[1.6s] ease-[var(--ease-noma)] group-hover:scale-105"
                  />
                  <div className="veil absolute inset-0 opacity-70" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6">
                    <div>
                      <p className="font-display text-3xl text-ivory">{cabin.name}</p>
                      <p className="pt-1 text-xs text-mist">
                        até {cabin.max_guests} hóspedes · {cabin.bedrooms} quarto
                        {cabin.bedrooms > 1 ? "s" : ""}
                      </p>
                    </div>
                    <p className="text-right text-sm text-ivory">
                      {brl(Number(cabin.base_price))}
                      <span className="block text-[0.65rem] text-mist">por noite</span>
                    </p>
                  </div>
                </div>
                <p className="pt-4 max-w-md leading-relaxed text-mist">{cabin.short_description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-pine/30 py-24 lg:py-32">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <p className="eyebrow">A experiência</p>
          <h2 className="max-w-2xl pt-4 font-display text-[clamp(1.75rem,4vw,3rem)] leading-tight text-ivory">
            Cinco coisas que você não encontra aqui.
          </h2>
          <div className="grid gap-6 pt-14 sm:grid-cols-2 lg:grid-cols-5">
            {EDITORIAL_GALLERY.map((item, index) => (
              <motion.figure
                key={item.src}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.9, delay: index * 0.08 }}
                className={index % 2 === 1 ? "lg:pt-10" : undefined}
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={item.src}
                    alt={item.alt}
                    loading="lazy"
                    className="size-full object-cover"
                  />
                </div>
                <figcaption className="pt-3 text-xs text-mist">{item.caption}</figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 py-24 text-center lg:px-12 lg:py-36">
        <h2 className="mx-auto max-w-2xl font-display text-[clamp(2rem,5vw,3.5rem)] leading-tight text-ivory">
          Duas cabanas, poucas datas livres.
        </h2>
        <p className="mx-auto max-w-md pt-5 leading-relaxed text-mist">
          Reserve direto com a gente. Sem taxas de plataforma, sem intermediários.
        </p>
        <div className="flex justify-center pt-9">
          <Link to="/cabanas">
            <NomaButton size="lg">
              Ver calendário <ArrowRight className="size-3.5" />
            </NomaButton>
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
