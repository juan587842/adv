# Documento de Requisitos de Produto (PRD) e Arquitetura de Sistemas
## Plataforma CRM Jurídica Multiagente e Automação Omnicanal

---

## Contexto

A profunda reestruturação do mercado jurídico brasileiro tem exigido uma adaptação tecnológica sem precedentes por parte de escritórios de advocacia, sejam eles compostos por profissionais autônomos ou por múltiplas equipes de especialistas. O cenário contemporâneo evidencia um esgotamento do modelo tradicional de operação legal, no qual advogados perdem uma vasta quantidade de horas úteis engajados em tarefas de natureza repetitiva, mecânica e de baixo valor estratégico. Entre essas atividades, destacam-se a leitura exaustiva de diários oficiais, a triagem desestruturada de documentos, a organização de arquivos, a conferência manual de prazos processuais e a atualização constante e reativa de clientes através de canais de comunicação digital. A consequência direta dessa sobrecarga administrativa é a elevação drástica da fadiga mental do profissional, um fator que atua como catalisador primário para a ocorrência de falhas operacionais críticas, tais como a perda de prazos peremptórios, que continuam a figurar entre as principais causas de responsabilização civil e disciplinar na advocacia.

Em resposta a essa conjuntura, o presente documento estabelece as diretrizes fundamentais, a arquitetura de software e os requisitos de produto para o desenvolvimento de um Customer Relationship Management (CRM) jurídico de próxima geração, estruturado nativamente em nuvem sob o formato de um webapp multilocatário (multi-tenant). Todo o ecossistema será construído utilizando o paradigma de vibecoding (codificação assistida por IA) através da plataforma Google Antigravity, que permite transformar comandos em linguagem natural em aplicações full-stack prontas para produção, integrando-se via Model Context Protocol (MCP) ao banco de dados Supabase. O diferencial tecnológico e competitivo desta solução reside na sua fundação sobre o paradigma de Sistemas Multiagentes (MAS) de Inteligência Artificial, projetados não apenas para armazenar dados, mas para orquestrar ativamente o fluxo de trabalho do escritório. A premissa operacional da plataforma é singular e disruptiva: a delegação máxima de funções operacionais, administrativas e de atendimento primário para agentes autônomos de software, garantindo que o advogado humano seja acionado e interaja com o sistema ou com o cliente exclusivamente quando houver a exigência inegociável de formulação estratégica, interpretação de contextos fáticos complexos, negociação de acordos ou deliberações éticas de alta sensibilidade.

O relatório a seguir exaure a concepção dessa solução, mapeando a reengenharia dos fluxos de trabalho, a arquitetura de banco de dados no Supabase, a topologia de integrações com ecossistemas de dados como Jusbrasil e Datajud, a infraestrutura de comunicação via Evolution API e o desenvolvimento de um Inbox proprietário com transbordo inteligente (Human-in-the-Loop), além de definir a estrita conformidade com as diretrizes da Ordem dos Advogados do Brasil (OAB) e com a Lei Geral de Proteção de Dados (LGPD).

---

## 1. Desconstrução e Reengenharia do Fluxo de Trabalho Jurídico

Para que o CRM atinja seu potencial máximo de automação, é mandatório desconstruir o fluxo de trabalho diário de um advogado brasileiro, dissecando-o em microetapas lógicas. A ineficiência crônica observada na grande maioria dos escritórios não deriva de deficiências no conhecimento técnico-jurídico, mas sim da ausência de processos internos eficientes e padronizados, o que força as equipes a operarem de maneira quase artesanal e altamente fragmentada.

A primeira fase crítica deste fluxo envolve a **prospecção, a triagem inicial e o atendimento preliminar**. No modelo convencional, a captação de clientes exige que o advogado atue, na prática, como um atendente de primeiro nível. Esse fenômeno obriga o profissional a interromper ciclos de trabalho profundo. Na arquitetura proposta para o novo CRM, essa etapa é integralmente absorvida por um Agente de IA Conversacional especializado, operando diretamente na interface do WhatsApp. Este agente é programado para realizar o Lead Scoring de forma autônoma, identificar a área do direito aplicável, solicitar a documentação preliminar necessária e efetuar a marcação de uma consulta na agenda sincronizada do advogado.

