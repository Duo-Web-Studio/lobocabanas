# Forest Haven Booking

NOMA — Forest Cabins

Crie uma aplicação web completa, premium, responsiva e funcional para aluguel de cabanas chamada provisoriamente:

NOMA

Forest Cabins

A proposta da marca é transmitir:

* luxo imersivo na natureza;

* exclusividade;

* silêncio;

* floresta;

* arquitetura contemporânea;

* madeira;

* iluminação quente;

* privacidade;

* hotel boutique;

* experiência premium.

O projeto não deve parecer:

* um template de pousada;

* Airbnb clone;

* Booking clone;

* dashboard SaaS;

* landing page genérica;

* site turístico convencional.

A experiência deve ser cinematográfica, elegante e diferenciada desde o primeiro scroll até a conclusão da reserva.

Além do site institucional, o projeto deverá possuir um sistema real de reservas, com:

* calendário;

* disponibilidade;

* preço por data;

* quantidade de hóspedes;

* diferentes cabanas;

* reservas persistidas no banco;

* prevenção de conflito de reservas;

* painel administrativo;

* administrador responsável por cada cabana;

* gerenciamento de preços;

* bloqueio de datas;

* gestão das reservas;

* integração com WhatsApp;

* botão para o hóspede conversar com a empresa;

* notificação automática no WhatsApp da empresa quando uma nova reserva for realizada.

⸻

1. STACK

Preferencialmente utilizar:

* React;

* TypeScript;

* Tailwind CSS;

* Supabase;

* PostgreSQL;

* Supabase Auth;

* Supabase Edge Functions quando necessário;

* Row Level Security;

* componentes headless quando necessários;

* Framer Motion quando adequado.

A aplicação deve estar preparada para produção.

Não utilizar dados mockados como solução definitiva.

Seeds podem ser usados somente para demonstrar a aplicação.

⸻

2. IDENTIDADE VISUAL

A sensação desejada é:

luxo silencioso em meio à floresta.

O site deve trabalhar com:

* fundos muito escuros;

* fotografias cinematográficas;

* verdes profundos;

* tons naturais;

* bege;

* madeira;

* tipografia editorial;

* grandes áreas de respiro;

* animações suaves.

Evitar:

* excesso de cards;

* caixas brancas;

* cores saturadas;

* bordas exageradas;

* sombras pesadas;

* interface genérica.

⸻

3. PALETA

Background principal:

#0B110D

Deep Pine:

#111A14

Moss Green:

#526B4E

Sage Forest:

#7E9675

Warm Sand:

#D8CEBB

Ivory:

#F1EEE7

Mist Gray:

#AAAFA8

Warm Gold:

#B99867

O dourado deve ser utilizado apenas como detalhe.

⸻

4. TIPOGRAFIA

Títulos:

Cormorant Garamond

Textos e interface:

Manrope

Utilizar contrastes editoriais.

Exemplo:

Onde a floresta

encontra o conforto.

Com textos menores utilizando Manrope.

⸻

5. TIPOS DE USUÁRIOS

Criar três tipos principais:

Visitante

Pode:

* visualizar cabanas;

* visualizar preços;

* consultar disponibilidade;

* selecionar datas;

* selecionar hóspedes;

* realizar reserva;

* entrar em contato por WhatsApp.

Não exigir cadastro para reservar.

⸻

Cabin Admin

Administrador responsável por uma ou mais cabanas.

Pode:

* visualizar somente suas cabanas;

* visualizar reservas dessas cabanas;

* gerenciar disponibilidade;

* bloquear datas;

* alterar preços;

* confirmar reservas;

* cancelar reservas.

⸻

Super Admin

Pode:

* visualizar todas as cabanas;

* visualizar todas as reservas;

* criar cabanas;

* editar cabanas;

* gerenciar administradores;

* atribuir administradores;

* configurar integrações;

* configurar WhatsApp;

* visualizar métricas.

⸻

6. BANCO DE DADOS

Criar estrutura organizada.

⸻

cabins

Campos:

* id

* name

* slug

* description

* short_description

* location

* max_guests

* bedrooms

* beds

* bathrooms

* base_price

* cleaning_fee

* status

* cover_image

* gallery

* amenities

* whatsapp_number opcional

* created_at

* updated_at

Status:

* active

* inactive

* maintenance

O campo:

whatsapp_number

pode permitir futuramente que cada cabana possua um número responsável diferente.

