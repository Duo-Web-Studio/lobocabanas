# Logo Lobo Cabanas no header + legibilidade

## O que muda

1. **Logo no header**
   - A logo enviada (lobo + cabana A-Frame, "LOBO CABANAS") entra no lugar do texto "NOMA" no topo, como imagem clicável que leva para a Home.
   - Altura controlada (aprox. 36px no desktop, 30px no mobile), com `alt` descritivo para SEO/acessibilidade.
   - Rodapé e demais textos da marca ficam como estão nesta etapa.

2. **Legibilidade quando o header está transparente**
   - No topo da página (sem fundo), os links e a logo ficam sobre a foto do hero. Para garantir contraste:
     - gradiente escuro suave descendo do topo atrás do header (só no estado não rolado, sem virar barra sólida);
     - links do menu com cor mais clara e leve sombra de texto nesse estado;
     - ao rolar, volta ao vidro/glass atual sem gradiente extra.

## Detalhes técnicos

- Upload da logo como asset de CDN (`lovable-assets`) e ponteiro em `src/assets/lobo-cabanas-logo.jpg.asset.json`; import no componente.
- `src/components/layout/Header.tsx`: substituir o `Link` textual por `<img>` da logo; adicionar camada `absolute inset-0` com `bg-gradient-to-b from-black/60 to-transparent` visível apenas quando `!scrolled`; ajustar classes dos links de nav para `text-ivory/90` + `drop-shadow` no estado transparente e manter `text-mist` no estado glass.
- Nenhuma alteração em lógica de reservas, rotas ou dados.