Superada a fase de contratação, o escritório adentra a segunda etapa: **monitoramento contínuo e registro processual**. A solução arquitetada inverte a lógica de pesquisa manual, estabelecendo rotinas de varredura automatizada na API Pública do Datajud e no Jusbrasil. Por meio dessa integração, o sistema captura movimentações e sentenças de forma passiva, estruturando os metadados JSON no dossiê digital correspondente. Os algoritmos procedem ao cálculo preditivo dos prazos e registram a tarefa no calendário da equipe responsável.

A terceira fase reside na **análise, interpretação e síntese** de volumes massivos de documentos. A leitura exaustiva gera fadiga cognitiva. Neste ponto, a arquitetura introduz ferramentas de IA para gerar sínteses objetivas, mapas mentais e resumos estruturados das peças (como prazos, obrigações e penalidades contratuais), promovendo a glanceability da interface.

A quarta etapa compreende a **produção técnica**. A plataforma intervirá posicionando a IA como um co-piloto de redação (drafting assistant). Apoiando-se no contexto factual do caso e no acervo de teses do escritório, a IA estrutura as minutas iniciais de petições. O advogado atua exclusivamente na curadoria, revisão de fundamentos e inserção do tom argumentativo, potencializando a inteligência humana.

Por fim, a quinta fase envolve a **gestão do relacionamento e a automação do setor financeiro**. O sistema aciona fluxos para traduzir o andamento processual técnico para uma linguagem empática, disparando notificações ativas para o WhatsApp do cliente. Financeiramente, o CRM assumirá a automação de ponta a ponta: o sistema emitirá guias de custas judiciais, monitorará prazos de compensação e rastreará a expedição de alvarás de pagamento, enviando notificações que auxiliam na previsibilidade e na saúde do fluxo de caixa do escritório.

| Estágio do Fluxo | Fricção e Gargalo Operacional | Solução Automatizada no CRM |
|---|---|---|
| Prospecção | Interrupção constante para dúvidas genéricas. | Agente via Evolution API faz Lead Scoring e agendamento. |
| Monitoramento | Pesquisa manual e anotação com risco de perda de prazo. | Integração (Jusbrasil/Datajud) com cálculo preditivo no calendário. |
| Análise | Leitura exaustiva de processos volumosos. | IA extrai metadados e gera resumos tabulados de fácil consulta. |
| Elaboração | Criação repetitiva de minutas e formatação. | Agente RAG atua como co-piloto de redação de peças. |
| Financeiro e Retenção | Descontrole de caixa por atrasos em guias e falta de follow-up. | Automação na gestão de custas, rastreio de alvarás e envio de updates ao cliente via WhatsApp. |

---

## 2. Arquitetura de Dados Multi-Tenant e Integração via Supabase MCP

A arquitetura base do sistema abandona hospedagens tradicionais em favor de uma infraestrutura serverless moderna. O desenvolvimento será inteiramente orquestrado pelo Google Antigravity, utilizando a ponte de conexão segura Model Context Protocol (MCP) para construir e gerenciar o backend diretamente no banco de dados Supabase (PostgreSQL).

Como o sistema atenderá desde advogados autônomos até corporações com centenas de profissionais, a governança dos dados é viabilizada por uma rígida **Arquitetura Multi-Tenant (Multilocatário)** protegida por políticas de Row Level Security (RLS) do Supabase. Essa abordagem permite que múltiplos escritórios compartilhem o mesmo banco de dados com isolamento lógico inviolável.