⸻

profiles

Campos:

* id

* full_name

* email

* role

* whatsapp_number

* created_at

Roles:

* super_admin

* cabin_admin

⸻

cabin_admins

Campos:

* id

* cabin_id

* user_id

Relacionar administradores às cabanas.

Permitir:

* uma cabana com vários responsáveis;

* um administrador com várias cabanas.

⸻

7. CONFIGURAÇÕES DA EMPRESA

Criar tabela:

business_settings

Campos:

* id

* business_name

* business_whatsapp

* notification_whatsapp

* instagram_url

* contact_email

* address

* timezone

* whatsapp_notifications_enabled

* created_at

* updated_at

Utilizar:

America/Sao_Paulo

como timezone principal.

⸻

8. PREÇO POR DATA

Criar:

cabin_daily_rates

Campos:

* id

* cabin_id

* date

* price

* min_nights

* is_available

* created_at

* updated_at

O sistema deve possuir preço base e permitir substituição por data.

Exemplo:

segunda:

R$ 690

sexta:

R$ 790

sábado:

R$ 990

feriado:

R$ 1.290

Se houver:

cabin_daily_rates.price

utilizar esse preço.

Caso contrário:

utilizar:

cabins.base_price

⸻

9. DATAS BLOQUEADAS

Criar:

cabin_blocked_dates

Campos:

* id

* cabin_id

* start_date

* end_date

* reason

* created_by

* created_at

Motivos:

* manutenção;

* uso interno;

* bloqueio manual;

* indisponibilidade;

* outro.

Essas datas não podem ser reservadas.

⸻

10. RESERVAS

Criar:

bookings

Campos:

* id

* booking_code

* cabin_id

* guest_name

* guest_email

* guest_phone

* guest_document

* check_in

* check_out

* guests

* adults

* children

* nights

* accommodation_subtotal

* cleaning_fee

* additional_fees

* discount

* total_amount

* status

* notes

* whatsapp_notification_status

* whatsapp_notification_sent_at

* created_at

* updated_at

Status:

* pending

* confirmed

* cancelled

* completed

Status de WhatsApp:

* pending

* sent

* failed

* disabled

Gerar código amigável.

Exemplo:

NOMA-A7K92P

⸻

11. VALORES HISTÓRICOS DA RESERVA

Criar:

booking_nights

Campos:

* id

* booking_id

* date

* nightly_rate

Isso deve preservar exatamente os valores apresentados ao cliente.

Exemplo:

18 agosto:

R$ 690

19 agosto:

R$ 790

20 agosto:

R$ 990

Se posteriormente o administrador alterar os preços, a reserva antiga deve continuar com os valores originais.

⸻

12. DISPONIBILIDADE

Utilizar regra real.

Reservas com status:

* pending;

* confirmed;

devem bloquear o período.

Considerar reserva como:

[check_in, check_out)

Check-out não ocupa uma nova diária.

Exemplo:

Check-in:

10 agosto

Check-out:

12 agosto

Noites ocupadas:

10 → 11

11 → 12

Outro hóspede pode entrar dia 12.

Detectar sobreposição quando:

existing.check_in < requested.check_out

e:

existing.check_out > requested.check_in

⸻

13. DOUBLE BOOKING

Isso é crítico.

Não confiar apenas no frontend.

Antes de criar uma reserva:

1. validar cabana;

2. consultar disponibilidade novamente;

3. consultar datas bloqueadas;

4. consultar reservas existentes;

5. validar capacidade;

6. validar estadia mínima;

7. recalcular todas as diárias;

8. recalcular taxas;

9. validar total;

10. inserir a reserva de maneira segura;

11. registrar booking_nights;

12. disparar notificações.

Utilizar transação ou estratégia equivalente sempre que possível.

Nunca permitir que duas reservas simultâneas sejam confirmadas para o mesmo período.

⸻

14. CALENDÁRIO PÚBLICO

O calendário é um elemento central da identidade.

NÃO utilizar visual genérico.

NÃO utilizar datepicker padrão.

NÃO utilizar input date nativo como experiência principal.

Criar componente visual personalizado.

Fundo:

Deep Pine.

Datas:

Ivory.

Preço:

Mist Gray / Warm Gold.

Seleção:

Sage Forest.

Bordas:

muito discretas.

⸻

15. CADA DATA

Mostrar:

18

R$ 690

