# Ajustar textos: região de Goiânia e novo nome da segunda cabana

Hoje o site diz "Mata Atlântica" em 6 arquivos e chama a segunda cabana de "Selva". Nada disso corresponde à realidade: as cabanas ficam perto de Goiânia (GO), em região de cerrado com mata fechada.

## Decisões

- Região: "Cerrado goiano" / "a poucos minutos de Goiânia · Goiás" nas assinaturas curtas.
- Segunda cabana: **Ipê** (árvore símbolo do cerrado, combina com "Aurora").
- Ambiente descrito como floresta fechada, silêncio, conforto — sem citar bioma errado.
- "Aurora" permanece.

## O que muda

1. **Home** (`src/routes/index.tsx`): título/description SEO, o eyebrow do hero ("Goiás · Brasil"), a assinatura sob a imagem ("Perto de Goiânia · duas cabanas · zero vizinhos") e o parágrafo da seção "A ideia" (troca "mata é mais fechada" mantendo o tom, sem bioma).
2. **Rodapé** (`Footer.tsx`): "Cabanas de luxo no cerrado goiano..." e a linha final "Goiás · Brasil".
3. **Metadados globais** (`__root.tsx`): título e descrições sem "Mata Atlântica".
4. **Lista de cabanas** (`cabanas.index.tsx`): "as cabanas Aurora e Ipê".
5. **Detalhe da cabana** (`cabanas.$slug.tsx`): description sem "Mata Atlântica".
6. **Contato** (`contato.tsx`): mesma troca de região.
7. **Banco de dados**: migração atualizando o nome da cabana "Selva" para "Ipê" e as descrições que mencionam Mata Atlântica/selva.

## Técnico

- A URL da cabana continua `/cabanas/selva` (o `slug` não muda), para não quebrar links, o mapeamento de imagens em `src/lib/images.ts` nem galerias já configuradas. Só o nome exibido e os textos mudam.
- Nenhuma alteração em lógica de reserva, disponibilidade, preços ou admin.
