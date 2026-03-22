# Prompts para Google Stitch — CRM Jurídica Multiagente

## Contexto do Projeto

**Juris AI** é um CRM jurídico de próxima geração projetado para escritórios de advocacia brasileiros, desde advogados autônomos até grandes bancas. A plataforma automatiza o fluxo de trabalho do advogado por meio de agentes de IA que operam 24/7, realizando triagem de leads via WhatsApp, monitorando movimentações processuais (Datajud/Jusbrasil), calculando prazos conforme o CPC (Código de Processo Civil), gerenciando o financeiro (custas, alvarás, honorários) e automatizando follow-ups com clientes. O sistema conta com um Inbox unificado estilo Chatwoot (WhatsApp + E-mail + Chat) com transbordo inteligente (Human-in-the-Loop): a IA atende até detectar complexidade, pausa e alerta o advogado, que assume a conversa e depois devolve ao robô. A plataforma é multi-tenant (vários escritórios no mesmo banco), com isolamento total de dados, conformidade com LGPD e regras da OAB. A identidade visual segue o conceito de Legal Design — interfaces limpas que reduzem a carga cognitiva, com zonas de urgência que destacam prazos fatais.

> Use cada prompt abaixo no Google Stitch para gerar a tela correspondente.
> **Estilo geral:** Dark mode profissional jurídico, paleta navy/slate com acentos dourados (#C9A96E), tipografia Inter, cantos arredondados, glassmorphism sutil, micro-animações. Layout F-pattern onde aplicável. Fuso horário sempre `America/Sao_Paulo`.

---

## 1. Login

**Prompt:**

```
Design a premium dark-mode login page for a legal CRM called "Juris AI". 

Background: deep navy (#0F172A) with a subtle radial gradient. Center a glassmorphism card (rgba white, blur backdrop) containing:
- Logo at top: scales of justice icon + "Juris AI" text in gold (#C9A96E)
- "Bem-vindo de volta" heading (white, Inter font, 24px)
- Subtitle: "Gerencie seu escritório com inteligência artificial" (slate-400)
- Email input field with email icon, placeholder "seu@email.com"
- Password input field with lock icon and show/hide toggle
- "Esqueci minha senha" link aligned right (gold color)
- Large "Entrar" button (gold gradient, full width, rounded)
- Divider "ou" with lines
- "Entrar com Google" button (outlined, white border)
- Footer: "Não tem conta? Cadastre-se" link (gold underline)

Bottom of page: "© 2026 Juris AI — Powered by IA" in small muted text. No device frames. Desktop 1440px wide.
```

---

## 2. Cadastro (Signup)

**Prompt:**

```
Design a premium dark-mode signup page for a legal CRM called "Juris AI".

Same dark background as login (#0F172A radial gradient). Center a glassmorphism card with:
- Logo: scales of justice icon + "Juris AI" in gold (#C9A96E)
- "Crie sua conta" heading (white, 24px)
- Subtitle: "Configure seu escritório em minutos"
- Form fields (each with icon + label above):
  1. "Nome completo" (user icon)
  2. "E-mail profissional" (email icon)
  3. "Senha" (lock icon, show/hide toggle)
  4. "Nome do escritório" (building icon)
  5. "OAB (opcional)" (badge/id icon)
- Checkbox: "Li e aceito os Termos de Uso e Política de Privacidade (LGPD)" 
- Large "Criar conta" button (gold gradient, full width)
- "Entrar com Google" button (outlined)
- Footer: "Já tem conta? Faça login" link

Desktop 1440px. No device frames.
```

---

## 3. Onboarding (Pós-Cadastro)

**Prompt:**

```
Design a dark-mode onboarding wizard (step 2 of 3) for a legal CRM called "Juris AI".

Background: dark navy (#0F172A). Top has a progress bar showing steps 1-2-3 with step 2 active (gold fill).

Main card (glassmorphism) contains:
- Step title: "Configure seu escritório" (white, 20px)
- Section 1 — "Áreas de atuação" with multi-select chips: Trabalhista, Cível, Criminal, Família, Previdenciário, Empresarial, Tributário, Consumidor, Imobiliário (user can select multiple, selected = gold border)
- Section 2 — "Equipe" with number stepper: "Quantos advogados atuam?" (1-100)
- Section 3 — "Integração WhatsApp" toggle switch with label "Conectar Evolution API" and small text "Configure depois em Configurações"
- Navigation: "Voltar" text button (left) + "Próximo" gold button (right)

Desktop 1440px.
```

---

## 4. Dashboard Principal

**Prompt:**

```
Design the main dashboard of a legal CRM called "Juris AI" in premium dark mode.

Layout: Left sidebar (240px, collapsed option) + main content area.

LEFT SIDEBAR (dark navy #0F172A, slightly lighter than background):
- Top: "Juris AI" logo (gold scales icon + text)
- Navigation items with icons (each with unread badge count where applicable):
  - Dashboard (home icon) — ACTIVE (gold highlight)
  - Casos (briefcase icon) — badge "12"
  - Contatos (users icon)
  - Inbox (message-square icon) — badge "5" red
  - Calendário (calendar icon)
  - Financeiro (dollar-sign icon)
  - IA & Skills (brain/sparkles icon)
  - Follow-up (repeat icon)
- Bottom section:
  - Configurações (gear icon)
  - User avatar + "Dr. João Silva" + "Escritório Silva & Associados"
  - "Sair" link

TOP BAR: 
- Breadcrumb: "Dashboard"
- Right side: Notification bell (badge "3"), timezone "São Paulo, BRT" display, user avatar dropdown

MAIN CONTENT (F-pattern layout, 4 columns grid):

ROW 1 (PRIORITY ZONE — top, full width):
- "Prazos Urgentes" card with red left border. Shows a list of 3 imminent deadlines:
  - "Contestação — Proc. 1234567" — "2 dias" badge (red)
  - "Recurso — Proc. 9876543" — "4 dias" badge (orange)  
  - "Audiência — Proc. 5551234" — "6 dias" badge (yellow)
- Each item has: case name, process number, countdown badge, responsible lawyer avatar

ROW 2 (2 columns, equal):
- LEFT: "Casos Ativos" card — Horizontal mini pipeline: "Novos (3)" → "Em andamento (8)" → "Aguardando (4)" → "Concluídos (12)" with small colored bars
- RIGHT: "Inbox" card — Shows 3 latest unread conversations: contact avatar, name, last message preview, timestamp, channel badge (WhatsApp/Email)

ROW 3 (2 columns, equal):
- LEFT: "Financeiro" card — Stats: "Receitas pendentes: R$ 45.200", "Alvarás expedidos: 2", "Guias vencendo: 1" with small sparkline chart
- RIGHT: "Atividade Recente" card — Feed of 4 recent events: "IA respondeu cliente João...", "Prazo calculado para Proc...", "Fatura #123 emitida...", "Movimentação detectada..."

All cards: glassmorphism style, rounded-xl, subtle border, hover shadow animation. Gold accent on headings. Desktop 1440px.
```

---

## 5. Casos (Lista)

**Prompt:**

```
Design the Cases list page of a legal CRM "Juris AI" in dark mode.

Same sidebar as dashboard (Casos is now ACTIVE with gold highlight).

TOP BAR: Breadcrumb "Dashboard > Casos". Right: search input + "Novo Caso" gold button with plus icon.

FILTERS BAR below topbar:
- Filter chips: "Todos", "Em andamento", "Aguardando", "Concluídos", "Arquivados" — "Em andamento" selected (gold)
- Dropdown: "Área do Direito" (Trabalhista, Cível, etc.)
- Dropdown: "Advogado responsável"
- Sort: "Ordenar por: Prazo mais próximo ↓"

MAIN CONTENT — Table/card hybrid:
Each case is a card row showing:
- Color-coded left border (green=andamento, yellow=aguardando, blue=concluído, red=urgente)
- Case title: "Silva vs. Empresa ABC — Trabalhista"
- Process number: "0001234-56.2025.5.01.0001"
- Client name with small avatar
- Area badge: "Trabalhista" (colored pill)
- Status badge: "Em andamento" 
- Responsible lawyer: avatar + name
- Next deadline: "Contestação — 3 dias" (red text if urgent)
- Last update: "Movimentação detectada há 2h"
- Kebab menu (⋯): "Ver dossiê", "Editar", "Arquivar"

Show 8 cases. Pagination at bottom: "Mostrando 1-8 de 47 casos" with page buttons.

Desktop 1440px.
```

---

## 6. Caso Individual (Dossiê)

**Prompt:**

```
Design a single Case detail page (dossier) for legal CRM "Juris AI" in dark mode.

TOP: Breadcrumb "Dashboard > Casos > Silva vs. Empresa ABC". Right: "Editar" button (outlined) + "Arquivar" button (red outlined).

HEADER CARD (full width, glassmorphism):
- Case title: "Silva vs. Empresa ABC" (large, white)
- Process number: "0001234-56.2025.5.01.0001" (mono font, copyable icon)
- Row of info pills: Area "Trabalhista" (blue), Status "Em andamento" (green), Urgency "Alta" (red), Client "Maria Silva"
- Responsible: avatar + "Dr. João Silva" | Created: "15/01/2025"

TABS below header: "Movimentações" (active) | "Documentos" | "Notas" | "Financeiro" | "IA Assistente"

TAB CONTENT — "Movimentações" (Timeline):
- Vertical timeline with connected dots:
  1. "21/03/2026 — Audiência Marcada" — badge "Datajud" — "Audiência de instrução marcada para 15/04/2026 às 14h" + auto-translated empathetic version preview
  2. "18/03/2026 — Contestação Protocolada" — badge "Manual" — attached document icon
  3. "10/03/2026 — Citação Recebida" — badge "Datajud" — prazo calculado "Contestação até 25/03" (red)
  4. "05/03/2026 — Distribuição" — badge "Datajud"

RIGHT SIDEBAR (280px):
- "Prazos Ativos" mini-card: 2 deadlines with countdown
- "Cliente" mini-card: Maria Silva, phone, email, WhatsApp quick-action buttons
- "Equipe" mini-card: assigned lawyers with avatars
- "Tags" mini-card: editable tags

Desktop 1440px.
```

---

## 7. Contatos (Lista)

**Prompt:**

```
Design the Contacts list page for legal CRM "Juris AI" in dark mode.

Sidebar: Contatos active (gold). Top bar: breadcrumb "Dashboard > Contatos". Right: search + "Novo Contato" gold button.

FILTERS: Filter chips "Todos", "Clientes", "Leads", "Ex-clientes". Dropdown "Lead Score". Search by name/CPF/OAB.

MAIN — Grid of contact cards (3 columns, 2 rows visible):
Each card (glassmorphism, rounded-xl):
- Avatar circle (initials if no photo) at top
- Name: "Maria da Silva" (white, bold)
- Type badge: "Cliente" (green) or "Lead" (yellow) or "Ex-cliente" (gray)
- Lead Score: ★★★★☆ (4/5 gold stars)
- Phone number + WhatsApp icon (clickable)
- Email (truncated)
- "Casos vinculados: 2"
- Last interaction: "Há 3 dias via WhatsApp"
- Action buttons row: "Ver perfil" (gold text), "WhatsApp" (green icon), "E-mail" (blue icon)

Show 6 cards. Pagination below.

Desktop 1440px.
```

---

## 8. Contato Individual

**Prompt:**

```
Design a Contact profile page for legal CRM "Juris AI" in dark mode.

TOP: Breadcrumb "Contatos > Maria da Silva". Right: "Editar" + "Enviar WhatsApp" (green button).

PROFILE HEADER (full width card):
- Large avatar (left) + Name "Maria da Silva" + Type "Cliente" badge + Lead Score stars
- Info row: CPF "***.***.***-12" (masked) | Phone | Email | Address (city/state)
- Tags: "Trabalhista", "VIP", "Indicação"

TWO COLUMN LAYOUT:

LEFT (60%):
- "Casos Vinculados" section — list of 2 case cards (mini version with status + area + last update)
- "Histórico de Interações" section — timeline of interactions:
  - "21/03 — WhatsApp: Cliente confirmou audiência" (channel badge)
  - "18/03 — E-mail: Documentos enviados" 
  - "15/03 — Reunião presencial: Coleta de documentos"
- "Documentos do Cliente" — file list with icons (PDF, DOC)

RIGHT (40%):
- "Follow-up Status" card — Current cadence stage, next touch date, auto/manual badge
- "Notas Internas" card — Private notes with add button, showing 2 notes with author avatar + date
- "Financeiro Resumido" card — Total faturado, pendente, prazo médio

Desktop 1440px.
```

---

## 9. Inbox Unificado

**Prompt:**

```
Design a unified Inbox page (Chatwoot-style) for legal CRM "Juris AI" in dark mode.

THREE-PANEL LAYOUT (sidebar + conversation list + message thread):

LEFT PANEL — Conversation List (320px):
- Top: "Inbox" heading + filter icons (funnel) + "Nova conversa" button
- Filter tabs: "Todas" | "WhatsApp" | "E-mail" | "Chat" — "Todas" active
- Tag filters: "Urgente" (red dot) | "Aguardando HITL" (yellow dot) | "Resolvido" (green dot)
- Conversation items (list):
  1. ACTIVE: Avatar "Maria S." + "Preciso saber sobre meu processo..." + "Há 5 min" + WhatsApp icon (green) + unread dot (gold) + AI badge "🤖 IA ativa"
  2. Avatar "João P." + "Obrigado pela informação" + "Há 2h" + Email icon (blue) + resolved checkmark
  3. Avatar "Ana M." + "⚠️ HITL — Aguardando advogado" + "Há 30 min" + WhatsApp icon + yellow warning badge
  4. Avatar "Carlos R." + "Quando é a próxima audiência?" + "Há 1 dia" + WhatsApp icon + AI badge
  5. Two more conversations...

MIDDLE PANEL — Message Thread (flex grow):
- Header: Contact avatar + "Maria da Silva" + "WhatsApp" badge + Status "IA Ativa" (green dot) + case link "Caso #1234"
- Action bar: "Atribuir" dropdown, "Tags" button, "Marcar resolvido" button, kebab menu (⋯)
- Messages area (scroll):
  - INCOMING (left aligned, dark card): "Boa tarde, gostaria de saber se houve alguma movimentação no meu processo?" — 14:32
  - OUTGOING (right aligned, gold-tinted card, "🤖 IA" badge): "Boa tarde, Maria! Sou a assistente virtual do escritório Silva & Associados. Verifiquei que houve uma movimentação recente: audiência marcada para 15/04. O Dr. João irá orientá-la sobre os próximos passos." — 14:33
  - SYSTEM (center, muted): "IA identificou complexidade — Transbordo solicitado" — 14:35
  - INCOMING: "Mas eu preciso saber se posso faltar na audiência, estou doente" — 14:36
  - SYSTEM: "⚠️ HITL ativo — Aguardando Dr. João Silva" — 14:36

- Input area at bottom: Text input "Digite uma mensagem..." + attachment icon + emoji icon + send button
- Toggle: "Nota privada" tab (yellow background indicator) next to "Mensagem" tab
- Below input: Quick replies button showing "📝 Respostas rápidas" + "Retomar IA" gold button (when HITL active)

RIGHT PANEL — Contact Info (280px):
- Contact card: avatar, name, phone, email, case link
- "Dados do caso" mini summary
- "Tags da conversa" editable pills
- "Notas privadas" section: add note + existing notes from team
- "Atribuído a" with lawyer avatar and reassign button

Desktop 1440px.
```

---

## 10. Calendário

**Prompt:**

```
Design a Calendar page for legal CRM "Juris AI" in dark mode.

Sidebar: Calendário active. Top bar: breadcrumb "Dashboard > Calendário". Right: View toggle "Mês | Semana | Dia" + "Novo Evento" gold button.

MAIN — Full calendar (FullCalendar style), monthly view:
- Navigation: "< Março 2026 >" with today button
- Day cells with events:
  - Regular events: blue pills "Reunião — Maria S. 10:00"
  - DEADLINES (red pills with bold): "⚠️ Contestação — Proc. 1234 — PEREMPTÓRIO"
  - Hearings (purple pills): "Audiência — Proc. 5551 14:00"
  - Completed (green, strikethrough): "✓ Recurso protocolado"
- Today highlighted with gold border
- Weekends slightly dimmer

RIGHT SIDEBAR (300px):
- "Próximos Prazos" list (top priority):
  - 3 upcoming deadlines with countdown badges and color coding
  - Each shows: case name, type, days remaining, responsible lawyer
- "Hoje" section: today's events expanded
- "Feriados Forenses" toggle: "Mostrar feriados e suspensões"
- Mini legend: red=peremptório, blue=evento, purple=audiência, green=concluído

Desktop 1440px. Timezone display: "Horário de Brasília (BRT)".
```

---

## 11. Financeiro

**Prompt:**

```
Design a Finance dashboard page for legal CRM "Juris AI" in dark mode.

Sidebar: Financeiro active. Top bar: breadcrumb "Dashboard > Financeiro".

TOP ROW — 4 stat cards (equal width):
1. "Receita do Mês" — "R$ 28.500,00" (green) with up arrow +12%
2. "Pendente" — "R$ 45.200,00" (yellow) with 8 invoices count
3. "Custas Judiciais" — "R$ 3.800,00" (red) with "2 guias vencendo"
4. "Alvarás Expedidos" — "R$ 15.000,00" (gold) with "Aguardando levantamento"

TABS: "Faturas" (active) | "Custas Judiciais" | "Alvarás" | "Fluxo de Caixa"

TAB "Faturas" — Table:
- Columns: Nº | Cliente | Caso | Valor | Vencimento | Status | Ações
- Rows:
  1. "#001" | "Maria Silva" | "Silva vs. ABC" | "R$ 5.000" | "25/03/2026" | Badge "Pendente" (yellow) | "Enviar lembrete" + "Marcar pago"
  2. "#002" | "João Pereira" | "Pereira vs. XYZ" | "R$ 8.000" | "20/03/2026" | Badge "Pago" (green) | "Ver recibo"
  3. "#003" | "Ana Martins" | "Martins vs. Estado" | "R$ 3.500" | "15/03/2026" | Badge "Vencido" (red) | "Enviar cobrança"
- 5 rows visible. "Nova Fatura" gold button at top right.

Desktop 1440px.
```

---

## 12. IA & Skills

**Prompt:**

```
Design an AI & Skills management page for legal CRM "Juris AI" in dark mode.

Sidebar: "IA & Skills" active (brain icon). Top bar: breadcrumb "Dashboard > IA & Skills".

TABS: "Biblioteca de Skills" (active) | "Macros" | "Rascunhos IA" | "Memória" | "Configurações IA"

TAB "Biblioteca de Skills" content:

TOP: "Habilidades do seu escritório" heading + "Criar Skill" gold button + search input.

GRID of skill cards (3 columns, 2 rows):
1. "Análise de Contrato de Locação" — description "Extrai cláusulas, prazos e penalidades" — icon 📄 — badge "Usado 32x" — category "Cível" — star rating — "Editar | Executar" buttons
2. "Resumo de Sentença" — description "Gera síntese estruturada de decisões judiciais" — icon ⚖️ — badge "Usado 18x" — category "Geral"
3. "Cálculo Trabalhista" — description "Calcula verbas rescisórias e FGTS" — icon 🧮 — badge "Usado 45x" — category "Trabalhista"
4. "Análise de Risco Processual" — description "Avalia probabilidade de êxito baseado em jurisprudência" — icon 📊 — "Novo" badge
5. "Redação de Inicial" — description "Estrutura petição inicial com RAG do acervo" — icon ✍️ — badge "Usado 12x"
6. "Parecer sobre Prescrição" — description "Verifica prazos prescricionais aplicáveis" — icon ⏰ — badge "Usado 7x"

Each card: glassmorphism, hover animation, gold accent on title.

Desktop 1440px.
```

---

## 13. Follow-up

**Prompt:**

```
Design a Follow-up automation page for legal CRM "Juris AI" in dark mode.

Sidebar: Follow-up active (repeat icon). Top bar: breadcrumb "Dashboard > Follow-up".

TABS: "Réguas Ativas" (active) | "Execuções" | "Configurar Régua"

TAB "Réguas Ativas":

4 CADENCE CARDS (vertical stack, full width):

1. "Leads Novos" card (yellow left border):
   - Status: "Ativa" green badge + "12 leads nesta régua"
   - Timeline visual: Step 1 "Dia 2 — Mensagem de dúvidas" ✅ → Step 2 "Dia 4 — Case de sucesso" 🔄 → Step 3 "Dia 7 — Fechamento de loop" ⏳
   - Stats: "Conv. rate: 34%" | "Enviadas: 48" | "Respondidas: 22"
   - Buttons: "Pausar" | "Editar" | "Ver leads"

2. "Pré-Consulta" card (blue left border):
   - "Ativa" badge + "5 consultas agendadas"
   - Timeline: Step 1 "24h antes — Confirmação" → Step 2 "1h antes — Lembrete + Checklist docs"
   - Stats: "No-show rate: 8%" | "Confirmadas: 92%"

3. "Clientes Ativos" card (green left border):
   - "Ativa" badge + "28 processos monitorados"
   - "Gatilho: Movimentação detectada → Tradução empática → WhatsApp"
   - Stats: "Disparos este mês: 15" | "Satisfação: 4.8/5"

4. "Pós-Venda" card (purple left border):
   - "Ativa" badge + "6 casos finalizados"
   - Timeline: Step 1 "NPS Survey" → Step 2 "Nutrição longo prazo (datas comemorativas)"
   - Stats: "NPS médio: 72" | "Indicações geradas: 3"

Desktop 1440px.
```

---

## 14. Configurações

**Prompt:**

```
Design a Settings page for legal CRM "Juris AI" in dark mode.

Sidebar: Configurações active (gear icon). Top bar: breadcrumb "Dashboard > Configurações".

LEFT TABS (vertical, 200px):
- "Escritório" (active)
- "Equipe"
- "WhatsApp / Evolution API"
- "E-mail"
- "Integrações (Datajud/Jusbrasil)"
- "IA / Ollama"
- "Segurança & LGPD"
- "Plano & Faturamento"

RIGHT CONTENT — "Escritório" tab:

SECTION 1 — "Dados do Escritório":
- Logo upload area (circle, drag & drop)
- "Nome do escritório" input: "Silva & Associados"
- "CNPJ" input
- "Endereço" input
- "Telefone" input
- "Áreas de atuação" multi-select chips

SECTION 2 — "Preferências":
- "Fuso horário" dropdown: "America/Sao_Paulo (BRT)" — locked/primary with info tooltip "Todas as datas e prazos usam este fuso"
- "Idioma" dropdown: "Português (BR)"
- "Formato de data" dropdown: "DD/MM/AAAA"

SECTION 3 — "Aparência":
- Theme toggle: "Escuro" (active) / "Claro"
- Accent color picker (gold default)

"Salvar alterações" gold button at bottom.

Desktop 1440px.
```

---

## Resumo de Telas

| # | Tela | Tipo |
|---|------|------|
| 1 | Login | Auth |
| 2 | Cadastro | Auth |
| 3 | Onboarding | Auth |
| 4 | Dashboard | Principal |
| 5 | Casos (Lista) | CRUD |
| 6 | Caso Individual | Detalhe |
| 7 | Contatos (Lista) | CRUD |
| 8 | Contato Individual | Detalhe |
| 9 | Inbox Unificado | Comunicação |
| 10 | Calendário | Produtividade |
| 11 | Financeiro | Operacional |
| 12 | IA & Skills | Inteligência |
| 13 | Follow-up | Automação |
| 14 | Configurações | Admin |