ou visual equivalente.

Cada dia deve possuir seus próprios estados.

⸻

16. DATA DISPONÍVEL

Mostrar:

* número;

* preço;

* hover;

* cursor ativo.

⸻

17. DATA INDISPONÍVEL

Mostrar:

* opacity reduzida;

* não clicável;

* sem interação.

Tooltip opcional:

Indisponível

Nunca revelar publicamente:

“Manutenção”

“Uso proprietário”

ou qualquer motivo administrativo.

⸻

18. PERÍODO SELECIONADO

Criar visual contínuo entre:

check-in → check-out.

Check-in deve ser destacado.

Datas intermediárias possuem preenchimento mais suave.

Check-out possui destaque próprio.

⸻

19. MOBILE

Desktop:

dois meses lado a lado.

Mobile:

um mês.

No celular abrir em:

* bottom sheet;

* drawer;

* modal fullscreen.

Nunca criar um calendário minúsculo.

⸻

20. COMPONENTES DE FORMULÁRIO

TODOS os campos devem ser estilizados conforme a identidade da NOMA.

Isto é extremamente importante.

Não utilizar visual padrão para:

* selects;

* datepicker;

* dropdown;

* radio;

* checkbox;

* popover;

* autocomplete;

* guest selector.

Pode utilizar Radix, Headless UI ou outra primitive acessível, porém a aparência deve ser criada especificamente para a marca.

⸻

21. SELETOR DE HÓSPEDES

Criar popover personalizado.

Exemplo:

Adultos

13 anos ou mais

−      2      +

Crianças

2–12 anos

−      0      +

Mostrar no campo:

2 hóspedes

Nunca permitir ultrapassar:

cabins.max_guests

⸻

22. HOME — RESERVA RÁPIDA

Criar uma barra de reserva premium.

Exemplo:

CHECK-IN

18 AGO

CHECK-OUT

20 AGO

HÓSPEDES

02

ENCONTRAR CABANA →

No desktop:

horizontal.

No mobile:

adaptar verticalmente.

⸻

23. FLUXO DE RESERVA

PASSO 1

Usuário seleciona:

* cabana;

* check-in;

* check-out;

* adultos;

* crianças.

⸻

PASSO 2

Sistema consulta disponibilidade real.

⸻

PASSO 3

Sistema calcula cada diária.

⸻

PASSO 4

Mostrar resumo.

Exemplo:

Cabana Aurora

18 → 21 agosto

3 noites

2 hóspedes

18 ago

R$ 690

19 ago

R$ 790

20 ago

R$ 990

Subtotal:

R$ 2.470

Taxa de limpeza:

R$ 150

Total

R$ 2.620

⸻

24. DADOS DO HÓSPEDE

Solicitar:

Nome completo

Telefone / WhatsApp

E-mail

Documento opcional

Observações opcionais

Estilizar todos os inputs.

Usar:

* fundo escuro;

* borda discreta;

* Sage Forest no focus;

* labels elegantes;

* validação visual;

* mensagens de erro integradas à identidade.

⸻

25. CRIAÇÃO DA RESERVA

Antes da confirmação:

verificar disponibilidade novamente.

Se o período continuar disponível:

1. criar booking;

2. criar booking_nights;

3. registrar valor;

4. gerar booking_code;

5. retornar confirmação;

6. iniciar notificação WhatsApp.

⸻

26. WHATSAPP — BOTÃO DE CONTATO

Adicionar um botão de WhatsApp ao site.

Pode aparecer:

* header;

* página da cabana;

* fluxo de reserva;

* footer;

* botão flutuante discreto.

Texto sugerido:

Falar com a NOMA

ou:

Falar pelo WhatsApp

Ícone do WhatsApp pode ser utilizado, mas não criar um botão verde neon destoando da identidade.

O botão deve seguir a estética da marca.

Exemplo:

fundo:

Sage Forest.

Ou:

fundo translúcido com borda Sage.

⸻

27. LINK DIRETO PARA WHATSAPP

Ao clicar:

abrir conversa com o WhatsApp configurado em:

business_settings.business_whatsapp

Utilizar mensagem inicial pré-preenchida.

Exemplo:

Olá! Estou vendo as cabanas da NOMA e gostaria de tirar uma dúvida.

Se o usuário estiver em uma página específica:

Olá! Estou vendo a Cabana Aurora no site da NOMA e gostaria de tirar uma dúvida.

