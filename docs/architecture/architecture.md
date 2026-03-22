# Arquitetura de Sistemas — CRM Jurídica Multiagente

> Documento de referência técnica produzido por **Aria (Architect Agent)**.
> Baseado no PRD em `docs/prd/prd-crm-juridica.md`.

---

## 1. Visão Geral da Arquitetura

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENTE (Browser)                            │
│   Next.js 15 (App Router) — SSR + CSR — Legal Design UI            │
└──────────────────────────────┬──────────────────────────────────────┘
                               │ HTTPS
┌──────────────────────────────▼──────────────────────────────────────┐
│                    CAMADA DE APLICAÇÃO (Vercel)                      │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────────────────┐  │
│  │  App Router  │  │  API Routes  │  │  Middleware (Auth + RLS)  │  │
│  │  (Pages)     │  │  (Proxy/WH)  │  │  Supabase SSR Auth        │  │
│  └─────────────┘  └──────┬───────┘  └───────────────────────────┘  │
└──────────────────────────┼─────────────────────────────────────────┘
                           │
          ┌────────────────┼────────────────────────┐
          │                │                        │
          ▼                ▼                        ▼
┌─────────────────┐ ┌─────────────┐ ┌──────────────────────────────┐
│   SUPABASE      │ │ EVOLUTION   │ │  OLLAMA CLOUD                │
│   (Backend)     │ │ API v2      │ │  (MiniMax M2.7)              │
│                 │ │ (VPS Docker)│ │                              │
│ • PostgreSQL 17 │ │ • Baileys   │ │ • 204K context window        │
│ • pgvector      │ │ • Cloud API │ │ • Tool calling               │
│ • Auth          │ │ • Webhooks  │ │ • Agentic workflows          │
│ • Storage       │ │ • WebSocket │ │                              │
│ • Edge Functions│ └──────┬──────┘ └──────────────────────────────┘
│ • Realtime      │        │                        ▲
│ • pg_cron       │        │                        │
└────────┬────────┘        │           ┌────────────┘
         │                 │           │
         │        ┌────────▼───────────┴───────────┐
         │        │   CAMADA DE AGENTES IA          │
         │        │                                 │
         │        │  ┌────────────┐ ┌────────────┐ │
         │        │  │   AGNO     │ │  LANGGRAPH │ │
         │        │  │ (WhatsApp  │ │ (Fluxos    │ │
         │        │  │  Agent +   │ │  internos  │ │
         │        │  │  HITL)     │ │  + HITL)   │ │
         │        │  └────────────┘ └────────────┘ │
         │        │                                 │
         │        │  ┌────────────────────────────┐ │
         │        │  │  LANGCHAIN (Utilitários)   │ │
         │        │  │  Chains, Parsers, Tools    │ │
         │        │  └────────────────────────────┘ │
         │        └─────────────────────────────────┘
         │
   ┌─────▼──────────────────────────────────────┐
   │        INTEGRAÇÕES EXTERNAS                 │
   │  ┌──────────┐  ┌───────────┐  ┌─────────┐ │
   │  │ Datajud  │  │ Jusbrasil │  │ E-mail  │ │
   │  │ (CNJ)    │  │ (B2B)     │  │ IMAP/   │ │
   │  │ REST     │  │ REST      │  │ SMTP    │ │
   │  └──────────┘  └───────────┘  └─────────┘ │
   └────────────────────────────────────────────┘
