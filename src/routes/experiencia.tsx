import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";

import { SiteLayout } from "@/components/layout/SiteLayout";
import { NomaButton } from "@/components/premium/NomaButton";
import { EDITORIAL_GALLERY, IMAGES } from "@/lib/images";

const TITLE = "A experiência — Lobo Cabanas";
const DESCRIPTION =
  "Como funciona uma estadia na Lobo Cabanas: check-in autônomo, hidromassagem privativa, fogueira ao anoitecer e café da manhã entregue na porta.";

export const Route = createFileRoute("/experiencia")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: ExperiencePage,
});

const MOMENTS = [
  {
    time: "15h",
    title: "Chegada sem recepção",
    text: "Você recebe o código do portão e da cabana pelo WhatsApp. Ninguém vai te esperar na porta — é proposital.",
  },
  {
    time: "17h",
    title: "Água quente e mata",
    text: "A hidromassagem do deck já está aquecida quando você chega. A vista é a mata nativa, sem nenhuma construção no horizonte.",
  },
  {
    time: "19h",
    title: "Fogueira acesa",
    text: "Lenha e fósforos ficam no deck. A fogueira é sua para acender quantas noites quiser.",
  },
  {
    time: "8h",
    title: "Café na porta",
    text: "Cesta com pães da região, frutas, café coado e ovos frescos deixada na varanda no horário que você escolher.",
  },
];

function ExperiencePage() {
  return (
    <SiteLayout>
      <section className="relative h-[60svh] overflow-hidden">
        <img
          src={IMAGES.galleryFogueira}
          alt="Fogueira acesa no deck de madeira ao anoitecer"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="veil absolute inset-0" />
        <div className="relative mx-auto flex h-full max-w-[1400px] flex-col justify-end px-6 pb-14 lg:px-12">
          <p className="eyebrow">A experiência</p>
          <h1 className="max-w-2xl pt-3 font-display text-[clamp(2.25rem,6vw,4.5rem)] leading-none text-ivory">
            Um dia inteiro sem precisar decidir nada.
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 py-24 lg:px-12 lg:py-32">
        <div className="grid gap-y-14 md:grid-cols-2 md:gap-16">
          {MOMENTS.map((moment, index) => (
            <motion.div
              key={moment.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.9, delay: index * 0.08 }}
              className="border-t border-border pt-6"
            >
              <p className="font-display text-4xl text-sage">{moment.time}</p>
              <h2 className="pt-4 font-display text-2xl text-ivory">{moment.title}</h2>
              <p className="max-w-md pt-3 leading-relaxed text-mist">{moment.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-pine/30 py-20">
        <div className="mx-auto grid max-w-[1400px] gap-4 px-6 sm:grid-cols-3 lg:px-12">
          {EDITORIAL_GALLERY.slice(0, 3).map((item) => (
            <figure key={item.src} className="aspect-[4/5] overflow-hidden">
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                className="size-full object-cover"
              />
            </figure>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 py-24 text-center lg:px-12">
        <h2 className="mx-auto max-w-xl font-display text-[clamp(1.75rem,4.5vw,3rem)] leading-tight text-ivory">
          O resto é floresta.
        </h2>
        <div className="flex justify-center pt-8">
          <Link to="/cabanas">
            <NomaButton size="lg">Escolher datas</NomaButton>
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}