Se já possuir datas selecionadas:

Olá! Estou interessado na Cabana Aurora de 18/08 a 21/08 para 2 hóspedes. Gostaria de tirar uma dúvida.

Gerar a mensagem dinamicamente.

⸻

28. WHATSAPP APÓS A RESERVA

Quando uma reserva for criada com sucesso, enviar automaticamente uma mensagem ao WhatsApp configurado da empresa ou responsável.

IMPORTANTE:

isso NÃO deve ser implementado apenas com:

window.open()

ou:

wa.me

A mensagem do cliente para a empresa precisa ser disparada server-side através de uma integração apropriada.

Preparar arquitetura para:

WhatsApp Business Cloud API

ou outro provider configurado.

Utilizar:

* Supabase Edge Function;

* função backend;

* webhook;

* API server-side.

Nunca expor tokens do WhatsApp no frontend.

⸻

29. WHATSAPP BUSINESS CONFIG

Utilizar variáveis de ambiente.

Exemplo conceitual:

WHATSAPP_ACCESS_TOKEN

WHATSAPP_PHONE_NUMBER_ID

WHATSAPP_BUSINESS_ACCOUNT_ID

WHATSAPP_NOTIFICATION_NUMBER

Nunca colocar essas credenciais no código frontend.

⸻

30. NOTIFICAÇÃO DA EMPRESA

Depois da nova reserva, enviar algo semelhante:

🌲 Nova reserva NOMA

Reserva: NOMA-A7K92P

Cabana: Aurora

Hóspede: João Silva

Telefone: (64) 99999-9999

Check-in: 18/08/2026

Check-out: 21/08/2026

Hóspedes: 2

Noites: 3

Valor: R$ 2.620,00

Status: Pendente

Uma nova reserva foi realizada pelo site.

Se possível:

Ver reserva: https://dominio.com/admin/reservas/ID

⸻

31. RESPONSÁVEL PELA CABANA

A notificação deve respeitar a seguinte prioridade.

Primeiro verificar:

se a cabana possui um administrador responsável com:

profiles.whatsapp_number

Se houver configuração para enviar ao administrador:

enviar ao administrador da cabana.

Também permitir configuração para enviar:

* apenas à empresa;

* apenas ao responsável;

* aos dois.

Criar isso de forma extensível.

⸻

32. CONFIGURAÇÕES DE NOTIFICAÇÃO

Adicionar no admin:

Configurações → WhatsApp

Opções:

Notificar nova reserva:

Ativado

Enviar para:

Empresa

Responsável da cabana

Ambos

Número da empresa:

+55 64 ...

Permitir editar configurações.

⸻

33. LOG DE NOTIFICAÇÕES

Criar tabela:

notification_logs

Campos:

* id

* booking_id

* type

* recipient

* channel

* status

* provider_message_id

* error_message

* created_at

* sent_at

Channel:

whatsapp

Type:

* booking_created;

* booking_confirmed;

* booking_cancelled.

Status:

* pending;

* sent;

* failed.

Isso permitirá saber se a mensagem realmente foi enviada.

⸻

34. FALHA NO WHATSAPP

A reserva NÃO deve falhar apenas porque a notificação do WhatsApp falhou.

Fluxo:

1. reserva é persistida;

2. sistema confirma a reserva;

3. tentativa de WhatsApp é realizada;

4. caso falhe, registrar erro.

Admin pode visualizar:

Reserva criada

Notificação WhatsApp não enviada

e tentar novamente.

⸻

35. REENVIAR NOTIFICAÇÃO

Dentro da reserva no painel administrativo:

adicionar opção:

Reenviar notificação

Isso deve chamar novamente o backend.

⸻

36. WHATSAPP PARA O CLIENTE

Na tela de sucesso mostrar:

Falar com a equipe

Ao clicar:

abrir WhatsApp da empresa.

Mensagem:

Olá! Acabei de realizar a reserva NOMA-A7K92P pelo site e gostaria de falar com a equipe.

⸻

37. FUTURA CONFIRMAÇÃO VIA WHATSAPP

Estruturar o código para permitir futuramente enviar ao cliente:

* confirmação;

* lembrete;

* instruções de chegada;

* localização;

* cancelamento.

Mas não é necessário implementar automações complexas nesta primeira versão.

⸻

38. TELA DE SUCESSO

Após reserva:

Seu refúgio está reservado.

