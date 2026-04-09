# 🧪 Guia Completo de Testes — Juris AI CRM

**Autor:** Quinn (QA Agent Guardian)
**Última atualização:** 09 de Abril de 2026
**Ambiente:** Produção — `adv.juanpaulo.com.br`
**Backend IA:** Ollama (MiniMax M2.7) na VPS Easypanel
**Status do Backend:** ✅ Validado via API em 09/04/2026

---

## 📋 Pré-Requisitos

Antes de iniciar os testes, confirme que:

- [ ] Você está logado em `https://adv.juanpaulo.com.br` com suas credenciais
- [ ] O Ollama está online na VPS (`https://projetos-ollama.fbnowr.easypanel.host`)
- [ ] Você tem pelo menos 1 caso cadastrado no sistema (menu **Casos**)
- [ ] Você tem pelo menos 1 contato cadastrado (menu **Contatos**)

> **💡 Dica:** Se algo falhar, abra o Console do Navegador (F12 → aba Console) e copie a mensagem de erro vermelha. Isso vai me ajudar a diagnosticar em segundos.

---

## 🧠 TESTE 1: Ferramentas Cognitivas (Geração de Minutas)

**O que testa:** A IA recebe seu texto e gera uma peça jurídica completa usando o modelo MiniMax.
**Rota de navegação:** `Menu lateral → Inteligência → Ferramentas Cognitivas`
**Edge Function ativada:** `document-tools` (modo `draft`)

### Passo-a-passo:

1. Acesse o menu **Inteligência** no painel lateral esquerdo
2. Clique em **Ferramentas Cognitivas** (ícone ⚙️ com estrela)
3. A tela terá duas divisões principais; foque na seção da direita: **"Co-Piloto de Redação"**
4. Preencha os campos principais e processuais:
   - **Área do Direito:** `Consumidor`
   - **Tipo de Peça:** `Petição Inicial`
   - **Contexto do Caso:** 
     ```
     Cliente adquiriu um notebook no site da Magazine Luiza por R$ 3.500,00.
     O produto chegou com a tela danificada e a empresa recusou a troca
     dentro do prazo legal de 30 dias. O cliente tem notas fiscais e fotos
     do produto danificado.
     ```
   - **Autor (Requerente):** `João da Silva`
   - **Réu (Requerido):** `Magazine Luiza S/A`
   - **Juiz(a), Vara, Comarca, Processo:** (Preencha dados fictícios de comarca/vara para testar o endereçamento)
   - **Advogado(a) Subscritor:** `Dra. Mariana Souza`
   - **Nº da OAB:** `SP123456`
5. Clique em **"Gerar Minuta"**
6. Aguarde entre **30 segundos e 2 minutos** (o modelo está na VPS)

### ✅ Resultado Esperado:
- Um bloco de texto em Markdown renderizado ("estilo Word") deve aparecer na tela com a petição
- O texto deve conter seções como: DOS FATOS, DO DIREITO, DOS PEDIDOS
- **O Endereçamento** deve conter os dados do Juízo/Vara que você preencheu
- **A Qualificação** deve conter o nome de Autor e Réu sem perguntar novamente
- **A Assinatura final** da peça deve conter "Dra. Mariana Souza" e a OAB "SP123456"
- Deve conter placeholders `[COMO ESTE]` APENAS para os dados não preenchidos no form
- **Nenhum CPF, telefone ou e-mail real** no Contexto deve aparecer na peça (LGPD)
- Botões de **Aprovar** / **Rejeitar** (HITL) e cópia devem aparecer abaixo da minuta

### 🔴 Se falhar:
| Sintoma | Causa Provável | Solução |
|---|---|---|
| Spinner infinito | VPS do Ollama offline | Verificar se o container Ollama está rodando no Easypanel |
| Erro "Failed to fetch" | CORS ou URL incorreta | Abra o Console (F12) e me envie o erro |
| Texto genérico/template | Frontend não chamou a Edge Function | Me avise — corrigirei o código do botão |

---

## 📝 TESTE 2: Síntese de Documentos (Análise por IA)

