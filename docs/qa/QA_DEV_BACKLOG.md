# 🛡️ QA Backlog: Itens Pendentes para Implementação

**Autor:** Quinn (QA Agent Guardian)
**Data:** 03 de Abril de 2026
**Base de Referência:** `docs/prd/prd-crm-juridica.md`
**Supabase Project:** `voosldmiiwxzfofazviq` (adv-db)

> Este documento lista **tudo que falta criar, implementar ou finalizar** no Juris AI CRM,
> conforme identificado pela auditoria QA cruzando código-fonte, banco de dados e Edge Functions
> contra os requisitos do PRD. Organizado por prioridade para que o @dev crie o plano de implementação.

---

## 🔴 PRIORIDADE CRÍTICA (Bloqueantes para MVP)

### 1. Apontar Edge Functions para o Ollama da VPS

- **PRD Ref:** RF08 (MiniMax M2.7 / Ollama)
- **Status:** As 9 Edge Functions usam o SDK `ChatOpenAI` do LangChain (que é compatível com Ollama via endpoint `/v1`). O Ollama **já está rodando** na VPS do usuário em `https://projetos-ollama.fbnowr.easypanel.host:11434`. Porém, as Secrets do Supabase Edge Functions **não foram configuradas**, e o `modelName` está hardcoded como `gpt-4o-mini` (incorreto).
- **Impacto:** TODAS as Edge Functions de IA falharão ao serem invocadas (sem secrets = sem conexão ao LLM).
- **Ação Dev:**
  - [ ] Ir em Supabase > Project Settings > Edge Functions > Secrets
  - [ ] Adicionar `OPENAI_BASE_URL` = `https://projetos-ollama.fbnowr.easypanel.host:11434/v1` (endpoint compatível OpenAI do Ollama)
  - [ ] Adicionar `OPENAI_API_KEY` = `ollama` (valor dummy — o Ollama não exige autenticação)
  - [x] Nas Edge Functions `rag-pipeline`, `whatsapp-agent`, `omniscient-watcher`, `document-tools`: alterar `modelName` de `'gpt-4o-mini'` para `'minimax-m2.7:cloud'` (ou o modelo instalado no Ollama da VPS)
  - [x] Na `rag-pipeline`: alterar o modelo de embeddings de `'text-embedding-3-small'` para o modelo de embeddings disponível no Ollama (ex: `'nomic-embed-text'`)
  - [x] Verificar que o Ollama da VPS aceita conexões externas (CORS/firewall) vindas do Supabase Edge Runtime
  - [ ] Testar invocação de cada Edge Function após configurar
  - ⚠️ **Bloqueado:** Supabase MCP server offline. Secrets devem ser configurados via Dashboard manualmente.

---

### 2. Integrar Frontend com Edge Functions de IA  

- **PRD Ref:** RF07, RF08 (RAG + Drafting)
- **Status:** O frontend em `intelligence/knowledge/page.tsx` e `intelligence/tools/page.tsx` faz INSERT direto na tabela Supabase, sem chamar as Edge Functions `rag-pipeline` ou `document-tools`. A geração de conteúdo é um **template estático**, não uma chamada real à LLM.
- **Impacto:** A IA não gera resumos reais. O "Chat RAG" não faz busca semântica — usa `ilike` textual.
- **Ação Dev:**
  - [x] Em `intelligence/knowledge/page.tsx`: substituir o INSERT manual + busca `ilike` por chamada à Edge Function `rag-pipeline` (modo `ingest` para vetorizar e modo `chat` para buscar via embeddings)
  - [x] Em `intelligence/tools/page.tsx`: substituir os templates de síntese/drafting por chamada à Edge Function `document-tools` (modo `synthesize` e `draft`)
  - [x] Garantir que o token Supabase Auth (`session.access_token`) seja enviado no header `Authorization: Bearer ...`

---

### 3. Edge Function `datajud-sync` usa dados Mock

