# Usar as 10 fotos reais das cabanas no site

As imagens geradas por IA saem do site. Todas as fotos passam a ser as suas 10 fotos reais (A-Frame, chalé com solarium, hidro, fogueira, interiores). Nenhuma mudança na lógica de reservas, preços, calendário ou admin.

## Onde cada foto entra

| Foto | Uso no site |
| --- | --- |
| Fogueira à noite com luzes e cabana A-Frame ao fundo | **Hero da home** (clima noturno, alinhado à marca) |
| A-Frame de dia com deck, guarda-sol e gazebo/hidro ao lado | **Capa da Cabana Aurora** (home, /cabanas, página da cabana) |
| A-Frame lateral com jacuzzi no deck e telhado escuro | Galeria — hidromassagem privativa |
| Chalé moderno de madeira com solarium de vidro (dia) | **Capa da Cabana Selva** |
| Mesmo chalé iluminado à noite com luzes rasantes | Galeria da Selva — noite |
| Interior com cama, cozinha e teto de madeira | **Interior principal** (Aurora e Selva) |
| Hidro no solarium de vidro com decoração romântica | Galeria — experiência romântica / solarium |
| Porta triangular do loft A-Frame abrindo para a varanda | Galeria — varanda do loft |
| Janela triangular do loft vista de dentro, mata ao fundo | Galeria editorial da home ("sem despertadores") |
| Detalhe da fachada A-Frame vista da borda da hidro | Galeria — detalhe arquitetônico |

A foto com pés/pessoa aparente entra apenas se você quiser; por padrão eu uso o enquadramento como está, pois passa bem a sensação de descanso. Se preferir, troco por outra.

## Como fica

- Home: hero com a fogueira, seção "A ideia" com a fachada A-Frame, cards das duas cabanas com as capas reais, faixa editorial com 5 fotos reais.
- /cabanas: Aurora com o A-Frame, Selva com o chalé de vidro.
- /cabanas/aurora e /cabanas/selva: capa + galeria com fotos reais correspondentes a cada cabana.
- /experiencia: fogueira como imagem de topo e 3 fotos reais na sequência.

## Técnico

- Publicar as 10 imagens como assets de CDN (`lovable-assets`) a partir dos uploads, sem colocar binários no repositório.
- Reescrever `src/lib/images.ts` para importar esses ponteiros, definir capas por slug (`aurora`, `selva`), galerias separadas por cabana e atualizar `alt`/legendas para descrever as fotos reais.
- Remover os 7 arquivos gerados em `src/assets/*.jpg`.
- Ajustar `src/routes/index.tsx` e `src/routes/experiencia.tsx` apenas nos `src`/`alt` das imagens.
- Verificar com Playwright em desktop e 390px: home, /cabanas, /cabanas/aurora, /cabanas/selva, /experiencia — todas as imagens carregando e sem scroll horizontal.