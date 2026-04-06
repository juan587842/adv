/**
 * stripPII — LGPD PII Masking Utility for Deno Edge Functions
 *
 * RNF02: Conformidade com a Lei Geral de Proteção de Dados
 * Mascara dados pessoais sensíveis ANTES de enviar texto para LLMs.
 *
 * Usage:
 *   import { maskPII } from "./lgpd_mask.ts";
 *   const clean = maskPII(userText);
 */

const PII_PATTERNS: Array<{ name: string; regex: RegExp; replacer: (...args: string[]) => string }> = [
  // CPF: 000.000.000-00 ou 00000000000
  {
    name: 'CPF',
    regex: /\b(\d{3})[.\s]?(\d{3})[.\s]?(\d{3})[-.\s]?(\d{2})\b/g,
    replacer: () => `***.***. ***-**`,
  },
  // CNPJ: 00.000.000/0000-00
  {
    name: 'CNPJ',
    regex: /\b(\d{2})[.\s]?(\d{3})[.\s]?(\d{3})\/?(\d{4})[-.\s]?(\d{2})\b/g,
    replacer: () => '**.***.***/*****-**',
  },
  // Telefone com DDD: (00) 00000-0000 ou (00) 0000-0000
  {
    name: 'PHONE',
    regex: /\(?\b(\d{2})\)?[\s.-]?(\d{4,5})[\s.-]?(\d{4})\b/g,
    replacer: (_match: string, p1: string) => `(${p1}) *****-****`,
  },
  // Email
  {
    name: 'EMAIL',
    regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    replacer: () => '[email-mascarado]',
  },
  // CEP: 00000-000
  {
    name: 'CEP',
    regex: /\b(\d{5})[-.\s]?(\d{3})\b/g,
    replacer: () => '*****-***',
  },
];

export function stripPII(text: string): { cleaned: string; found: { type: string; count: number }[] } {
  let cleaned = text;
  const found: { type: string; count: number }[] = [];

  for (const pattern of PII_PATTERNS) {
    const matches = cleaned.match(pattern.regex);
    if (matches && matches.length > 0) {
      found.push({ type: pattern.name, count: matches.length });
      cleaned = cleaned.replace(pattern.regex, pattern.replacer as (...args: string[]) => string);
    }
  }

  return { cleaned, found };
}

export function maskPII(text: string): string {
  return stripPII(text).cleaned;
}