```

---

## 2. Stack Tecnológica — Decisões e Justificativas

### 2.1 Frontend

| Decisão | Escolha | Justificativa |
|---------|---------|---------------|
| **Framework** | **Next.js 15** (App Router) | SSR para SEO, API Routes como proxy seguro, React Server Components, suporte nativo a Supabase SSR Auth |
| **Linguagem** | **TypeScript** (strict mode) | Type safety em todo o stack, melhor DX, refatoração segura |
| **Estilização** | **Tailwind CSS v4** + **CSS Variables** | Produtividade, design tokens, temas dinâmicos (Legal Design) |
| **State Management** | **Zustand** | Leve, sem boilerplate, stores modulares por domínio |
| **Data Fetching** | **TanStack Query** (React Query) | Cache, invalidação, optimistic updates, real-time sync |
| **Formulários** | **React Hook Form** + **Zod** | Validação type-safe, performance, integração com schemas do Supabase |
| **Componentes UI** | **Radix UI** (headless) + design system customizado | Acessibilidade WCAG, componentes sem opinião visual, base para Legal Design |
| **Ícones** | **Lucide React** | Consistência visual, tree-shakeable |
| **Calendário** | **FullCalendar** (React) | Calendário completo com views mensal/semanal, drag-and-drop de eventos |
| **Rich Text** | **Tiptap** | Editor extensível para notas, rascunhos de petições, co-pilot drafting |
| **Gráficos** | **Recharts** | Dashboard financeiro, métricas, charts leves |
| **Notificações** | **Sonner** | Toast notifications modernas |
| **Data/Hora** | **date-fns** + **date-fns-tz** | Manipulação de datas com suporte a timezone (`America/Sao_Paulo`) |

### 2.2 Backend (Supabase)

| Decisão | Escolha | Justificativa |
|---------|---------|---------------|
| **Banco de dados** | **Supabase PostgreSQL 17** | Gerenciado, RLS nativo, pgvector, pg_cron, Edge Functions |
| **Autenticação** | **Supabase Auth** (SSR) | JWT, magic links, OAuth, integração nativa com RLS |
| **Multi-tenancy** | **RLS com `tenant_id`** | Isolamento lógico sem overhead de schemas separados |
| **Armazenamento** | **Supabase Storage** | Documentos, petições, uploads — com policies de acesso |
| **Real-time** | **Supabase Realtime** | Notifications do inbox, updates de prazos, mudanças em tempo real |
| **Jobs agendados** | **pg_cron** (Supabase) | Follow-up cadences, varreduras de APIs judiciais, alertas de prazo |
| **Serverless** | **Supabase Edge Functions** (Deno) | Webhooks, processamento de IA, cron handlers, integração Evolution |
| **Vetorial** | **pgvector** (extensão) | Embeddings de documentos, RAG sem provedor externo |
| **Timezone** | **`America/Sao_Paulo`** | Configurado no nível do banco; todo `timestamptz` normalizado |

### 2.3 Inteligência Artificial

| Decisão | Escolha | Justificativa |
|---------|---------|---------------|
| **LLM primário** | **MiniMax M2.7** via Ollama Cloud (`minimax-m2.7:cloud`) | 204K tokens de contexto, forte tool-calling (46.3% Toolathon), otimizado para agentes, custo-benefício |
| **Framework conversacional** | **Agno** | Leve, rápido (instantiation), memória built-in, `is_paused`/`continue_run` para HITL — ideal para WhatsApp agent |
| **Framework de orquestração** | **LangGraph** (inclui `@langchain/core`) | Fluxos complexos com estado, `interrupt` para HITL interno, ciclos e branching, checkpoint/persistência. Já inclui utilitários: document loaders, text splitters, output parsers, tool wrappers via `@langchain/core` |
| **Embeddings** | **MiniMax Embedding** (via Ollama) ou **OpenAI `text-embedding-3-small`** (fallback) | Geração de vetores para pipeline RAG |
| **RAG** | **pgvector** (Supabase) + **LangGraph Retrievers** (`@langchain/core`) | Busca semântica no acervo jurídico, sem vendor lock-in |

#### Mapeamento Framework → Agente (2 frameworks)

```
┌─────────────────────────────────────────────────────┐
│                 AGNO (Conversational)                │
│  • Agente WhatsApp (Lead Scoring, Atendimento)      │
│  • Memória Persistente (Agentic Memory)             │
│  • HITL: is_paused → continue_run                   │
│  • Declaração de natureza sintética (OAB)           │
└─────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────┐
│      LANGGRAPH (Orchestration + Utilities)           │
│  • Agente Onisciente (Background 24/7)              │
│  • Co-piloto de Redação (Drafting Assistant)         │
│  • Síntese Documental                               │
│  • Motor de Macros (encadeamento de sub-ações)      │
│  • HITL: interrupt → approve/reject/edit            │
│  • State persistence no Supabase                    │
│  ── via @langchain/core (incluso): ──               │
│  • Document Loaders (PDF, DOCX, TXT)                │
│  • Text Splitters (chunking para embeddings)        │
│  • Output Parsers (structured output)               │
│  • Tool Wrappers (Datajud, Jusbrasil, Supabase)     │
│  • Prompt Templates                                 │
└─────────────────────────────────────────────────────┘
```

### 2.4 Comunicação Omnicanal

| Decisão | Escolha | Justificativa |
|---------|---------|---------------|
| **WhatsApp** | **Evolution API v2** (Docker, VPS) | Open-source, dual Baileys/Cloud API, webhooks robustos, suporte a RabbitMQ/WebSocket |
| **Modo Baileys** | Escritórios menores (sem custo/mensagem) | Emula WhatsApp Web via Baileys — risco de ban em produção; ideal para dev/test |
| **Modo Cloud API** | Escritórios maiores (produção) | API oficial Meta, estável, selos, compliance, analytics |
| **E-mail** | **Nodemailer** (SMTP) + **ImapFlow** (IMAP) | Envio e recebimento de e-mails no Inbox unificado |
| **Chat web** | **Supabase Realtime** | Widget de chat embeddable, sem dependência externa |
| **Inbox** | **Componente nativo** (Next.js) | Estilo Chatwoot: threads, notas privadas, tags, quick replies, assignment |

### 2.5 Integrações Judiciais

| Decisão | Escolha | Justificativa |
|---------|---------|---------------|
| **Datajud** | **REST Client** (fetch/axios) | API Pública do CNJ, busca por NPU (número único do processo) |
| **Jusbrasil** | **REST Client** (fetch/axios) | API B2B, mineração de Diários Oficiais |
| **Abstração** | **Adapter Pattern** | Interface comum `JudicialDataProvider` com implementações reais e mocks |

### 2.6 Infraestrutura e Deploy

| Decisão | Escolha | Justificativa |
|---------|---------|---------------|
| **Hosting Frontend** | **Vercel** | Deploy Next.js nativo, edge functions, preview deploys, analytics |
| **Hosting Backend** | **Supabase Cloud** (`sa-east-1`) | Gerenciado, região Brasil |
| **Evolution API** | **Docker** na VPS do usuário | Já rodando, isolamento de recursos |
| **Monitoramento** | **Supabase Dashboard** + **Vercel Analytics** | Observabilidade sem setup complexo |
| **CI/CD** | **GitHub Actions** | Build, lint, typecheck, deploy automático |

---

## 3. Padrões Arquiteturais

### 3.1 Multi-Tenancy (RLS)

```sql
-- Padrão de policy RLS aplicado a todas as tabelas
CREATE POLICY "tenant_isolation" ON {table}
  USING (tenant_id = (
    SELECT tenant_id FROM profiles WHERE id = auth.uid()
  ));
