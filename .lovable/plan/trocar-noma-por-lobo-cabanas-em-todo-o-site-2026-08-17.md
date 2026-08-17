# Trocar "NOMA" por "Lobo Cabanas" em todo o site

## O que muda (texto visível)

- Rodapé e tela de login: marca escrita passa a ser "LOBO CABANAS".
- Cabeçalho do painel administrativo: "NOMA" vira "Lobo Cabanas".
- Títulos e descrições (SEO/compartilhamento) de todas as páginas: Home, Cabanas, Cabana individual, Experiência, Contato, Reserva confirmada, Painel e Acesso da equipe — "NOMA Forest Cabins" passa a "Lobo Cabanas".
- Mensagens automáticas de WhatsApp (dúvida geral, dúvida por cabana, contato com o hóspede) passam a citar "Lobo Cabanas".
- Notificações internas de reserva (nova/confirmada/cancelada) passam a citar "Lobo Cabanas".
- Nome do negócio no banco (configurações) e o texto padrão de fallback passam a "Lobo Cabanas".

## O que não muda

- Nomes técnicos internos que o usuário não vê: componente `NomaButton`, variável de animação `--ease-noma`, chave de armazenamento local da reserva e comentário do design system. Renomear isso não altera nada na tela e só aumenta risco.
- Rotas, lógica de reservas, preços e disponibilidade seguem intactos.

## Detalhes técnicos

- Substituição de strings em: `src/components/layout/Footer.tsx`, `src/routes/auth.tsx`, `src/routes/_authenticated/admin.tsx`, `src/routes/index.tsx`, `src/routes/cabanas.index.tsx`, `src/routes/cabanas.$slug.tsx`, `src/routes/experiencia.tsx`, `src/routes/contato.tsx`, `src/routes/reserva.sucesso.tsx`, `src/routes/__root.tsx`, `src/lib/whatsapp-link.ts`, `src/lib/notifications.server.ts`, `src/lib/public.functions.ts` (fallback), `src/components/layout/SiteLayout.tsx` (fallback).
- Atualização de dados: `business_settings.business_name` para "Lobo Cabanas".