O desenvolvimento via vibecoding instruirá o banco de dados a criar políticas onde um usuário autenticado só pode executar comandos de leitura e escrita (SELECT, UPDATE, DELETE) em registros (casos, faturas, documentos) cujo `tenant_id` corresponda ao seu próprio ID de locatário. Para garantir que a aplicação possa escalar para o processamento de milhões de movimentações sem gargalos de latência, serão aplicados **índices B-tree** em todas as colunas envolvidas nas lógicas de RLS, assegurando alta performance na recuperação de dossiês processuais.

Além disso, a interface gráfica (Dashboard) será pautada pelo **Legal Design**, utilizando layouts em F-pattern que destacam os prazos fatais urgentes nas zonas de maior atenção visual da tela, minimizando o ruído e a complexidade técnica para o operador.

---

## 3. Ecossistema Omnicanal: Evolution API e Inbox Nativo (Estilo Chatwoot)

O fluxo de comunicação, alicerçado no WhatsApp, será sustentado pela **Evolution API (v2)**, rodando de forma isolada em contêineres Docker para garantir estabilidade e uso controlado de memória. O sistema suportará a flexibilidade da Baileys API (para escritórios menores, sem custo por mensagem) ou a WhatsApp Cloud API oficial (para médias e grandes bancas que demandam os selos e proteções do ecossistema da Meta).

Ao invés de depender de plataformas de terceiros, o webapp contará com um **Inbox Unificado Nativo**, desenvolvido sob medida pela plataforma Antigravity. Esse Inbox espelhará a eficiência de sistemas consagrados como o Chatwoot, centralizando conversas de WhatsApp, e-mail e chat. Ele incluirá funcionalidades colaborativas essenciais para escritórios de advocacia, como:
- Criação de **notas privadas** na conversa (invisíveis ao cliente) para discussão de teses entre os advogados
- Sistema de **tags** para categorizar o nível de urgência do lead
- Mensagens padronizadas de **respostas rápidas**

---

## 4. Arquitetura de Inteligência Artificial e Sistemas Multiagentes (MAS)

A verdadeira revolução tecnológica embarcada no CRM fundamenta-se na orquestração de uma Arquitetura de Inteligência Artificial Generativa desenhada integralmente sobre o paradigma de **Sistemas Multiagentes (MAS)**. A indústria de software abandonou a dependência de um único LLM generalista em favor de um ecossistema distribuído de entidades cognitivas (Agentes), onde cada um é dotado de um perfil extremamente delimitado e acesso a ferramentas (Tools) condizentes com suas responsabilidades. Para viabilizar essa arquitetura dentro da abordagem de vibecoding, o sistema se valerá de bibliotecas e frameworks de código voltados para IA de alto desempenho, notadamente **LangGraph**, **Agno** e **LangChain**.

A espinha dorsal cognitiva de todos esses agentes será o modelo **MiniMax M2.7**, executado através da nuvem do Ollama (`minimax-m2.7:cloud`). Este modelo foi selecionado por sua arquitetura otimizada para fluxos de trabalho agênticos (agentic workflows) e por suportar uma janela de contexto massiva de mais de 200 mil tokens, permitindo a análise integral de processos volumosos com altíssima aderência ao uso de ferramentas e excelente custo-benefício para a operação do escritório.

Inspirado na arquitetura de agentes autônomos de ponta, o CRM incorporará quatro capacidades avançadas para transcender a automação tradicional:

### 4.1. Memória Persistente e Contínua (Agentic Memory)
Uma das maiores forças da arquitetura é a memória persistente, que permite ao agente lembrar de interações passadas e do contexto do usuário. Em vez de a IA tratar cada dúvida do cliente no WhatsApp como uma nova conversa, o banco de dados do Supabase (com o framework Agno ou LangGraph) dará "memória de longo prazo" aos agentes. A IA lembrará de detalhes de conversas de meses atrás, do tom de voz preferido do advogado e do histórico familiar do cliente, gerando um atendimento absurdamente humanizado e contínuo.