```

**Fluxo de autenticação:**
```
User Login → Supabase Auth (JWT) → Middleware (Next.js)
  → Extract auth.uid() → Lookup profiles.tenant_id
  → RLS filtra automaticamente → Dados isolados
```

### 3.2 Adapter Pattern (Integrações)

```typescript
// Interface comum para todas integrações judiciais
interface JudicialDataProvider {
  searchByProcessNumber(npu: string): Promise<ProcessData>;
  getMovements(processId: string): Promise<Movement[]>;
  getFullText(movementId: string): Promise<string>;
}

// Implementações intercambiáveis
class DatajudProvider implements JudicialDataProvider { ... }
class JusbrasilProvider implements JudicialDataProvider { ... }
class MockJudicialProvider implements JudicialDataProvider { ... }
```

### 3.3 AI Provider Abstraction

```typescript
// Adapter para LLM — troca transparente de modelo
interface AIProvider {
  chat(messages: Message[], tools?: Tool[]): Promise<AIResponse>;
  embed(text: string): Promise<number[]>;
}

class OllamaProvider implements AIProvider {
  model = 'minimax-m2.7:cloud'; // 204K tokens
}

class FallbackProvider implements AIProvider {
  // Usado até Ollama estar configurado
}
```

### 3.4 Event-Driven (Webhooks + Realtime)

```
Evolution API ──webhook──▶ Next.js API Route ──▶ Supabase INSERT
                                                      │
                                    Supabase Realtime ◀┘
                                          │
                                    Inbox UI (atualiza em tempo real)
```

### 3.5 HITL (Human-in-the-Loop) — Dois Padrões

```
PADRÃO 1: WhatsApp (Agno)
──────────────────────────
Cliente pergunta → Agno avalia complexidade
  → Baixa: Responde automaticamente
  → Alta: is_paused=true → Alerta no Inbox
    → Advogado assume → Responde → Clica "Retomar IA"
    → continue_run() → Agno retoma operação

PADRÃO 2: Interno (LangGraph)
──────────────────────────────
Agente cria minuta/ação → LangGraph interrupt()
  → Estado salvo no Supabase → Notificação na UI
  → Advogado revisa → Aprova / Edita / Rejeita
  → LangGraph resume com decisão humana
