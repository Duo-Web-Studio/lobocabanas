Plan: permitir login automático do admin e corrigir a mensagem de acesso

O login está bloqueado porque a confirmação de e-mail está ativa no Supabase Auth. A tela `/auth` mostra a mensagem genérica "Conta criada. Peça a um administrador para liberar seu acesso.", mas o erro real é `email_not_confirmed` — a conta ainda não pode ser usada até clicar no link de confirmação. Para você (dono/operador) acessar o painel sem depender de e-mail, vou:

1. Ativar a **confirmação automática de e-mail** no Supabase Auth (`auto_confirm_email`), permitindo que qualquer novo cadastro já possa fazer login imediatamente.
2. Revisar a tela `/auth` para mostrar mensagens claras e honestas sobre o estado do login:
   - Após criar conta, indicar que já é possível entrar.
   - Em modo de erro, mostrar o motivo real (credenciais inválidas, e-mail não confirmado, etc.).
3. Garantir que, após o login, a página `/admin` ofereça o fluxo **"Assumir como super admin"** visível e funcional para o primeiro usuário.

Técnico:
- Chamar `supabase--configure_auth` com `auto_confirm_email: true` (mantendo os outros campos conforme a configuração atual do projeto).
- Editar `src/routes/auth.tsx` para substituir o toast de sucesso e as mensagens de erro por textos informativos, sem alterar o fluxo visual.
- Verificar se `src/routes/_authenticated/admin.index.tsx` já apresenta o botão de acesso inicial; ajustar se necessário.
- Testar o login localmente em `http://localhost:8080/auth` e a navegação para `/admin`.