Reserva:

NOMA-A7K92P

Cabana Aurora

18 — 21 agosto

2 hóspedes

R$ 2.620

Mostrar:

Falar com a equipe pelo WhatsApp

Voltar ao início

Criar animação elegante de conclusão.

Evitar confete ou estilo SaaS.

⸻

39. CONFLITO DURANTE FINALIZAÇÃO

Se outro cliente reservar as datas enquanto o usuário estava preenchendo seus dados:

não criar a reserva.

Mostrar:

Essas datas acabaram de ficar indisponíveis.

Outro hóspede concluiu uma reserva para este período.

Escolher novas datas

Atualizar calendário automaticamente.

⸻

40. PAINEL ADMINISTRATIVO

Criar:

/admin

Login seguro.

Manter linguagem visual da NOMA.

Não criar dashboard azul/branco padrão.

⸻

41. ADMIN DASHBOARD

Mostrar:

* reservas de hoje;

* próximos check-ins;

* próximos check-outs;

* reservas pendentes;

* reservas confirmadas;

* ocupação;

* receita prevista;

* últimas reservas.

⸻

42. RESERVAS RECENTES

Criar destaque para:

Nova reserva

Mostrar reservas recém-criadas.

Informações:

* código;

* cabana;

* cliente;

* datas;

* total;

* status.

⸻

43. ADMIN CALENDÁRIO

Criar calendário completo.

Mostrar:

* ocupação;

* preços;

* disponibilidade;

* bloqueios;

* reservas.

Exemplo:

18

R$ 690

Disponível

⸻

19

João Silva

Reservado

⸻

20

João Silva

Reservado

⸻

21

R$ 990

Disponível

⸻

44. ALTERAÇÃO DE PREÇOS

Permitir clicar em uma data.

Abrir modal premium:

Editar diária

Data:

22 dezembro

Preço:

R$ 1.290

Estadia mínima:

3

Disponível:

Sim

Salvar

⸻

45. EDIÇÃO EM LOTE

Selecionar:

22 → 31 dezembro

Aplicar:

Preço:

R$ 1.290

Estadia mínima:

3 noites

Salvar em todas as datas selecionadas.

⸻

46. BLOQUEAR DATAS

Selecionar período.

Exemplo:

05 setembro → 08 setembro.

Botão:

Bloquear período

Motivo interno:

Manutenção.

Salvar no banco.

Refletir imediatamente no calendário público.

⸻

47. LISTA DE RESERVAS

Criar:

/admin/reservas

Tabela/listagem premium.

Mostrar:

Código

Hóspede

Cabana

Check-in

Check-out

Hóspedes

Valor

Status

Criado em

Notificação WhatsApp

⸻

48. DETALHES DA RESERVA

Página:

/admin/reservas/[id]

Mostrar:

Código

Cabana

Nome

WhatsApp

E-mail

Datas

Hóspedes

Diárias

Taxas

Total

Status

Observações

WhatsApp notification status

Criado em

⸻

49. AÇÕES DA RESERVA

Permitir:

Confirmar reserva

Cancelar reserva

Falar com hóspede

Reenviar notificação

⸻

50. FALAR COM HÓSPEDE

Ao clicar:

Falar com hóspede

abrir WhatsApp.

Mensagem sugerida:

Olá João! Aqui é da NOMA Forest Cabins. Estamos entrando em contato sobre sua reserva NOMA-A7K92P para a Cabana Aurora.

⸻

51. CABIN ADMIN

Cabin admin só pode acessar cabanas atribuídas.

Aplicar isso no banco usando RLS.

Não apenas esconder páginas.

Se tentar acessar outra reserva diretamente pela URL:

acesso negado.

⸻

52. SUPER ADMIN

Pode:

* gerenciar tudo;

* criar cabanas;

* excluir/desativar cabanas;

* gerenciar usuários;

* atribuir administradores;

* alterar configurações de WhatsApp;

* acessar todas as reservas.

⸻

53. HOME — HERO

Criar hero fullscreen.

Fotografia cinematográfica.

Texto pequeno:

RIO VERDE · GOIÁS

Título:

Onde a floresta

encontra o conforto.

Descrição:

Cabanas privadas criadas para desaparecer da rotina.

Botão:

Explorar cabanas ↓

Mostrar:

A partir de R$ 690 / noite

⸻

54. HERO — ANIMAÇÃO