**O que testa:** A IA lê um texto longo e produz uma síntese cronológica.
**Rota de navegação:** `Menu lateral → Inteligência → Ferramentas Cognitivas`
**Edge Function ativada:** `document-tools` (modo `synthesize`)

### Passo-a-passo:

1. Na mesma página de **Ferramentas Cognitivas**
2. Encontre a seção da esquerda: **"Síntese Documental"**
3. Cole o seguinte texto de exemplo no campo:
   ```
   Em 15/01/2026, o autor ajuizou ação trabalhista contra a empresa XYZ Ltda,
   alegando rescisão indireta por atraso reiterado de salários. O empregador
   não pagou os meses de outubro, novembro e dezembro de 2025. Em 20/02/2026,
   a audiência inicial foi realizada sem acordo. Em 10/03/2026, o perito do
   trabalho emitiu laudo confirmando as irregularidades. O juiz marcou 
   audiência de instrução para 15/04/2026.
   ```
4. Clique em **"Gerar Síntese"**
5. Aguarde entre **20 segundos e 1 minuto**

### ✅ Resultado Esperado:
- Um resumo analítico com a cronologia dos fatos destacados
- Pontos-chave organizados com clareza jurídica
- Linguagem técnica e profissional

---

## 📚 TESTE 3: Base de Conhecimento (RAG)

**O que testa:** Ingestão de texto no Knowledge Base e busca semântica via chat.
**Rota de navegação:** `Menu lateral → Inteligência → Base de Conhecimento`
**Edge Function ativada:** `rag-pipeline` (modos `ingest` e `chat`)

### Passo-a-passo (Ingestão):

1. Acesse **Inteligência → Base de Conhecimento**
2. No formulário **"Adicionar Documento"**:
   - **Título:** `Súmula 297 do TST`
   - **Texto:** 
     ```
     SÚMULA 297 DO TST - PREQUESTIONAMENTO. OPORTUNIDADE. CONFIGURAÇÃO.
     I - Diz-se prequestionada a matéria ou questão quando na decisão 
     impugnada haja sido adotada, explicitamente, tese a respeito.
     II - Incumbe à parte interessada, desde que a matéria haja sido 
     invocada no recurso principal, opor embargos declaratórios 
     objetivando o pronunciamento sobre o tema.
     ```
3. Clique em **"Salvar"**

### Passo-a-passo (Chat RAG):

4. Na mesma página, role até o **Chat da Base de Conhecimento**
5. Digite: `O que diz a Súmula 297 sobre prequestionamento?`
6. Pressione Enter ou clique em Enviar
7. Aguarde a resposta da IA

### ✅ Resultado Esperado:
- A ingestão deve mostrar confirmação verde ✅
- O chat deve retornar uma resposta que **mencione o conteúdo da súmula** que você acabou de ingerir
- A resposta deve ser contextualizada e não genérica

---

## 💬 TESTE 4: WhatsApp Agent (IA no Inbox)

**O que testa:** A IA responde automaticamente mensagens recebidas via WhatsApp.
**Rota de navegação:** `Menu lateral → Inbox`
**Edge Functions ativadas:** `evolution-webhook` → `whatsapp-agent`

### Passo-a-passo:

1. **Do seu celular**, envie uma mensagem para o número do WhatsApp conectado ao Evolution API:
   ```
   Olá, gostaria de saber o andamento do meu processo trabalhista.
   Meu nome é Maria Silva.
   ```
2. Aguarde entre **30 segundos e 2 minutos**
3. No sistema, acesse **Inbox** no menu lateral

### ✅ Resultado Esperado:
- A mensagem deve aparecer no Inbox com a conversa criada
- Uma **resposta automática da IA** (com tag "IA" ou ícone de ⚡) deve ter sido enviada de volta ao WhatsApp
- A resposta deve ser cortês, profissional e NÃO revelar dados sensíveis
- No WhatsApp do celular, você deve receber a resposta da IA