```

---

## 4. Estrutura de Diretórios

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── onboarding/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx              # Sidebar + Topbar
│   │   ├── page.tsx                # Dashboard (F-pattern)
│   │   ├── cases/
│   │   │   ├── page.tsx            # Lista de casos
│   │   │   └── [id]/page.tsx       # Dossiê individual
│   │   ├── contacts/
│   │   │   ├── page.tsx            # Lista de contatos
│   │   │   └── [id]/page.tsx       # Perfil do contato
│   │   ├── inbox/
│   │   │   ├── page.tsx            # Inbox unificado
│   │   │   └── [conversationId]/page.tsx
│   │   ├── calendar/page.tsx       # Calendário + prazos
│   │   ├── finance/page.tsx        # Módulo financeiro
│   │   ├── ai/
│   │   │   ├── skills/page.tsx     # Biblioteca de Skills
│   │   │   ├── macros/page.tsx     # Motor de Macros
│   │   │   └── drafts/page.tsx     # Rascunhos de petições
│   │   ├── follow-up/page.tsx      # Réguas de cadência
│   │   └── settings/page.tsx       # Configurações tenant
│   ├── api/
│   │   ├── webhooks/
│   │   │   └── evolution/route.ts  # Webhook Evolution API
│   │   ├── ai/
│   │   │   ├── chat/route.ts       # Proxy para Ollama
│   │   │   └── embed/route.ts      # Pipeline de embeddings
│   │   ├── datajud/route.ts        # Proxy Datajud
│   │   └── jusbrasil/route.ts      # Proxy Jusbrasil
│   └── layout.tsx
├── components/
│   ├── ui/                         # Design system (Radix + Tailwind)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── table.tsx
│   │   └── ...
│   ├── dashboard/                  # Widgets F-pattern
│   │   ├── deadline-widget.tsx
│   │   ├── cases-pipeline.tsx
│   │   ├── inbox-summary.tsx
│   │   ├── finance-widget.tsx
│   │   └── activity-feed.tsx
│   ├── inbox/                      # Componentes do inbox
│   │   ├── conversation-list.tsx
│   │   ├── message-thread.tsx
│   │   ├── private-note.tsx
│   │   ├── quick-replies.tsx
│   │   └── ai-status-badge.tsx
│   └── shared/
│       ├── sidebar.tsx
│       ├── topbar.tsx
│       ├── tenant-switcher.tsx
│       └── timezone-display.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # Browser client
│   │   ├── server.ts               # Server client (SSR)
│   │   ├── middleware.ts            # Auth middleware
│   │   └── types.ts                # Generated types
│   ├── evolution-api/
│   │   ├── client.ts               # HTTP client v2
│   │   ├── webhook-handler.ts      # Event parser
│   │   └── types.ts
│   ├── ai/
│   │   ├── providers/
│   │   │   ├── ollama.ts           # MiniMax M2.7
│   │   │   └── fallback.ts
│   │   ├── agents/
│   │   │   ├── whatsapp-agent.ts   # Agno-based
│   │   │   └── omniscient-agent.ts # LangGraph-based
│   │   ├── rag/
│   │   │   ├── embeddings.ts       # Pipeline de vetorização
│   │   │   ├── retriever.ts        # Busca semântica
│   │   │   └── chunker.ts          # Text splitting
│   │   ├── memory/
│   │   │   └── persistent.ts       # Agentic Memory (Supabase)
│   │   ├── skills/
│   │   │   └── skill-loader.ts     # Carrega skills do banco
│   │   ├── macros/
│   │   │   └── macro-engine.ts     # Execução de macros
│   │   └── hitl/
│   │       ├── whatsapp-hitl.ts    # Agno pause/resume
│   │       └── internal-hitl.ts    # LangGraph interrupt
│   ├── datajud/
│   │   ├── client.ts               # REST client
│   │   ├── mock.ts                 # Mock provider
│   │   └── types.ts
│   ├── jusbrasil/
│   │   ├── client.ts               # REST client
│   │   ├── mock.ts                 # Mock provider
│   │   └── types.ts
│   ├── email/
│   │   ├── imap.ts                 # ImapFlow receiver
│   │   └── smtp.ts                 # Nodemailer sender
│   ├── calendar/
│   │   ├── cpc-deadline.ts         # Cálculo de prazos CPC
│   │   ├── holidays.ts             # Feriados forenses
│   │   └── timezone.ts             # Helpers America/Sao_Paulo
│   └── utils/
│       ├── data-masking.ts         # Sanitização LGPD
│       └── audit-logger.ts         # Append-only audit trail
├── hooks/
│   ├── use-supabase.ts
│   ├── use-realtime.ts
│   ├── use-inbox.ts
│   └── use-timezone.ts
├── stores/
│   ├── auth-store.ts
│   ├── inbox-store.ts
│   ├── cases-store.ts
│   └── ui-store.ts
└── styles/
    └── globals.css                 # Tailwind + design tokens
```