Durante scroll:

* zoom lento;

* parallax;

* texto sobe;

* opacity diminui;

* imagem escurece;

* próxima seção aparece.

Movimento elegante e natural.

⸻

55. HEADER

Criar header:

* arredondado;

* flutuante;

* transparente;

* backdrop blur;

* afastado do topo;

* afastado das laterais.

Links:

NOMA

Cabanas

Experiência

Galeria

Localização

Reservar

Ao descer:

header desaparece.

Ao subir:

header retorna.

No topo:

mais transparente.

⸻

56. WHATSAPP NO HEADER

Adicionar ícone ou ação discreta:

WhatsApp

Não deve competir visualmente com:

Reservar

Reservar continua sendo CTA primário.

⸻

57. SEÇÃO CONCEITUAL

Criar:

Você não vem aqui

apenas para dormir.

Depois:

Você vem para

desaparecer por alguns dias.

Revelação de texto conforme scroll.

⸻

58. CABANAS

Não utilizar grid padrão.

Criar experiências grandes.

01

Aurora

2 hóspedes

1 cama king

Hidromassagem

Vista para floresta

A partir de:

R$ 690 / noite

Conhecer Aurora →

⸻

02

Selva

4 hóspedes

2 quartos

Hidromassagem

Vista panorâmica

R$ 890 / noite

⸻

59. PÁGINA INDIVIDUAL

Criar:

/cabanas/[slug]

Mostrar:

* hero;

* galeria;

* descrição;

* comodidades;

* quantidade máxima de hóspedes;

* localização;

* disponibilidade;

* calendário;

* preços;

* booking card;

* botão WhatsApp.

⸻

60. BOOKING CARD

Desktop:

sticky lateral.

Mostrar:

R$ 790 / noite

Check-in

Check-out

Hóspedes

Reservar

Também adicionar:

Tirar dúvida pelo WhatsApp

como CTA secundário.

⸻

61. EXPERIÊNCIA

Seção:

Escolha como quer desaparecer.

Natureza

Conforto

Silêncio

Hover muda background.

No mobile:

mudança baseada no scroll.

⸻

62. GALERIA

Criar horizontal scroll controlado pelo scroll vertical.

Mostrar:

* interior;

* quarto;

* banheira;

* deck;

* fogueira;

* floresta;

* noite.

Frases:

Sem despertadores.

Sem trânsito.

Sem pressa.

⸻

63. COMODIDADES

Tudo foi pensado

para você não precisar pensar.

Cama King

Roupa de cama premium.

Hidro privativa

Vista para a mata.

Café artesanal

Selecionado localmente.

Fogueira

Para noites mais longas.

Wi-Fi

Caso o mundo precise encontrar você.

⸻

64. LOCALIZAÇÃO

Perto o suficiente.

Longe o necessário.

Mostrar:

18 min do centro

4 km de estrada rural

Localização completa enviada após reserva

⸻

65. CTA FINAL

Quando você quer desaparecer?

Mostrar novamente:

* cabana;

* check-in;

* check-out;

* hóspedes.

Botão:

Encontrar cabana

Abaixo:

Prefere falar com alguém? WhatsApp →

⸻

66. FOOTER

Grande e editorial.

Nos vemos

entre as árvores.

NOMA

Instagram

WhatsApp

Localização

Políticas

Termos

Privacidade

⸻

67. ANIMAÇÕES

Utilizar:

* Framer Motion;

* Intersection Observer;

* CSS transforms;

* opacity;

* clip-path;

* sticky sections;

* masks;

* parallax;

* text reveal.

Priorizar:

transform + opacity.

⸻

68. TIMING

Animações:

0.8s – 1.4s

Easings suaves.

Evitar animações rápidas.

⸻

69. MICROINTERAÇÕES

Adicionar:

* underline animado;

* setas com movimento;

* hover sutil;

* cursor interativo em áreas especiais;

* alteração leve de escala em imagens;

* transições no calendário;

* botão magnético extremamente sutil quando adequado.

⸻

70. ACCESSIBILITY

Respeitar:

prefers-reduced-motion

Garantir:

* teclado;

* aria labels;

* foco;

* contraste;

* componentes acessíveis.

⸻

71. RESPONSIVIDADE

Desktop.

Notebook.

Tablet.

Mobile.

Pequenos smartphones.

Não apenas comprimir o desktop.

Criar experiência específica para mobile.

