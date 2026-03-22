# Plataforma CRM Jurídica Multiagente — Plano de Implementação

## Contexto

Construção de um CRM jurídico multilocatário (multi-tenant) com automação omnicanal e orquestração de agentes de IA, conforme PRD fornecido. O projeto é **greenfield** — sem código ou schema existente.

**Infraestrutura já disponível:**
| Recurso | Status | Detalhes |
|---------|--------|---------|
| Supabase | ✅ Ativo | `adv-db` — ID: `voosldmiiwxzfofazviq`, região `sa-east-1` |
| Evolution API | ✅ Rodando | VPS do usuário (instância existente) |
| Ollama Cloud | ⚠️ Parcial | Conta criada, precisa instalar CLI localmente |
| Datajud / Jusbrasil | ❌ | Sem chaves — arquitetura com mocks |

---

## User Review Required

> [!IMPORTANT]
> **Stack Frontend:** Recomendo **Next.js 15 (App Router)** por: SSR para SEO, API Routes internas como proxy para Evolution API e Ollama, e melhor suporte a auth com Supabase SSR.

> [!IMPORTANT]
> **Abordagem de ondas:** 3 ondas sequenciais. Todos os 17 épicos serão implementados — a sequência define ordem, não exclusão.

> [!WARNING]
> **Integrações Judiciárias (Datajud/Jusbrasil):** Sem chaves de API → camada de abstração + mocks. Quando obtiver credenciais, basta configurar env vars.

> [!WARNING]
> **Ollama MiniMax M2.7:** Requer instalação do Ollama CLI local + vínculo da conta (Épico 10). Adapter pattern permite fallback até lá.

---

## Matriz de Rastreabilidade PRD → Épicos

| Requisito | Épico(s) | Seção PRD |
|-----------|----------|-----------|
| RF01 — Multi-tenant isolado | 1 | §2 |
| RF02 — Inbox Nativo (WhatsApp + E-mail + Chat) | 7, 8 | §3 |
| RF03 — HITL (WhatsApp: `is_paused`/`continue_run` + LangGraph: `interrupt`) | 11, 12A | §4.5 |
| RF04 — Sincronização Datajud/Jusbrasil | 15, 16 | §5 |
| RF05 — Prazos CPC + calendário | 5 | §1 |
| RF06 — Financeiro (custas, alvarás, faturamento) | 6 | §1 |
| RF07 — RAG via pgvector | 10 | §4.6 |
| RF08 — MiniMax M2.7 via Ollama | 10 | §4 |
| RF09 — Memória Persistente (Agentic Memory) | 13 | §4.1 |
| RF10 — Biblioteca de Skills | 14 | §4.2 |
| RF11 — Motor de Macros | 14 | §4.3 |
| RF12 — Agente 24/7 background | 12 | §4.4 |
| RF13 — Follow-up omnicanal (4 estágios) | 9 | §7 |
| RNF01 — RLS | 1 | §2 |
| RNF02 — Mascaramento LGPD para LLMs | 17 | §6 |
| RNF03 — Audit Logs | 17 | §6 |
| RNF04 — Legal Design / F-pattern | 2, 3 | §2 |
| RNF05 — Microsserviços/Docker | 8, 10 | §3, §4 |
| RNF06 — Fuso `America/Sao_Paulo` | 1 | — |
| **Fluxo 3 — Síntese documental com IA** | 12A | §1 |
| **Fluxo 4 — Co-piloto de redação (drafting assistant)** | 12A | §1 |
| **Seção 3 — Suporte dual Baileys / Cloud API** | 8 | §3 |
| **Seção 7 — NPS + nutrição de longo prazo** | 9 | §7.4 |

---

## Onda 1 — Fundação + CRM Core (Épicos 1–6)

---

### Épico 1: Infraestrutura Multi-Tenant + Auth

**Objetivo:** Schema base do Supabase com RLS multi-tenant e autenticação.

#### [NEW] Migrations Supabase (via MCP)