### 4.2. Sistema de "Skills" (Habilidades) Reutilizáveis
A plataforma permite a instalação de skills e a transformação de fluxos de trabalho em ferramentas reutilizáveis que a IA aprende a usar. O escritório terá uma "Biblioteca de Habilidades" interna no CRM. Se um advogado cria um prompt muito bom para analisar contratos de locação, ele pode salvar isso como uma "Skill". O Agente Onisciente passa a ter essa nova ferramenta no seu arsenal. Com o tempo, o próprio escritório vai ensinando novas habilidades jurídicas para a IA, tornando o sistema cada vez mais inteligente e moldado ao método de trabalho da equipe.

### 4.3. Motor de Macros para Automações Complexas
O ecossistema utilizará um motor de macros focado em transformar ferramentas simples em pipelines de automação seguros. Usando o LangGraph, o Agente Onisciente poderá encadear ações de forma autônoma. Por exemplo, a IA pode aprender a macro "Fechamento de Caso": ela vai, sozinha, buscar a sentença no Datajud, gerar um resumo simplificado, calcular as custas finais, criar a fatura no módulo financeiro do CRM e preparar a mensagem de WhatsApp para aprovação do advogado (via transbordo/HITL). Tudo isso disparado por um único gatilho.

### 4.4. Operação Autônoma de Longo Prazo (Vigia 24/7)
O sistema é construído para rodar o tempo todo, lendo e-mails, monitorando sistemas e agindo proativamente. Em vez de o Agente Onisciente ser apenas um chatbot que o advogado consulta quando precisa (modelo reativo), ele será configurado como um trabalhador em background. Ele pode vigiar o Inbox unificado e a API do Jusbrasil 24 horas por dia. Se entrar um e-mail urgente de um cliente de madrugada, a IA pode categorizar a urgência, cruzar com os dados do processo no Supabase e deixar um dossiê pronto e priorizado na tela do advogado para as 8h da manhã.

### 4.5. Human-in-the-Loop (HITL)
A OAB proíbe que máquinas prestem consultoria jurídica finalística. Portanto, o CRM implementa o padrão **Human-in-the-Loop (HITL)** de forma intrínseca.

**No fluxo de atendimento do WhatsApp** operado pelo Agno, quando a IA detecta uma pergunta de alta complexidade ou um contexto fático que exige tomada de decisão do advogado, ela aciona o seu estado de pausa (acionando as funções como `is_paused`). Imediatamente, um alerta é emitido no Inbox Unificado Nativo do CRM. O advogado assume a conversa com todo o histórico intacto; após prestar a consultoria, ele clica em um botão na interface que invoca o método de retomada (ex: `continue_run` no Agno), devolvendo a operação rotineira ao robô.

**No núcleo interno do sistema**, operado pelo LangGraph (para confecção de peças e análise de documentos), é utilizada a função `interrupt`. Essa função paralisa com segurança a máquina de estados antes que a IA tome qualquer ação irreversível (como protocolar um documento ou enviar um e-mail oficial). O estado do grafo é salvo no banco de dados, e o humano toma a decisão de aprovar, editar ou rejeitar o passo da IA antes que a execução prossiga.

### 4.6. RAG via pgvector
O desenvolvimento do "Agente Onisciente" utilizará o suporte nativo do Supabase à extensão **pgvector**. Isso permite armazenar os embeddings das petições e aplicar técnicas avançadas de RAG (Retrieval-Augmented Generation) diretamente no banco de dados central, sem a necessidade de provedores vetoriais de terceiros, garantindo buscas semânticas ultrarrápidas na jurisprudência do escritório.

---

## 5. Integrações de Dados do Judiciário

A automação processual consumirá dados de forma híbrida:

- **API Pública do Datajud (CNJ):** Integração RESTful gratuita e baseada no número único do processo, responsável por buscar de forma passiva os andamentos e atualizar a capa processual com as varreduras de metadados padrão do CNJ.
- **API do Jusbrasil:** Atuará como a principal fonte privada (B2B) de preenchimento de lacunas, minerando o conteúdo bruto (textos completos) dos Diários Oficiais e alimentando a base vetorial do sistema, cobrindo eventuais defasagens de tempo da malha estatal.

---

