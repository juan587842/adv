# CRM Jurídica Multiagente — Backup de Contexto

> **Última atualização:** 2026-03-21 18:51 (America/Sao_Paulo)
> **Projeto Supabase:** `adv-db` | ID: `voosldmiiwxzfofazviq` | Região: `sa-east-1`

---

## 1. O que é o projeto

CRM jurídico multiagente para escritórios de advocacia brasileiros.
- **Multi-tenant** via Supabase RLS com `tenant_id`
- **IA:** MiniMax M2.7 via Ollama Cloud + Agno (WhatsApp agent) + LangGraph (orquestração/HITL)
- **Omnicanal:** WhatsApp (Evolution API v2), E-mail (IMAP/SMTP), Chat web
- **Compliance:** LGPD + OAB (Provimento 222/2023)
- **Timezone:** `America/Sao_Paulo` em todo o sistema

## 2. Stack definida

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Next.js 15 (App Router), TypeScript, Tailwind CSS v4, Zustand, TanStack Query |
| Backend | Supabase (PostgreSQL 17, Auth, RLS, Storage, Realtime, pg_cron, Edge Functions) |
| IA Frameworks | Agno (WhatsApp agent) + LangGraph (orquestração, drafting, HITL) |
| LLM | MiniMax M2.7 via Ollama Cloud (204K context) |
| RAG | pgvector (extension `vector` no schema `extensions`) |
| WhatsApp | Evolution API v2 (já rodando na VPS do usuário) |
| Deploy | Vercel (frontend) + Supabase Cloud |

## 3. Documentos existentes

| Arquivo | Conteúdo |
|---------|----------|
| `docs/prd/prd-crm-juridica.md` | PRD completo (13 RFs, 5 RNFs, 5 fases de fluxo) |
| `docs/architecture/architecture.md` | Arquitetura completa do sistema |
| `docs/design/stitch-prompts.md` | Prompts detalhados para cada página (Google Stitch) |
| `docs/design/stitch-catalog.md` | Catálogo das 42 telas (14 páginas + 28 modais) com Screen IDs |
| `docs/design/screens/` | 14 arquivos HTML das páginas principais (baixadas do Stitch) |
| `docs/design/modals/` | 28 arquivos HTML dos modais (baixados do Stitch) |
| `src/lib/supabase/database.types.ts` | Tipos TypeScript auto-gerados do schema (55KB) |

## 4. O que já foi feito (Épico 1 ✅)

### 10 migrations aplicadas ao Supabase:

| # | Migration | Tabelas criadas |
|---|-----------|----------------|
| 001 | `tenants_and_auth` | `tenants`, `profiles`, `tenant_members` + TZ São Paulo |
| 002 | `core_enums` | 11 enums: `case_status`, `case_area`, `contact_type`, `urgency_level`, `channel_type`, `conversation_status`, `follow_up_stage`, `invoice_status`, `court_fee_status`, `payment_order_status`, `deadline_type`, `task_status` |
| 003 | `contacts_cases` | `contacts`, `cases`, `case_documents`, `case_notes`, `case_movements` |
| 004 | `calendar_tasks` | `calendar_events`, `tasks`, `deadlines`, `court_holidays` |
| 005 | `financial` | `invoices`, `court_fees`, `payment_orders` |
| 006 | `inbox_messages` | `conversations`, `messages`, `message_tags`, `quick_replies`, `private_notes` |
| 007 | `ai_memory` | `agent_memory`, `document_embeddings` (pgvector 1536d), `skills_library`, `macros`, `ai_drafts` |
| 008 | `audit_trail` | `audit_logs` (append-only, LGPD) |
| 009 | `follow_up` | `follow_up_rules`, `follow_up_executions`, `nps_surveys` |
| 010 | `security_fixes` | Fix `handle_updated_at` search_path + move `vector` extension para schema `extensions` |

**Total: 29 tabelas**, todas com RLS habilitado, indexes otimizados, triggers de `updated_at`
**Security Advisor: 0 warnings** ✅

### Detalhes técnicos das policies RLS:
- Todas as tabelas usam o padrão `tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())`
- `audit_logs` é append-only (sem UPDATE/DELETE policies)
- `court_holidays` é visível para todos os autenticados (dados públicos)

## 5. Onde parou — Próximo passo

### ➡️ Épico 2: Scaffold Next.js + Design System Legal Design

Criar o projeto Next.js 15 com:
- App Router + TypeScript
- Tailwind CSS v4
- Design System "Legal Design" (dark mode, Navy/Slate, Gold `#C9A96E`, Inter font)
- Layout F-pattern
- Glassmorphism + micro-animações
- Supabase client config
- Páginas de Login, Cadastro, Onboarding

### Épicos restantes (3–17):
Ver o plano completo em: **Artifact** `implementation_plan.md` na pasta `.gemini/antigravity/brain/f2aa7b32-95f9-48dd-96f9-0235053a9efa/`

## 6. Plano de Épicos (checklist)

- [x] **Épico 1** — Infraestrutura Multi-Tenant + Auth + TZ São Paulo ✅
- [ ] **Épico 2** — Scaffold Next.js + Design System Legal Design ← **PRÓXIMO**
- [ ] **Épico 3** — Dashboard Principal
- [ ] **Épico 4** — Gestão de Clientes e Dossiês
- [ ] **Épico 5** — Calendário + Prazos CPC
- [ ] **Épico 6** — Módulo Financeiro
- [ ] **Épico 7** — Inbox Nativo Unificado
- [ ] **Épico 8** — Integração Evolution API + E-mail
- [ ] **Épico 9** — Follow-up Omnicanal
- [ ] **Épico 10** — Infra IA (Ollama + pgvector/RAG + LangGraph/Agno)
- [ ] **Épico 11** — Agente Conversacional WhatsApp + HITL
- [ ] **Épico 12A** — Ferramentas Cognitivas (síntese + drafting + HITL)
- [ ] **Épico 12B** — Agente Onisciente Vigia 24/7
- [ ] **Épico 13** — Memória Persistente (Agentic Memory)
- [ ] **Épico 14** — Biblioteca de Skills + Motor de Macros
- [ ] **Épico 15** — Integração Datajud (CNJ)
- [ ] **Épico 16** — Integração Jusbrasil (B2B)
- [ ] **Épico 17** — LGPD, Auditoria, Conformidade OAB

## 7. Como retomar

Para retomar o trabalho em uma nova conversa:

1. Ative o agente Dev: `@dev` ou `/dev`
2. Diga: **"Leia o arquivo `docs/CONTEXT-BACKUP.md` e continue do Épico 2"**
3. O agente lerá este arquivo e terá todo o contexto necessário

### Referências importantes para o agente:
- **PRD:** `docs/prd/prd-crm-juridica.md`
- **Arquitetura:** `docs/architecture/architecture.md`
- **Designs Stitch:** `docs/design/stitch-catalog.md`
- **Types do DB:** `src/lib/supabase/database.types.ts`
- **Supabase Project ID:** `voosldmiiwxzfofazviq`