| Migration | Tabelas/Ações |
|-----------|--------------|
| `001_tenants_and_auth` | `tenants`, `profiles`, `tenant_members` + RLS policies + timezone `America/Sao_Paulo` |
| `002_core_enums` | Enums: `case_status`, `case_area`, `contact_type`, `urgency_level`, `channel_type` |
| `003_contacts_cases` | `contacts`, `cases`, `case_documents`, `case_notes` |
| `004_calendar_tasks` | `calendar_events`, `tasks`, `deadlines`, `court_holidays` (feriados forenses) |
| `005_financial` | `invoices`, `court_fees`, `payment_orders` (`alvarás`) |
| `006_inbox_messages` | `conversations` (com `channel` enum: whatsapp/email/chat), `messages`, `message_tags`, `quick_replies`, `private_notes` |
| `007_ai_memory` | `agent_memory`, `document_embeddings` (pgvector), `skills_library`, `macros`, `ai_drafts` |
| `008_audit_trail` | `audit_logs` — tabela inviolável, append-only (LGPD) |
| `009_follow_up` | `follow_up_rules`, `follow_up_executions`, `nps_surveys` |

**Princípios de schema:**
- `tenant_id` com FK para `tenants.id` em toda entidade
- RLS: `auth.uid()` → `profiles.tenant_id` → filtro universal
- Índices B-tree em `tenant_id` + colunas de busca frequente
- `pgvector` ativado para `document_embeddings`
- Soft-delete via `deleted_at` timestamp
- **Fuso horário `America/Sao_Paulo` (RNF06):** DB timezone configurado. Todos timestamps com `timestamptz`. Cron jobs e cálculos de prazo em horário de Brasília.

---

### Épico 2: Scaffold Next.js + Design System (Legal Design)

> **🎨 Design System e Autenticação:** Ver `docs/design/stitch-catalog.md` para as regras. Telas base em `docs/design/screens/` (01-login.html, 02-cadastro.html, 03-onboarding.html, 14-configuracoes.html).

#### [NEW] Scaffold do projeto

```
src/
├── app/
│   ├── (auth)/             # Login, signup, onboarding
│   ├── (dashboard)/        # Layout autenticado
│   │   ├── page.tsx        # Dashboard principal (F-pattern)
│   │   ├── cases/          # Dossiês processuais
│   │   ├── contacts/       # Clientes
│   │   ├── inbox/          # Inbox unificado (3 canais)
│   │   ├── calendar/       # Calendário + prazos CPC
│   │   ├── finance/        # Financeiro
│   │   ├── ai/             # Skills, macros, drafts, memória
│   │   └── settings/       # Configurações do tenant
│   ├── api/                # API Routes (proxy Evolution, Ollama, Webhook)
│   └── layout.tsx
├── components/
│   ├── ui/                 # Design system (Legal Design tokens)
│   ├── dashboard/          # Widgets (F-pattern zones)
│   ├── inbox/              # Thread, notas privadas, tags
│   └── shared/             # Sidebar, topbar, modals
├── lib/
│   ├── supabase/           # Client, server, middleware
│   ├── evolution-api/      # Client v2 (dual: Baileys + Cloud API)
│   ├── ai/                 # Adapters (Ollama MiniMax, LangGraph, Agno, LangChain)
│   ├── datajud/            # Client RESTful + mock
│   ├── jusbrasil/          # Client B2B + mock
│   └── email/              # Integração e-mail (IMAP/SMTP)
├── hooks/
├── stores/                 # Zustand
└── styles/globals.css      # Design tokens, Legal Design
```

**Design System — Legal Design (RNF04 + §2):**
- Paleta escura sofisticada (navy/slate + acentos dourados)
- Tipografia: Inter (UI) + JetBrains Mono (dados)
- **Layout F-pattern:** Prazos fatais urgentes na zona primária de atenção visual (topo-esquerda → direita)
- Cards com glassmorphism, sidebar colapsável, badges de status
- Micro-animações nas transições e hover states
- Zones de urgência com codificação cromática (vermelho = peremptório)

---

### Épico 3: Dashboard Principal

> **🎨 Design:** Ver `docs/design/screens/04-dashboard.html`.