- **PRD Ref:** RF04 (Sincronização assíncrona DataJud/CNJ)
- **Status:** A Edge Function `datajud-sync` (v2) **NÃO** consome a API do DataJud. Ela retorna um array hardcoded de 4 movimentações fictícias.
- **Impacto:** O sistema nunca receberá movimentações processuais reais do CNJ.
- **Ação Dev:**
  - [x] Substituir o array hardcoded `datajudMovements` pela chamada real à API pública do DataJud: `https://api-publica.datajud.cnj.jus.br/api_publica_{tribunal}/_search`
  - [x] Usar o `case_number` (número CNJ) no body da requisição como filtro
  - [x] Mapear os campos de resposta do DataJud para o schema de `case_movements`
  - [x] Tratar erros de timeout (API do CNJ é instável)
  - [x] Considerar adicionar `DATAJUD_API_KEY` nas secrets caso a API exija autenticação

---

### 4. Edge Function `jusbrasil-sync` — Verificar Implementação

- **PRD Ref:** RF04 (Integração Jusbrasil)
- **Status:** Existe a Edge Function `jusbrasil-sync` deployada, mas precisa ser verificada se consome a API real do Jusbrasil ou se também é mock.
- **Ação Dev:**
  - [x] Auditar o código da `jusbrasil-sync`, verificar se faz chamada HTTP real
  - [x] Configurar `JUSBRASIL_API_KEY` nas secrets se necessário
  - [x] Conectar o frontend da página `/dashboard/publications` para invocar essa function

---

## 🟡 PRIORIDADE ALTA (Funcionalidade Incompleta)

### 5. Agendamento CRON para Edge Functions Background

- **PRD Ref:** RF12 (Vigia 24/7)
- **Status:** As Edge Functions `omniscient-watcher`, `process-followups` e `datajud-sync` existem e estão deployadas, porém **não possuem agendamento CRON automatizado**. Elas só executam quando invocadas manualmente via HTTP POST.
- **Impacto:** Nenhuma varredura proativa acontece. O sistema é 100% reativo atualmente.
- **Ação Dev:**
  - [x] Configurar Supabase CRON (pg_cron ou Supabase Scheduler) para:
    - `omniscient-watcher`: executar a cada 15 minutos
    - `process-followups`: executar a cada 1 hora
    - `datajud-sync`: executar diariamente às 06:00 (America/Sao_Paulo)
  - [x] Alternativa: usar um serviço externo (Easycron, GitHub Actions) para invocar as URLs das Edge Functions periodicamente
  - [x] Registrar cada execução em `audit_logs` para rastreabilidade (RNF03)

---

### 6. Edge Function `omniscient-watcher` — Corrigir Schema

- **PRD Ref:** RF12 (Vigia 24/7)
- **Status:** O código referencia colunas que **não existem** no schema:
  - `cases.next_deadline` → Não existe. Os prazos estão na tabela `deadlines` (separada)
  - `conversations.status = 'open'` → O enum real é `'aberta'`
  - `invoices.status = 'pending'` → O enum real é `'rascunho' | 'enviada' | 'paga' | 'vencida' | 'cancelada'`
  - `invoices.client_id` → Não existe. O campo real é `contact_id`
  - `invoices.total_amount` → Não existe. O campo real é `amount`
  - `webhook_logs.processed` → Não existe. O campo real é `status = 'received' | 'processed'`
- **Impacto:** A Edge Function dará erro em TODAS as suas 4 rotinas de varredura.
- **Ação Dev:**
  - [x] Corrigir Scan 1: `conversations.status = 'aberta'`
  - [x] Corrigir Scan 2: Buscar prazos via `deadlines` table com JOIN em `cases`, não `cases.next_deadline`
  - [x] Corrigir Scan 3: Filtrar `webhook_logs` por `status = 'received'` ao invés de `processed = false`
  - [x] Corrigir Scan 4: `invoices.contact_id`, `invoices.amount`, `invoices.status in ('vencida')`
  - ✅ Código corrigido em `scripts/edge-functions/omniscient-watcher.ts` — aguardando deploy

---

### 7. Conectar Inbox ao WhatsApp Agent

