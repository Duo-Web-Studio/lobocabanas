# Plano: arredondar bordas da logo no header

## Objetivo
Aplicar cantos mais arredondados na logo exibida no `Header`, mantendo a hierarquia visual e a responsividade.

## Alteração proposta
- Em `src/components/layout/Header.tsx`, alterar a classe da imagem da logo.
  - Atual: `rounded-sm` + tamanho fixo `h-[30px] md:h-9`.
  - Novo: substituir `rounded-sm` por `rounded-lg` (ou `rounded-2xl` se preferir mais arredondado) e manter as dimensões.

## Validação
- Verificar visualmente no preview que a logo aparece com bordas arredondadas no topo da página (header transparente) e após scroll (header com glass).
- Confirmar que não há estouro horizontal ou quebra no layout mobile.

## Nota
Não altera lógica de reservas, navegação ou autenticação.
