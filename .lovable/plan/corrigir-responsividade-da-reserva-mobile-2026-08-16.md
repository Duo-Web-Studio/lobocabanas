# Corrigir responsividade da reserva (mobile)

## O problema (confirmado)
Na página da cabana (`/cabanas/aurora`, `/cabanas/selva`) o conteúdo mede 552px em uma tela de 390px — a página inteira "vaza" para o lado. As outras páginas (home, cabanas, experiência, contato) estão em 390px, ou seja, o problema é só nessa página, justamente onde ficam o calendário e o formulário de check-in.

Causa: a área de conteúdo e o painel de reserva ficam dentro de um grid cuja coluna não pode encolher (a régua de miniaturas da galeria, com rolagem horizontal, define a largura mínima). Como o painel de reserva mora nesse mesmo grid, o calendário e o formulário herdam essa largura extra e ficam cortados no celular.

## O que vai ser ajustado

1. **Impedir o vazamento horizontal** — permitir que as colunas da página da cabana encolham no celular (`min-w-0`), para que a galeria role internamente em vez de esticar a página. Resultado: 390px de largura, sem rolagem lateral.
2. **Painel de reserva no mobile** — padding e tipografia proporcionais em telas pequenas; cabeçalho de preço ("A partir de / até X hóspedes / taxa de limpeza") reorganizado em duas linhas para não apertar.
3. **Calendário** — células com largura mínima segura, dias com área de toque adequada, e o preço da noite passa a aparecer sempre no mobile (hoje só aparece no hover, que não existe em toque). Rótulos dos dias da semana e o botão de mês ajustados para caber.
4. **Seletor de hóspedes e formulário** — linhas com `min-w-0` + texto truncável para que rótulo e botões +/- não se sobreponham; campos e botões em largura total com alvos de toque de 44px.
5. **Resumo de valores** — as linhas "noites · datas / total" passam a quebrar corretamente em telas estreitas.

Sem mudança de regra de negócio, preços, disponibilidade ou fluxo de reserva — apenas layout e apresentação.

## Detalhes técnicos
- `src/routes/cabanas.$slug.tsx`: `min-w-0` nos itens do grid `lg:grid-cols-[1.4fr_0.9fr]`; garantir que o wrapper de miniaturas não force largura intrínseca.
- `src/components/booking/BookingPanel.tsx`: header em grid `grid-cols-[minmax(0,1fr)_auto]` no mobile → flex em `sm:`; paddings `p-5 sm:p-8`; linhas de resumo com `min-w-0` + `truncate`.
- `src/components/booking/BookingCalendar.tsx`: grid de dias com `min-w-0`, altura/toque `h-12`, preço visível por padrão em telas pequenas (`opacity-70 sm:opacity-0 sm:group-hover:opacity-70`).
- `src/components/booking/GuestSelector.tsx`: `min-w-0` no bloco de texto, `shrink-0` nos controles.
- Verificação: reexecutar a checagem de largura a 390px nas duas páginas de cabana e capturar screenshot do painel.
