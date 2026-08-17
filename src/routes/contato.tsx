import { createFileRoute } from "@tanstack/react-router";

import { SiteLayout, useBusinessInfo } from "@/components/layout/SiteLayout";
import { NomaButton } from "@/components/premium/NomaButton";
import { generalMessage, waLink } from "@/lib/whatsapp-link";

const TITLE = "Contato — Lobo Cabanas";
const DESCRIPTION =
  "Fale direto com a Lobo Cabanas por WhatsApp ou e-mail para dúvidas, estadias longas e reservas especiais nas cabanas perto de Goiânia.";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { data } = useBusinessInfo();

  return (
    <SiteLayout>
      <section className="mx-auto max-w-[1400px] px-6 pt-32 pb-24 lg:px-12 lg:pt-44 lg:pb-32">
        <p className="eyebrow">Contato</p>
        <h1 className="max-w-2xl pt-4 font-display text-[clamp(2.25rem,6vw,4.5rem)] leading-none text-ivory">
          Fale com quem cuida das cabanas.
        </h1>

        <div className="grid gap-12 pt-16 md:grid-cols-2">
          <div className="space-y-8">
            <div className="border-t border-border pt-5">
              <p className="eyebrow">WhatsApp</p>
              <p className="pt-2 text-lg text-ivory">{data?.whatsapp ?? "—"}</p>
              <p className="pt-1 text-sm text-mist">Resposta em até algumas horas, todos os dias.</p>
              <a
                href={waLink(data?.whatsapp, generalMessage())}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block"
              >
                <NomaButton variant="whatsapp">Abrir conversa</NomaButton>
              </a>
            </div>

            {data?.email ? (
              <div className="border-t border-border pt-5">
                <p className="eyebrow">E-mail</p>
                <a
                  href={`mailto:${data.email}`}
                  className="pt-2 inline-block text-lg text-ivory hover:text-sage"
                >
                  {data.email}
                </a>
              </div>
            ) : null}

            {data?.address ? (
              <div className="border-t border-border pt-5">
                <p className="eyebrow">Onde estamos</p>
                <p className="max-w-sm pt-2 leading-relaxed text-mist">{data.address}</p>
              </div>
            ) : null}
          </div>

          <div className="glass p-8">
            <p className="eyebrow">Boas perguntas</p>
            <dl className="divide-y divide-border pt-4">
              {[
                [
                  "Como funciona o pagamento?",
                  "A reserva é confirmada pelo WhatsApp e o pagamento é combinado direto com a gente — sem taxas de plataforma.",
                ],
                [
                  "Aceitam animais?",
                  "Sim, cães de pequeno e médio porte são bem-vindos. Avise na reserva.",
                ],
                [
                  "Qual a estadia mínima?",
                  "Em geral duas noites, com exceções em datas específicas indicadas no calendário.",
                ],
              ].map(([question, answer]) => (
                <div key={question} className="py-5">
                  <dt className="text-sm text-ivory">{question}</dt>
                  <dd className="pt-2 text-sm leading-relaxed text-mist">{answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}