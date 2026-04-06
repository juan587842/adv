/**
 * Timezone utilities for Juris AI CRM
 * All dates in the system must be displayed in America/Sao_Paulo (BRT/BRST)
 * 
 * RNF06: O sistema deve operar inteiramente em fuso horário America/São_Paulo
 */

const TZ = 'America/Sao_Paulo';

/**
 * Formata uma data/string ISO para exibição no fuso de São Paulo.
 * @param date - Date object, ISO string or timestamp
 * @param options - Intl.DateTimeFormat options  (default: dia/mês/ano)
 */
export function formatDateBR(
  date: Date | string | number | null | undefined,
  options?: Intl.DateTimeFormatOptions
): string {
  if (!date) return '—';
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '—';

  const defaults: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: TZ,
  };

  return new Intl.DateTimeFormat('pt-BR', { ...defaults, ...options }).format(d);
}

/**
 * Formata data + hora no fuso de São Paulo.
 * Ex: "05/04/2026, 14:30"
 */
export function formatDateTimeBR(
  date: Date | string | number | null | undefined
): string {
  return formatDateBR(date, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: TZ,
  });
}

/**
 * Formata data longa (ex: "05 de abril de 2026").
 */
export function formatDateLongBR(
  date: Date | string | number | null | undefined
): string {
  return formatDateBR(date, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: TZ,
  });
}

/**
 * Formata data relativa (ex: "há 2 horas", "em 3 dias").
 * Usa Intl.RelativeTimeFormat quando disponível.
 */
export function formatRelativeTimeBR(
  date: Date | string | number | null | undefined
): string {
  if (!date) return '—';
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '—';

  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHour = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHour / 24);

  const rtf = new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' });

  if (Math.abs(diffSec) < 60) return rtf.format(diffSec, 'second');
  if (Math.abs(diffMin) < 60) return rtf.format(diffMin, 'minute');
  if (Math.abs(diffHour) < 24) return rtf.format(diffHour, 'hour');
  if (Math.abs(diffDay) < 30) return rtf.format(diffDay, 'day');

  // Fallback for older dates
  return formatDateBR(d);
}

/**
 * Retorna o horário atual em São Paulo como ISO string.
 * Útil para INSERT/UPDATE onde queremos gravar o momento "em BRT".
 * Na prática timestamps com timezone (timestamptz) no Postgres são sempre UTC,
 * então basta usar new Date().toISOString(). Esta função existe apenas para
 * clareza de intenção no código.
 */
export function nowBRT(): string {
  return new Date().toISOString();
}