### ⚠️ Pré-requisito:
- O WhatsApp precisa estar **conectado** via Evolution API em `Configurações → Canais`
- O QR Code precisa ter sido escaneado previamente

> **Se o WhatsApp não estiver conectado**, este teste será ignorado. Basta me avisar e ajudaremos a configurar.

---

## 🔍 TESTE 5: Vigia 24/7 (Omniscient Watcher)

**O que testa:** O sistema varre proativamente o banco detectando anomalias.
**Rota de navegação:** `Menu lateral → Inteligência → Vigia 24/7`
**Edge Function ativada:** `omniscient-watcher`

### Passo-a-passo:

1. Acesse **Inteligência → Vigia 24/7**
2. Clique no botão **"Executar Varredura Manual"** (se disponível na interface)
3. Caso não exista botão na UI, abra um novo aba no navegador e cole:
   ```
   https://voosldmiiwxzfofazviq.supabase.co/functions/v1/omniscient-watcher
   ```

### ✅ Resultado Esperado:
- O Watcher deve retornar um JSON com os resultados dos 4 scans:
  - **Scan 1:** Conversas abertas sem resposta há mais de 2 horas
  - **Scan 2:** Prazos judiciais vencendo em até 48 horas
  - **Scan 3:** Webhooks recebidos e não processados  
  - **Scan 4:** Faturas vencidas
- Cada alerta detectado deve ter sido gravado na tabela `audit_logs`

---

## ⚖️ TESTE 6: Sincronização DataJud (Movimentações Processuais)

**O que testa:** Buscar movimentações reais de um processo no CNJ.
**Edge Function ativada:** `datajud-sync`

### Passo-a-passo:

1. Certifique-se de ter um caso cadastrado com um **número CNJ real**
   - Exemplo: `0001234-56.2024.5.01.0001`
2. Na página do caso, procure o botão **"Sincronizar com DataJud"**
3. Clique e aguarde

### ✅ Resultado Esperado:
- Movimentações processuais reais devem aparecer na timeline do caso
- Cada movimentação deve ter data, descrição e complemento
- Um registro em `audit_logs` deve ser criado