---

## 5. Fluxo de Dados Críticos

### 5.1 Mensagem WhatsApp → Inbox

```
1. Cliente envia mensagem WhatsApp
2. Evolution API (VPS) recebe via Baileys/Cloud API
3. Evolution dispara webhook POST → /api/webhooks/evolution
4. API Route valida, persiste em Supabase (messages table)
5. Supabase Realtime notifica frontend
6. Inbox UI atualiza thread em tempo real
7. Se Agno ativo: mensagem enviada ao agente
8. Agno avalia → responde ou aciona HITL (is_paused)
```

### 5.2 Movimentação Processual → Cliente

```
1. pg_cron dispara Edge Function de varredura (a cada X min)
2. Edge Function consulta Datajud/Jusbrasil por NPU
3. Novas movimentações detectadas → INSERT em case_movements
4. LangGraph intercepta → gera tradução empática
5. Se prazo detectado → cálculo CPC → INSERT em deadlines
6. Mensagem empática → aprovação HITL (interrupt) ou auto-send
7. Evolution API dispara WhatsApp para cliente
8. Supabase Realtime atualiza Inbox + Dashboard
```

### 5.3 RAG — Consulta ao Acervo Jurídico

```
1. Advogado faz pergunta no co-pilot ou busca jurisprudência
2. Query convertida em embedding via AI Provider
3. pgvector busca nearest neighbors em document_embeddings
4. Top-K chunks recuperados com metadados (caso, data, área)
5. Chunks + query enviados ao MiniMax M2.7 (context window 204K)
6. Resposta gerada com citação das fontes
7. Se drafting: minuta salva em ai_drafts → HITL para revisão
```

---

## 6. Segurança em Camadas (Defense in Depth)

```
Camada 1: Network — HTTPS, CORS, Rate Limiting (Vercel)
Camada 2: Auth — Supabase Auth (JWT), refresh tokens, MFA (futuro)
Camada 3: RLS — PostgreSQL Row Level Security (tenant isolation)
Camada 4: Application — Zod validation, input sanitization
Camada 5: Data — Mascaramento LGPD antes de enviar a LLMs
Camada 6: Audit — audit_logs append-only com identity + timestamp
Camada 7: OAB — Transparência algorítmica, HITL obrigatório
```

---

## 7. Variáveis de Ambiente

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://voosldmiiwxzfofazviq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Evolution API
EVOLUTION_API_URL=           # URL da VPS
EVOLUTION_API_KEY=           # API Key da instância
EVOLUTION_WEBHOOK_SECRET=    # Validação de webhooks

# Ollama
OLLAMA_BASE_URL=             # Ollama Cloud endpoint
OLLAMA_MODEL=minimax-m2.7:cloud

# Integrações Judiciais (quando disponíveis)
DATAJUD_API_URL=https://api-publica.datajud.cnj.jus.br
DATAJUD_API_KEY=
JUSBRASIL_API_URL=
JUSBRASIL_API_KEY=

# E-mail
IMAP_HOST=
IMAP_PORT=993
IMAP_USER=
IMAP_PASSWORD=
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=

# App
NEXT_PUBLIC_APP_TIMEZONE=America/Sao_Paulo
```

---

## 8. Dependências Principais (package.json)

```json
{
  "dependencies": {
    "next": "^15.0",
    "react": "^19.0",
    "react-dom": "^19.0",
    "typescript": "^5.7",

    "@supabase/supabase-js": "^2.45",
    "@supabase/ssr": "^0.5",

    "zustand": "^5.0",
    "@tanstack/react-query": "^5.60",
    "react-hook-form": "^7.53",
    "zod": "^3.23",

    "@radix-ui/react-dialog": "^1.1",
    "@radix-ui/react-dropdown-menu": "^2.1",
    "@radix-ui/react-tooltip": "^1.1",
    "@radix-ui/react-tabs": "^1.1",
    "lucide-react": "^0.460",
    "sonner": "^1.7",

    "@fullcalendar/react": "^6.1",
    "@tiptap/react": "^2.10",
    "recharts": "^2.13",

    "date-fns": "^4.1",
    "date-fns-tz": "^3.2",

    "@langchain/core": "^0.3",
    "@langchain/langgraph": "^0.2",
    "agno": "^1.0",

    "nodemailer": "^6.9",
    "imapflow": "^1.0",

    "tailwindcss": "^4.0",
    "clsx": "^2.1",
    "tailwind-merge": "^2.6"
  }
}
```

---

— Aria, arquitetando o futuro 🏗️