#### [NEW] `src/app/(dashboard)/page.tsx`
- **Zona F1 (topo):** Prazos Urgentes (próximos 7 dias) — alerta visual prioritário com contagem regressiva
- **Zona F2:** Casos Ativos por status (pipeline visual)
- **Zona F3:** Inbox — mensagens não lidas (todos os canais)
- **Zona F4:** Financeiro — receitas pendentes, alvarás expedidos
- **Zona F5:** Atividade recente (audit log simplificado)

---

### Épico 4: Gestão de Clientes e Dossiês

> **🎨 Design:** Ver `05-lista-casos.html`, `06-caso-individual.html`, `07-lista-contatos.html`, `08-perfil-contato.html` (em `docs/design/screens/`) e modais associados em `docs/design/modals/`.

#### [NEW] `src/app/(dashboard)/contacts/` e `src/app/(dashboard)/cases/`
- CRUD de contatos com lead scoring (manual + campo para IA futura)
- CRUD de casos com vinculação a contatos e área do direito
- Upload de documentos (Supabase Storage)
- Timeline de movimentações no dossiê (preparada para integração Datajud)
- Notas internas por caso (visíveis apenas ao time)

---

### Épico 5: Calendário + Prazos Processuais (CPC)

> **🎨 Design:** Ver `docs/design/screens/10-calendario.html` e modais em `docs/design/modals/`.

#### [NEW] `src/app/(dashboard)/calendar/`
- Calendário mensal/semanal com eventos e deadlines
- Motor de cálculo de prazos conforme CPC:
  - Contagem em dias úteis (excluindo fins de semana)
  - **Tabela de feriados forenses** (`court_holidays`) — feriados nacionais, estaduais e recessos forenses
  - Regras de suspensão de prazo (recesso 20/dez–20/jan, etc.)
- Alertas visuais para prazos peremptórios (codificação cromática)
- Sincronização com Google Calendar (opcional)

---

### Épico 6: Módulo Financeiro

> **🎨 Design:** Ver `docs/design/screens/11-financeiro.html` e modais em `docs/design/modals/`.

#### [NEW] `src/app/(dashboard)/finance/`
- Emissão e gerenciamento de faturas (honorários)
- Rastreamento de guias de custas judiciais (emissão, vencimento, compensação)
- Monitoramento de alvarás de pagamento (expedição, levantamento)
- Dashboard financeiro com **fluxo de caixa e previsibilidade**
- Notificações automáticas de vencimentos

---

## Onda 2 — Comunicação Omnicanal (Épicos 7–9)

### Épico 7: Inbox Nativo Unificado (estilo Chatwoot)

> **🎨 Design:** Ver `docs/design/screens/09-inbox.html` e modais em `docs/design/modals/`.

#### [NEW] `src/app/(dashboard)/inbox/`
- **3 canais centralizados:** WhatsApp, E-mail, Chat web (conforme §3)
- Lista de conversas com filtros (canal, status, urgência, advogado atribuído)
- Thread de mensagens com timestamp (fuso `America/Sao_Paulo`)
- **Notas privadas** na conversa (invisíveis ao cliente, para discussão de teses — §3)
- **Tags de urgência** e categorização de leads (§3)
- **Respostas rápidas** (quick replies) pré-configuradas (§3)
- Atribuição de conversas a advogados específicos
- Indicador de status da IA (ativa / pausada / HITL pendente)

---

### Épico 8: Integração Evolution API (WhatsApp)

#### [NEW] `src/lib/evolution-api/`
- Client HTTP para Evolution API v2
- **Suporte dual (§3):** Baileys API (escritórios menores, sem custo) + WhatsApp Cloud API oficial (bancas maiores, selos Meta)
- Webhook receiver (API Route) para mensagens recebidas
- Envio de mensagens (texto, mídia, templates)
- Gerenciamento de instâncias WhatsApp
- Armazenamento de mensagens no Supabase em tempo real

#### [NEW] `src/lib/email/`
- Integração de e-mail (IMAP para recebimento, SMTP para envio)
- Parsing de e-mails → persistência no inbox unificado