- **PRD Ref:** RF02, RF03 (Inbox + HITL)
- **Status:** A Edge Function `evolution-webhook` processa mensagens recebidas e cria `conversations` + `messages`. A Edge Function `whatsapp-agent` processa mensagens com IA e aplica HITL. Contudo, **não há chamada automática do webhook para o agent** — o webhook salva a mensagem, mas não dispara o agente para responder.
- **Impacto:** Mensagens do WhatsApp entram no Inbox, mas a IA não responde automaticamente.
- **Ação Dev:**
  - [x] No `evolution-webhook`, após inserir a mensagem no DB (caso `messages.upsert`), fazer `fetch()` para a Edge Function `whatsapp-agent` passando `contact_id`, `tenant_id`, `message`, `conversation_id`
  - [x] Salvar a resposta do agente como nova `message` com `sender_type: 'agent'` e `is_ai_generated: true`
  - [x] Encaminhar a resposta de volta para o WhatsApp via Evolution API (`sendText`)
  - ✅ Código implementado em `scripts/edge-functions/evolution-webhook.ts` — aguardando deploy

---

### 8. Tabela `court_holidays` Vazia — Semear Feriados

- **PRD Ref:** RF05 (Cálculo de Prazos CPC)
- **Status:** A tabela `court_holidays` existe com 0 registros. Sem feriados, o cálculo de prazos processuais em dias úteis será incorreto.
- **Ação Dev:**
  - [x] Inserir todos os feriados nacionais de 2025-2026
  - [x] Inserir o recesso forense (20/dez a 20/jan)
  - [x] Inserir feriados estaduais relevantes (SP, RJ, MG, BA)
  - [x] Marcar feriados recorrentes com `recurring = true`

---

### 9. Frontend `intelligence/tools/page.tsx` — Chamar Edge Functions Reais

- **PRD Ref:** RF07 (RAG), seções 1.3 e 1.4 do PRD (Análise/Síntese e Produção Técnica)
- **Status:** O botão "Gerar Síntese" e "Gerar Minuta" fazem INSERT direto no banco com conteúdo estático (template strings). Devem invocar `document-tools` (modo `synthesize` / `draft`) para obter texto gerado pela LLM.
- **Ação Dev:**
  - [x] Substituir a geração local por `supabase.functions.invoke('document-tools', { body: { mode: 'synthesize', text } })`
  - [x] Substituir a geração de minutas por `supabase.functions.invoke('document-tools', { body: { mode: 'draft', piece_type, legal_area, case_context } })`
  - [x] Manter o fluxo HITL já existente (salvar em `ai_drafts` após receber a resposta da LLM)

---

## 🟢 PRIORIDADE MÉDIA (Melhorias e Ajustes)

### 10. Fuso Horário (RNF06)

- **PRD Ref:** RNF06 (`America/Sao_Paulo`)
- **Status:** O frontend usa `new Date().toISOString()` em vários inserts, que gera timestamps UTC. Embora timestamps UTC sejam armazenados corretamente no Postgres (`timestamptz`), a **exibição** no frontend e nos disparos de follow-up por e-mail/WhatsApp devem sempre converter para UTC-3 explicitamente.
- **Ação Dev:**
  - [x] Usar biblioteca (ex: `date-fns-tz` ou `Intl.DateTimeFormat`) para renderizar datas em `America/Sao_Paulo`
  - [x] Verificar que os CRON jobs das Edge Functions rodem no timezone correto
  - [x] O campo `deadline.end_date` (date, sem timezone) deve ser tratado como date-only no fuso BRT
  - ✅ Utilitário criado: `src/utils/dateFormat.ts` com formatDateBR, formatDateTimeBR, formatRelativeTimeBR

---

### 11. Mascaramento LGPD para Edge Functions (RNF02)

- **PRD Ref:** RNF02 (Conformidade LGPD)
- **Status:** As Edge Functions `document-tools` e `whatsapp-agent` enviam dados textuais do cliente diretamente para a API da LLM sem stripping de PII (CPF, endereço, telefone).
- **Ação Dev:**
  - [x] Criar uma utility function `stripPII(text)` que use regex para remover/mascarar CPFs, CNPJs, telefones e endereços antes de enviar ao LLM
  - [x] Aplicar em `document-tools` (no `text` do modo synthesize e `case_context` do modo draft)
  - [x] Aplicar em `whatsapp-agent` (no `message` antes de invocar o LLM)
  - ✅ Utilitário criado: `src/utils/lgpdMask.ts` (frontend) + `scripts/edge-functions/lgpd_mask.ts` (Deno)