### ⚠️ Nota:
- Este teste requer a chave real `DATAJUD_API_KEY` configurada nos Secrets do Supabase
- Se a chave ainda for o placeholder `"sua-chave-api-datajud"`, o teste retornará erro 401/403
- Obtenha sua chave no portal [Sinergia/DataJud do CNJ](https://datajud-wiki.cnj.jus.br/)

---

## 📰 TESTE 7: Clipping Jusbrasil (Publicações)

**O que testa:** Buscar publicações oficiais de um advogado/escritório.
**Edge Function ativada:** `jusbrasil-sync`

### Passo-a-passo:

1. Acesse **Dashboard → Publicações** (se disponível)
2. Procure um botão de **"Buscar Publicações"** ou **"Sincronizar"**
3. Clique e aguarde

### ⚠️ Nota:
- Requer a chave `JUSBRASIL_API_KEY` configurada nos Secrets
- Se a chave for placeholder, o teste será ignorado

---

## 🔐 TESTE 8: Conformidade LGPD (Mascaramento de PII)

**O que testa:** Dados pessoais são mascarados antes de serem enviados à IA.
**Onde testar:** Teste 1 (Minutas) ou Teste 2 (Síntese)

### Passo-a-passo:

1. Repita o **Teste 1 (Minutas)**, mas no campo "Contexto do Caso" inclua dados pessoais:
   ```
   O cliente João da Silva, CPF 123.456.789-00, residente na 
   Rua das Flores 123, CEP 01234-567, telefone (11) 98765-4321,
   email joao@email.com, comprou um produto defeituoso.
   ```
2. Gere a minuta

### ✅ Resultado Esperado:
- A minuta gerada **NÃO deve conter** o CPF, telefone, e-mail ou CEP reais
- Esses dados devem ter sido substituídos por `***.***.***-**`, `(11) *****-****`, `[email-mascarado]`, etc.
- O texto jurídico em si deve ser coerente apesar da mascaragem

---

## 📊 Checklist Final de Validação

Após executar os testes, marque o status de cada um:

| # | Teste | Status | Observações |
|---|---|---|---|
| 1 | Geração de Minutas | ⬜ | |
| 2 | Síntese de Documentos | ⬜ | |
| 3 | Base de Conhecimento (RAG) | ⬜ | |
| 4 | WhatsApp Agent | ⬜ | |
| 5 | Vigia 24/7 | ⬜ | |
| 6 | DataJud Sync | ⬜ | |
| 7 | Jusbrasil Sync | ⬜ | |
| 8 | LGPD / Mascaramento | ⬜ | |

**Legenda:** ✅ Passou | ❌ Falhou | ⏭️ Ignorado (pré-requisito faltando) | ⬜ Não testado

---

## 🆘 Se Algo Falhar: Guia de Troubleshooting Rápido

### Erro "Failed to fetch" ou "Network Error"
- **Causa:** O servidor da VPS pode estar offline
- **Verificar:** Acesse `https://projetos-ollama.fbnowr.easypanel.host/v1/models` no navegador. Se não carregar, o Ollama caiu.
- **Solução:** Reiniciar o container Ollama no Easypanel

### Erro "Boot failure" ou resposta em branco
- **Causa:** O modelo MiniMax M2.7 não está carregado no Ollama
- **Verificar:** No terminal da VPS: `ollama list` — deve mostrar `minimax-m2.7:cloud`
- **Solução:** `ollama pull minimax-m2.7:cloud`

### Spinner que nunca para (mais de 3 minutos)
- **Causa:** O modelo está processando, mas a VPS tem pouca RAM/GPU
- **Solução:** Esperar ou aumentar os recursos do container no Easypanel

### Resposta genérica tipo "template" sem IA
- **Causa:** O frontend pode não estar chamando a Edge Function
- **Verificar:** F12 → aba Network → procurar requisição para `document-tools` ou `rag-pipeline`
- **Solução:** Me avisar (`@dev`) para eu corrigir o código do botão

---

## 🏗️ Arquitetura Simplificada do Fluxo de IA

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────────────────┐
│  FRONTEND   │────▶│  SUPABASE EDGE   │────▶│  OLLAMA VPS (Easypanel)     │
│  (Next.js)  │     │  FUNCTIONS       │     │  Modelo: minimax-m2.7:cloud │
│             │◀────│  (Deno Runtime)  │◀────│                             │
└─────────────┘     └──────────────────┘     └─────────────────────────────┘
                          │
                    ┌─────┴─────┐
                    │ LGPD Mask │ ← Mascara CPF/CNPJ/Tel
                    │ (lgpd_    │   ANTES de enviar à IA
                    │  mask.ts) │
                    └───────────┘
```

### Edge Functions Deployadas (9 ativas):

| Função | Status | Descrição |
|---|---|---|
| `document-tools` v5 | ✅ ACTIVE | Síntese e geração de minutas com suporte a dados processuais/advogado |
| `rag-pipeline` v3 | ✅ ACTIVE | Base de conhecimento + chat RAG |
| `whatsapp-agent` v3 | ✅ ACTIVE | Agente de IA para WhatsApp |
| `evolution-webhook` v2 | ✅ ACTIVE | Recebe mensagens do WhatsApp |
| `omniscient-watcher` v2 | ✅ ACTIVE | Vigia proativa 24/7 |
| `datajud-sync` v3 | ✅ ACTIVE | Sincronização com CNJ/DataJud |
| `jusbrasil-sync` v2 | ✅ ACTIVE | Clipping de publicações |
| `process-followups` v1 | ✅ ACTIVE | Follow-ups automáticos |
| `agent-memory` v1 | ✅ ACTIVE | Memória conversacional do agente |

---

> **🛡️ Quinn (QA):** Este guia foi gerado com base nos testes reais de API realizados em 09/04/2026, onde a Edge Function `document-tools` (v5) retornou com sucesso uma petição rica em Markdown gerada pelo modelo MiniMax M2.7 via Ollama na VPS Easypanel.