⸻

72. ESTADO DA RESERVA

Criar estado global com:

* cabinId;

* checkIn;

* checkOut;

* adults;

* children;

* totalGuests;

* nightlyRates;

* subtotal;

* fees;

* total.

Seleções devem permanecer ao navegar entre páginas.

⸻

73. FORMATAÇÃO

Moeda:

R$ 1.290,00

ou:

R$ 1.290

Datas:

18 ago

ou:

18 de agosto

Nunca mostrar formato americano ao usuário brasileiro.

⸻

74. TIMEZONE

Usar:

America/Sao_Paulo

Tratar check-in e check-out como datas locais.

Não permitir problema clássico:

usuário seleciona dia 18 e sistema salva dia 17.

⸻

75. VALIDAÇÕES

Não permitir:

* check-out anterior ao check-in;

* check-out igual ao check-in;

* 0 hóspedes;

* hóspedes acima da capacidade;

* datas passadas;

* cabana inativa;

* data bloqueada;

* período reservado;

* estadia menor que mínimo;

* nome vazio;

* telefone vazio;

* e-mail inválido.

⸻

76. ESTADIA MÍNIMA

Se:

min_nights = 3

e usuário escolher:

2 noites,

mostrar:

Esta data exige estadia mínima de 3 noites.

⸻

77. CÁLCULO DE NOITES

18 → 20 agosto

=

2 noites.

Nunca 3.

⸻

78. SEGURANÇA

Utilizar RLS.

Não disponibilizar publicamente:

* hóspedes;

* telefone;

* e-mail;

* documentos;

* observações;

* dados administrativos.

Tokens da API do WhatsApp:

somente server-side.

⸻

79. LGPD

Coletar apenas informações necessárias para a reserva.

Criar:

* política de privacidade;

* consentimento adequado;

* tratamento seguro de dados pessoais.

Não expor informações do cliente em URLs públicas.

⸻

80. PERFORMANCE

Utilizar:

* WebP;

* AVIF;

* responsive images;

* lazy loading;

* preload seletivo;

* code splitting;

* carregamento progressivo.

Não carregar toda a galeria no primeiro paint.

⸻

81. SEO

Configurar:

* title;

* meta description;

* Open Graph;

* canonical;

* structured data;

* URLs semânticas;

* alt text.

⸻

82. COMPONENTES REUTILIZÁVEIS

Criar:

FloatingHeader

HeroSection

CabinShowcase

BookingBar

BookingCalendar

GuestSelector

PriceBreakdown

CabinAvailability

BookingForm

BookingSuccess

WhatsAppButton

WhatsAppContactCTA

AdminCalendar

ReservationTable

ReservationDetails

RateEditor

BlockDatesModal

PremiumInput

PremiumSelect

PremiumPopover

PremiumModal

⸻

83. SERVIÇOS

Separar lógica em services.

Exemplo:

availabilityService

pricingService

bookingService

notificationService

whatsappService

cabinService

Evitar lógica importante espalhada nos componentes React.

⸻

84. WHATSAPP SERVICE

Criar camada independente para envio.

Exemplo conceitual:

sendBookingCreatedNotification()

sendBookingConfirmedNotification()

sendBookingCancelledNotification()

sendWhatsAppMessage()

Isso permitirá trocar o provider futuramente sem alterar toda a aplicação.

⸻

85. WEBHOOK

Preparar estrutura para receber status do provider de WhatsApp quando suportado.

Exemplo:

sent

delivered

read

failed

Atualizar:

notification_logs

quando apropriado.

⸻

86. DEMO

Criar inicialmente:

Cabana Aurora

Capacidade:

2 hóspedes.

Preço base:

R$ 690.

Comodidades:

* cama king;

* hidromassagem;

* cozinha;

* deck;

* fogueira;

* Wi-Fi;

* ar-condicionado.

⸻

Cabana Selva

Capacidade:

4 hóspedes.

Preço:

R$ 890.

Comodidades:

* 2 quartos;

* hidromassagem;

* cozinha;

* deck;

* fogueira;

* vista panorâmica.

⸻

87. DADOS DE DEMONSTRAÇÃO

Popular algumas datas com:

Dias úteis:

R$ 690

Sexta:

R$ 790

Sábado:

R$ 990

Feriado:

R$ 1.190

Criar também algumas reservas para mostrar datas ocupadas.

⸻