---

### 12. Audit Logs Automáticos (RNF03)

- **PRD Ref:** RNF03 (Trilhas de Auditoria Invioláveis)
- **Status:** A tabela `audit_logs` existe e o widget `F5_RecentActivity` a lê, mas **0 registros existem**, porque nenhum trigger ou middleware está inserindo logs automaticamente.
- **Ação Dev:**
  - [x] Criar triggers PostgreSQL (`AFTER INSERT/UPDATE/DELETE`) nas tabelas críticas: `cases`, `invoices`, `contacts`, `ai_drafts`, `calendar_events`
  - [x] Cada trigger deve inserir em `audit_logs` com `action`, `entity_type`, `entity_id`, `old_data`, `new_data`
  - [x] Alternativa: usar middleware no frontend (interceptor Supabase) para registrar ações do usuário

---

### 13. Biblioteca de Skills (RF10) — Interface CRUD

- **PRD Ref:** RF10 (Skills Reutilizáveis)
- **Status:** As tabelas `agent_skills` e `skills_library` existem no banco (ambas vazias, 0 registros). Não há interface no frontend para gerenciar skills (CRUD).
- **Ação Dev:**
  - [x] Criar página `/dashboard/intelligence/skills` com listagem, criação/edição de skills
  - [x] Permitir que o usuário defina: `title`, `prompt_template`, `skill_type`, `input_variables`, `legal_area`
  - [x] Integrar skills na UI de Ferramentas Cognitivas como opções selecionáveis

---

### 14. Motor de Macros (RF11) — Interface de Criação

- **PRD Ref:** RF11 (Macros Autônomas)
- **Status:** As tabelas `agent_macros` e `macro_executions` existem (ambas vazias). A Central de Inteligência tem card visual de "Macros", mas não há interface para criar/editar/executar macros.
- **Ação Dev:**
  - [x] Criar interface visual para construção de macros (pipeline builder)
  - [x] Permitir definir: `trigger_type` ('manual', 'case_status_change', 'deadline_approaching', etc.), `steps` (JSON array), `requires_hitl`
  - [x] Conectar execução à Edge Function ou lógica server-side que processe os steps

---

### 15. NPS / Pesquisa de Satisfação — Interface

- **PRD Ref:** Seção 7.4 (Pesquisa NPS pós-caso)
- **Status:** As tabelas `nps_surveys` e `nps_responses` existem (ambas vazias). Não há interface no frontend nem fluxo automatizado de envio.
- **Ação Dev:**
  - [x] Criar gatilho automático: quando `cases.status` muda para `'encerrado'`, criar registro em `nps_surveys`
  - [x] Enviar a pesquisa NPS via WhatsApp (follow-up rule com `stage = 'pos_venda'`)
  - [x] Criar dashboard de NPS em `/dashboard/financial/nps` ou seção dedicada

---

## 📋 RESUMO QUANTITATIVO

| Prioridade | Itens | Natureza |
|:---|:---:|:---|
| 🔴 **Crítica** | 4 | Configuração de secrets, integração LLM, API DataJud real, verificar Jusbrasil |
| 🟡 **Alta** | 5 | CRON scheduling, fix watcher schema, conexão webhook↔agent, feriados, Edge Functions no frontend |
| 🟢 **Média** | 6 | Timezone, LGPD, audit triggers, skills UI, macros UI, NPS |
| **Total** | **15** | |

---

> **Nota do QA:** Este backlog foi gerado com base na inspeção real do código-fonte das 9 Edge Functions deployadas, das 42 tabelas do schema Supabase, e de todos os arquivos TSX do frontend. Cada item foi confirmado empiricamente, não estimado.

— Quinn, guardião da qualidade 🛡️
