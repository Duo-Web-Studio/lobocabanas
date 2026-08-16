# Corrigir o vazio na seção "A ideia" (home)

Verifiquei a home no navegador: os textos da seção existem e carregam corretamente, e os cartões das cabanas abaixo também. O problema real é visual — a seção usa um grid de duas colunas (`0.8fr` para o rótulo "A ideia" e `1.2fr` para o texto), e a coluna da esquerda fica quase toda vazia. No desktop isso deixa um bloco preto grande abaixo do rótulo, dando a impressão de que algo não carregou.

## Correção

Preencher a coluna esquerda com conteúdo real, mantendo o estilo editorial:

- Imagem vertical da cabana (`selva-exterior.jpg`) abaixo do rótulo "A ideia", em proporção 3/4, com fade-in suave ao entrar na tela.
- Rótulo "A ideia" permanece no topo da coluna, acima da imagem.
- Abaixo da imagem, uma linha curta de assinatura ("Mata Atlântica · duas cabanas · zero vizinhos") para fechar o bloco.
- No mobile a seção continua em coluna única, com a imagem entre o rótulo e o texto.

## Técnico

- Editar apenas a seção "A ideia" em `src/routes/index.tsx`: adicionar um `div` na primeira coluna do grid com `IMAGES.selvaExterior`, `loading="lazy"`, `alt` descritivo e `motion.div` com fade/slide leve.
- Sem mudanças de dados, rotas ou lógica.
