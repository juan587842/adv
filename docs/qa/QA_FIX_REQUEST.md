# 🐛 QA FIX REQUEST: Navegação de IA Quebrada / Inacessível

**Criado por:** Quinn (QA Agent)
**Prioridade:** Alta (Bloqueador de Testes)
**Destinatário:** @dev (Dex)

## ❌ O Problema

Durante a tentativa de execução do **Teste 1 (Ferramentas Cognitivas)** descrito no `GUIA-DE-TESTES-IA.md`, o usuário notou que os botões/links indicados no guia **não existem** na interface acessível do sistema.

Após investigação da árvore de diretórios, constatei que a página existe fisicamente (`/dashboard/intelligence/tools/page.tsx`), mas **não há link de navegação** apontando para ela no menu lateral.

**Status atual da Sidebar:**
- O único item sob a seção "Inteligência" acessa a rota `/dashboard/ai` ("Agentes & Habilidades").
- O hub central (`/dashboard/intelligence`) e as ferramentas (`/dashboard/intelligence/tools`) sumiram da sidebar.

## 🛠️ Solução Solicitada (Action Items para o Dev)

Por favor, atualize o componente `src/components/SidebarNav.tsx` para restaurar a navegação corporativa do módulo de IA:

1. Localize o array `intelligenceLinks`.
2. Inclua as rotas corretas:

```tsx
const intelligenceLinks = [
  { href: "/dashboard/intelligence", icon: <BrainCircuit size={18} />, text: "Central de IA", exact: true },
  { href: "/dashboard/intelligence/tools", icon: <Sparkles size={18} />, text: "Ferramentas Cognitivas" },
  { href: "/dashboard/ai", icon: <Cpu size={18} />, text: "Skills & Macros" },
];
```
*(Importe os ícones do `lucide-react`)*

## ☑️ Critérios de Aceitação
- Menu lateral mostrando os 3 links de IA.
- Ao clicar em "Ferramentas Cognitivas", a página `/dashboard/intelligence/tools` deve renderizar sem crash.