## 6. Segurança e Conformidade (OAB e LGPD)

Como o sistema lida com dados processuais sensíveis e sigilo advocatício, o ambiente está incondicionalmente subordinado à Lei Geral de Proteção de Dados (LGPD) e ao Provimento 222/2023 da OAB.

- **Transparência Algorítmica:** O agente no WhatsApp declarará proativamente sua natureza sintética, respeitando o princípio ético da advocacia de não enganar o usuário em prol do "atendimento robotizado".
- **Zero Data Retention:** Acordos contratuais de nível Enterprise com provedores de IA garantirão que as petições submetidas ao modelo não sejam utilizadas para treinamento aberto.
- **Logs de Auditoria (Audit Trail):** Todas as consultas feitas aos dossiês e as aprovações no sistema HITL serão gravadas em tabela inviolável, registrando a identidade (ID), data e hora de quem acessou as informações, cumprindo a prestação de contas exigida pela lei.

---

## 7. Estratégia de Follow-up Omnicanal Automatizado

A ausência de um acompanhamento sistemático (follow-up) é responsável por uma expressiva perda de receitas em escritórios de advocacia. Para evitar que propostas esfriem ou clientes fiquem desamparados, o CRM incorporará uma régua de cadência automatizada, executada pelos Agentes de IA, segmentada para cada etapa da jornada do jurisdicionado:

### 7.1. Leads Novos (Fase de Prospecção)
A velocidade de resposta e a nutrição de leads são decisivas no fechamento de contratos. A IA aplicará uma cadência de acompanhamento em casos onde o lead recebeu a proposta de honorários, mas não tomou uma decisão imediata:
- **Toque 1 (Dia 2):** O agente envia uma mensagem de texto amigável pelo WhatsApp ou E-mail perguntando se restou alguma dúvida sobre o contrato.
- **Toque 2 (Dia 4):** A IA envia materiais que geram autoridade e ancoragem, como um Case de Sucesso anonimizado de um processo semelhante vencido pelo escritório, engajando o cliente pela prova social.
- **Toque 3 (Dia 7 - Fechamento de Loop):** Uma última mensagem cordial informando que o escritório permanece à disposição para quando o cliente se sentir pronto para avançar, mantendo as portas abertas sem gerar insistência inoportuna.

### 7.2. Clientes Agendados (Pré-Consulta)
O índice de faltas (no-shows) em reuniões jurídicas gera ociosidade na agenda do advogado. O CRM acionará lembretes preditivos:
- **Notificações Antecipadas:** O sistema disparará uma mensagem via WhatsApp 24 horas antes e, novamente, 1 hora antes da reunião, solicitando de forma estruturada: "Responda 'Confirmar' ou 'Remarcar'".
- **Lembrete de Documentação:** Em paralelo, a IA enviará o checklist exato da documentação que o cliente precisa ter em mãos para a consulta, garantindo que a reunião seja produtiva.

### 7.3. Clientes Ativos (Fase Processual)
A maior causa de insatisfação na advocacia é a falta de comunicação durante o longo andamento dos processos.
- **Gatilhos de Processo:** Através da integração contínua com as APIs do Datajud e Jusbrasil, o CRM detectará movimentações (ex: "Audiência Marcada", "Alvará Expedido").
- **Tradução Empática:** O Agente de IA interceptará o andamento técnico, reescreverá a informação para uma linguagem leiga, e fará um disparo proativo (push notification) no WhatsApp do cliente, reduzindo a ansiedade e as mensagens passivas enviadas ao advogado.

### 7.4. Clientes Antigos e Retenção (Pós-Venda)
Um cliente satisfeito com um processo finalizado é a maior fonte de novas indicações (receita recorrente e marketing boca-a-boca).
- **Pesquisa de Satisfação:** Após o arquivamento do caso e repasse financeiro, o sistema envia uma pesquisa de feedback rápida (NPS) para avaliar o atendimento do escritório.
- **Nutrição de Longo Prazo:** O CRM utilizará WhatsApp Broadcasts de forma ética (obedecendo a OAB e a LGPD) para manter o escritório na memória do cliente, enviando mensagens em datas comemorativas ou informes de utilidade pública (ex: informando sobre novas regras de aposentadoria ou direitos do consumidor recém-aprovados).

