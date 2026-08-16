# Trocar as imagens por cabanas e chalés mais rústicos

Hoje o site usa 6 imagens com estética de hotel de luxo. A ideia é substituir todas por fotos de cabanas e chalés de madeira reais — mais simples, aconchegantes e rústicas — mantendo o clima noturno/floresta da marca.

## Novas imagens (mesmos nomes e usos)

- `hero-forest.jpg` — chalé de madeira com luz quente nas janelas entre árvores, ao anoitecer
- `aurora-interior.jpg` — interior rústico de cabana: madeira aparente, cama simples com edredom, janela para a mata
- `selva-exterior.jpg` — cabana de madeira com varanda e telhado inclinado, cercada de mata
- `gallery-hidro.jpg` — banheira/ofurô de madeira no deck, estilo caseiro
- `gallery-fogueira.jpg` — fogueira simples em frente à cabana, cadeiras de madeira
- `gallery-floresta.jpg` — trilha e mata nativa ao amanhecer

## Como fica

Nada de layout muda. Como `src/lib/images.ts` centraliza todas as importações, basta gerar as novas imagens nos mesmos caminhos — home, listagem de cabanas, página da cabana e galeria editorial passam a mostrar as novas fotos automaticamente.

## Técnico

- Regenerar os 6 arquivos em `src/assets/` com prompts de estilo "cabana de madeira rústica / chalé", sem estética de resort de luxo.
- Nenhuma alteração em `src/lib/images.ts` nem nas rotas.
- Se alguma cabana tiver `cover_image` salva no banco, ela continua tendo prioridade; posso limpar esses campos se quiser que as novas imagens apareçam sempre.