#### [NEW] `src/app/api/webhooks/evolution/route.ts`
- Endpoint webhook para eventos da Evolution API
- Parsing e persistência das mensagens

---

### Épico 9: Follow-up Omnicanal (§7 completo)

> **🎨 Design:** Ver `docs/design/screens/13-follow-up.html` e modais em `docs/design/modals/`.

#### [NEW] `src/app/(dashboard)/follow-up/` + Supabase Edge Functions
- Configuração de réguas de cadência por estágio:
  - **§7.1 Leads novos:** Toque 1 (Dia 2, dúvidas), Toque 2 (Dia 4, case de sucesso), Toque 3 (Dia 7, fechamento de loop)
  - **§7.2 Pré-consulta:** 24h antes (confirmar/remarcar) + 1h antes + checklist de documentação
  - **§7.3 Clientes ativos:** Gatilhos processuais (Datajud/Jusbrasil) → tradução empática → push WhatsApp
  - **§7.4 Pós-venda:** **NPS** (pesquisa de satisfação pós-arquivamento) + **Nutrição de longo prazo** (Broadcasts éticos: datas comemorativas, informes de utilidade pública)
- Cron jobs via Supabase `pg_cron` para disparo automatizado
- Logs de execução de follow-up (`follow_up_executions`)
- Respeito a conformidade OAB e LGPD nos broadcasts

---

## Onda 3 — Inteligência Artificial + Integrações (Épicos 10–17)

### Épico 10: Infraestrutura de IA (Ollama + pgvector + RAG)

#### [NEW] `src/lib/ai/`
- Instalação e configuração do Ollama CLI + vínculo com conta do usuário
- **Adapter pattern com 2 frameworks (§4):**
  - `OllamaProvider` → MiniMax M2.7 (`minimax-m2.7:cloud`, 204K tokens)
  - `FallbackProvider` → para uso até Ollama estar configurado
  - **Agno** → Agente conversacional WhatsApp com `is_paused`/`continue_run` + memória
  - **LangGraph** (inclui `@langchain/core`) → Orquestração, drafting, macros, HITL `interrupt` + utilitários (loaders, splitters, parsers, tools)
- Ativação da extensão **pgvector** no Supabase
- Pipeline de embeddings: documento → chunks → vetores → `document_embeddings`
- Motor RAG: busca semântica no acervo do escritório

---

### Épico 11: Agente Conversacional (WhatsApp) + HITL WhatsApp

#### Framework: **Agno** (§4.5)
- Agente operando via Evolution API no WhatsApp
- Lead Scoring automático + identificação da área do direito
- Solicitação de documentação preliminar
- Agendamento de consulta na agenda sincronizada
- **Declaração proativa de natureza sintética** (OAB transparência — §6)
- **HITL WhatsApp (§4.5):** Detecção de complexidade → `is_paused` → alerta no Inbox → advogado assume → botão "Retomar IA" (`continue_run`)

---

### Épico 12: Agente Onisciente (Background 24/7) + Ferramentas Cognitivas

#### Framework: **LangGraph** (§4.4, §4.5)

**12A — Ferramentas Cognitivas (Fluxo 3 + Fluxo 4 do PRD):**
- **Síntese documental (§1 Fluxo 3):** Extrair metadados, gerar resumos estruturados (prazos, obrigações, penalidades contratuais), tabelas de fácil consulta
- **Co-piloto de redação / Drafting Assistant (§1 Fluxo 4):** Estruturar minutas iniciais de petições usando RAG (contexto do caso + acervo de teses). Advogado faz curadoria e revisão
- **HITL interno (§4.5):** Função `interrupt` do LangGraph antes de ações irreversíveis (protocolar documento, enviar e-mail oficial). Estado salvo no banco. Humano aprova/edita/rejeita

**12B — Vigia 24/7 (§4.4):**
- Worker em background (Supabase Edge Function ou Node.js cron)
- Varredura contínua: Inbox (3 canais), **e-mail** (IMAP), APIs judiciais
- Categorização e priorização proativa de expedientes
- Preparação de dossiês prioritários (ex: e-mail urgente de madrugada → dossiê pronto às 8h)

---

