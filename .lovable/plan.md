# Correção da direção visual: cabanas A-Frame na mata

Toda a lógica do projeto (reservas, disponibilidade, calendário, preços, hóspedes, admin, WhatsApp, auth, banco) fica intacta. A mudança é 100% de imagens e textos de apoio visual.

## Nova regra estética (aplicada a todas as imagens)

Cabana A-Frame de madeira: fachada triangular, telhado escuro grafite/preto muito inclinado cobrindo quase toda a frente, estrutura alta e estreita, madeira quente aparente (#7A4025 / #8B4E2E / #9A5A35), telhado #161A17, janela triangular no pavimento superior, porta central, luz âmbar 2200–3000K saindo pelas janelas. Floresta densa de Mata Atlântica, árvores altas encostando na construção, solo natural, caminho de pedra/cascalho, cordões de luz entre as árvores. Sem gramado de condomínio, sem vidro predominante, sem concreto, sem resort.

## Imagens que serão regeradas (mesmos arquivos, mesmos nomes)

1. `hero-forest.jpg` — hero cinematográfico: A-Frame externa entre árvores altas, horário azul/início da noite, névoa leve, interior aceso, luzes quentes ao redor.
2. `selva-exterior.jpg` — Cabana Selva: A-Frame um pouco maior, dois pavimentos, deck amplo com varanda e hidro ao lado, mata fechada.
3. `aurora-interior.jpg` — interior A-Frame: teto inclinado de madeira, cama king, tecidos naturais bege, janela grande para a floresta, luz âmbar indireta.
4. `gallery-hidro.jpg` — ofurô/hidro em deck de madeira ao lado da A-Frame, vapor, dusk, floresta ao redor.
5. `gallery-fogueira.jpg` — fire pit de pedra com bancos e cadeiras de madeira em frente à A-Frame iluminada, cascalho, luzes penduradas.
6. `gallery-floresta.jpg` — mata densa com árvores altas e trilha de pedra levando à cabana ao fundo (mantém coerência do mesmo empreendimento).

Novo arquivo: `aurora-exterior.jpg` — A-Frame clássica mais intimista para casal, fogueira na frente, janela triangular visível. Passa a ser a capa da Aurora (hoje a capa é o interior), e o interior vira imagem de galeria.

## Ajustes de código (apresentação apenas)

- `src/lib/images.ts`: adicionar `auroraExterior`, apontar a capa da Aurora para a nova externa, reordenar galerias para que cada cabana comece pela sua fachada A-Frame, e atualizar `alt`/legendas do bloco editorial para a nova linguagem ("chalé de madeira escondido na mata").
- Revisar textos curtos de apoio nas páginas pública/cabana que citem estética de resort, mantendo o hero exatamente como está: "Onde a floresta encontra o conforto." + "Cabanas privadas criadas para desaparecer da rotina."

## Verificação

Playwright em desktop e 390px: home, /cabanas, /cabanas/aurora, /cabanas/selva, /experiencia — conferir que todas as fotos mostram a mesma arquitetura A-Frame e que nada do fluxo de reserva mudou.