---

## 8. Requisitos Funcionais (RF) e Não Funcionais (RNF)

### Requisitos Funcionais (RF)

| ID | Descrição |
|----|-----------|
| RF01 | O sistema deve suportar criação e gerenciamento de múltiplas contas de escritórios (Tenants) com dados totalmente isolados. |
| RF02 | O sistema deve possuir um Inbox Nativo centralizado capaz de gerenciar e exibir mensagens oriundas da Evolution API (WhatsApp). |
| RF03 | O Agente Conversacional deve permitir o fluxo Human-in-the-Loop, pausando seu funcionamento via código para intervenção humana e sendo capaz de ser retomado por um comando na interface. |
| RF04 | A plataforma deve recuperar e sincronizar andamentos processuais de forma assíncrona consumindo as APIs do Datajud e do Jusbrasil. |
| RF05 | O CRM deve calcular prazos processuais e adicionar obrigações automaticamente no calendário das equipes responsáveis, levando em conta o CPC. |
| RF06 | O sistema financeiro deve monitorar automaticamente a emissão/vencimento de guias de custas e a expedição de alvarás de pagamento. |
| RF07 | O sistema deve fornecer um ambiente RAG, convertendo documentos em embeddings e permitindo consultas vetoriais sobre o acervo do cliente. |
| RF08 | O sistema deve utilizar o modelo MiniMax M2.7 via nuvem do Ollama como base de linguagem, otimizando o consumo da janela de contexto estendida. |
| RF09 | O sistema deve implementar memória persistente (Agentic Memory) armazenada no Supabase para que a IA se recorde de interações e informações prévias do cliente. |
| RF10 | O sistema deve oferecer uma "Biblioteca de Skills" na qual a equipe do escritório possa salvar fluxos de prompts e tarefas que poderão ser reaproveitados pelos agentes de IA. |
| RF11 | O sistema deve ser capaz de criar macros autônomas de automação para orquestrar diversas sub-tarefas operacionais a partir de um único gatilho processual. |
| RF12 | A IA Onisciente e os agentes devem operar ininterruptamente (24/7) em background, vigiando o ecossistema do escritório para categorizar e preparar expedientes proativamente. |
| RF13 | O CRM deve incluir fluxos de automação de follow-up segmentados, disparando réguas de comunicação via WhatsApp e E-mail para leads não convertidos, lembretes pré-reunião e atualizações de processos em andamento. |

### Requisitos Não Funcionais (RNF)

| ID | Descrição |
|----|-----------|
| RNF01 (Segurança) | Todo acesso ao banco de dados deve ser restrito através de políticas de Row Level Security (RLS) configuradas no Supabase. |
| RNF02 (Conformidade) | A aplicação deverá mascarar ou omitir o envio de dados pessoais restritos para as APIs de LLM externas, cumprindo as normativas da LGPD. |
| RNF03 (Conformidade) | O sistema deve manter trilhas de auditoria (Audit Logs) para todas as ações de leitura e escrita em dossiês e aprovações de IA. |
| RNF04 (Performance) | A interface do usuário deve possuir renderização rápida e adotar padrões limpos de Legal Design visando a redução de carga cognitiva do operador. |
| RNF05 (Escalabilidade) | A arquitetura de agentes de IA e a Evolution API devem operar em microsserviços/conteinerização (Docker) para gerenciar variações de carga e múltiplas instâncias sem perdas de sessão. |
| **RNF06 (Fuso Horário)** | **O sistema deve operar integralmente no fuso horário `America/Sao_Paulo` (UTC-3), independentemente da localização geográfica da VPS ou servidor. Todos os timestamps, cálculos de prazos processuais, agendamentos, cron jobs e exibições de data/hora devem respeitar esse fuso.** |