### Épico 13: Memória Persistente (Agentic Memory)

#### Framework: **Agno / LangGraph** (§4.1)
- Armazenamento de contexto conversacional no Supabase (`agent_memory`)
- Recall de interações passadas por cliente (meses atrás)
- Personalização: tom de voz preferido do advogado, histórico familiar do cliente
- Atendimento humanizado e contínuo — sem "amnésia" entre conversas

---

### Épico 14: Biblioteca de Skills + Motor de Macros

> **🎨 Design:** Ver `docs/design/screens/12-ia-skills.html` e modais em `docs/design/modals/`.

#### (§4.2 + §4.3)
- **Skills (§4.2):**
  - CRUD de Skills na biblioteca (`skills_library`)
  - Advogado salva prompts/fluxos eficazes como Skills reutilizáveis
  - Agente Onisciente consome Skills do arsenal do escritório
  - Sistema cresce organicamente com o método de trabalho da equipe

- **Macros (§4.3):**
  - Motor de Macros via LangGraph: encadeamento de sub-ações
  - Exemplo "Fechamento de Caso": sentença (Datajud) → resumo simplificado → custas finais → fatura (módulo financeiro) → mensagem WhatsApp (HITL aprovação)
  - Disparado por gatilho único

---

### Épico 15: Integração Datajud (API Pública CNJ)

#### (§5)
- Client RESTful para API Pública do Datajud
- Busca por número único do processo (NPU)
- Sincronização de andamentos → dossiê digital (metadados JSON)
- Captura de movimentações e sentenças de forma passiva
- Cálculo preditivo de prazos → inserção no calendário
- **Mock ativo até obtenção de credenciais**

---

### Épico 16: Integração Jusbrasil (B2B)

#### (§5)
- Client B2B para API Jusbrasil
- Mineração de conteúdo bruto (textos completos) dos Diários Oficiais
- Alimentação da base vetorial (RAG) — preenchimento de lacunas do Datajud
- **Mock ativo até obtenção de credenciais**

---

### Épico 17: LGPD, Auditoria e Conformidade OAB

#### (§6)
- **Transparência Algorítmica (§6):** Banner sintético no WhatsApp
- **Mascaramento de dados pessoais (RNF02):** Sanitização antes de enviar a LLMs
- **Zero Data Retention (§6):** Garantia de não-treinamento com dados do escritório
- **Audit Logs (RNF03):** Tabela `audit_logs` imutável (append-only), ID + timestamp + ação
- **Trilha HITL:** Todas aprovações/rejeições de IA registradas
- **Política de data retention** conforme LGPD
- **Provimento 222/2023 OAB:** Conformidade total documentada

---

## Verification Plan

### Automated Tests
- **Migrations:** Validação via `execute_sql` com queries de verificação de schema
- **RLS:** Testes com diferentes `auth.uid()` simulados
- **Frontend:** `npm run build` para compilação sem erros
- **Lint/Types:** `npm run lint` e `npm run typecheck`

### Manual Verification
- **Dashboard:** Validação visual do Legal Design (F-pattern, zonas de urgência)
- **Inbox:** Mensagem de teste via webhook mock → exibição nos 3 canais
- **Evolution API:** Teste real envio/recebimento WhatsApp na VPS
- **Ollama:** Vinculação de conta + teste do MiniMax M2.7
- **Datajud/Jusbrasil:** Teste com credenciais quando disponíveis
- **Prazos CPC:** Teste com feriados forenses e regras de suspensão
- **HITL:** Teste de transbordo WhatsApp e aprovação LangGraph

---

## 🏆 Validação Final QA (Quality Assurance)

> [!NOTE]
> **Status de Auditoria: APROVADO** ✅
> Todas as 6 Fases (17 Épicos) foram auditadas, concluídas e validadas arquiteturalmente. O débito técnico de RLS (Recursividade) reportado na Fase 5 foi integralmente resolvido no Épico 17 com policies rigorosas e isolamento Multi-Tenant.
> Para maiores detalhes, acesse: `docs/qa/gates/final-qa-report.md`
>
> **— Quinn (Agente QA), 22 de Março de 2026**