88. NÃO SIMULAR FUNCIONALIDADES

Se houver:

Reservar

deve reservar.

Bloquear datas

deve salvar.

Alterar preço

deve persistir.

Confirmar

deve alterar status.

Falar no WhatsApp

deve abrir contato real configurado.

Reenviar notificação

deve chamar o backend.

Não criar botões puramente decorativos quando fazem parte do escopo funcional.

⸻

89. TRATAMENTO DE ERROS

Tratar:

* falha de rede;

* conflito de datas;

* reserva indisponível;

* sessão expirada;

* erro de permissão;

* erro no banco;

* erro no WhatsApp;

* indisponibilidade do provider;

* erro ao atualizar preço;

* erro ao bloquear data.

Nunca deixar a tela travada.

⸻

90. EXPERIÊNCIA PREMIUM

A prioridade do projeto não é somente criar uma landing page bonita.

O sistema funcional deve receber o mesmo cuidado visual.

Especialmente:

* calendário;

* booking;

* guest selector;

* formulário;

* resumo;

* checkout;

* WhatsApp;

* sucesso;

* admin.

NÃO UTILIZAR COMPONENTES GENÉRICOS NOS CAMPOS DE RESERVA.

Essa exigência é fundamental.

⸻

91. REGRA PARA WHATSAPP

Existem dois comportamentos completamente diferentes e eles não devem ser confundidos.

Contato iniciado pelo cliente

Pode utilizar link para WhatsApp com mensagem pré-preenchida.

Notificação automática enviada pela aplicação

Deve ocorrer server-side utilizando API/provider apropriado.

Nunca fingir que uma mensagem foi enviada automaticamente apenas abrindo um link do WhatsApp.

⸻

92. FLUXO COMPLETO ESPERADO

O fluxo final deve funcionar assim:

Visitante entra no site.

↓

Explora as cabanas.

↓

Seleciona Aurora.

↓

Abre calendário personalizado.

↓

Visualiza preços e disponibilidade.

↓

Seleciona:

18 agosto → 21 agosto.

↓

Seleciona:

2 hóspedes.

↓

Sistema calcula valores.

↓

Cliente preenche:

nome;

telefone;

e-mail.

↓

Backend verifica disponibilidade novamente.

↓

Reserva é criada.

↓

Código é gerado:

NOMA-A7K92P

↓

Diárias são registradas.

↓

Cliente recebe tela de sucesso.

↓

Sistema envia automaticamente uma notificação via WhatsApp para o responsável/empresa.

↓

Admin recebe:

🌲 Nova reserva NOMA

↓

Reserva aparece imediatamente no painel administrativo.

↓

Datas passam a aparecer como indisponíveis no calendário público.

⸻

93. PRIORIDADE DE DESENVOLVIMENTO

Desenvolver nesta ordem:

1. arquitetura;

2. banco de dados;

3. autenticação;

4. RLS;

5. modelo das cabanas;

6. preços;

7. disponibilidade;

8. reservas;

9. prevenção de double booking;

10. booking_nights;

11. WhatsApp backend;

12. logs de notificações;

13. painel administrativo;

14. calendário público;

15. booking UI;

16. identidade visual;

17. animações;

18. mobile;

19. accessibility;

20. performance.

Não construir primeiro uma landing page estática para só depois pensar nas regras do sistema.

⸻

94. RESULTADO FINAL

O resultado deve transmitir:

hotel boutique + floresta + luxo + arquitetura + experiência digital cinematográfica.

A NOMA deve parecer uma marca premium real.

O usuário deve conseguir:

* descobrir cabanas;

* visualizar preços por data;

* verificar dias disponíveis;

* selecionar hóspedes;

* reservar;

* entrar em contato pelo WhatsApp;

* receber confirmação visual da reserva.

O proprietário deve:

* receber a reserva no painel;

* receber automaticamente uma notificação no WhatsApp;

* identificar o hóspede;

* identificar a cabana;

* visualizar datas;

* visualizar valor;

* acessar a reserva;

* conversar com o hóspede pelo WhatsApp;

* alterar disponibilidade;

* gerenciar preços.

Todo o projeto deve manter a mesma identidade premium, inclusive nos componentes funcionais.

Não aceite como resultado final componentes genéricos, funcionalidades simuladas ou lógica de reserva apenas visual.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://lobocabanas.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f60ee362-ad83-497a-9d0c-5ab5a52af920).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
