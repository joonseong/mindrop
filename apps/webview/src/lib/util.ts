import { randomUUID } from 'node:crypto';

export const newId = () => randomUUID();
export const nowIso = () => new Date().toISOString();

const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

/** KST 기준 날짜 'YYYY-MM-DD' (학습일 판정 기준, PRD §19.1) */
export function kstDate(iso: string | Date = new Date()): string {
  const t = typeof iso === 'string' ? new Date(iso).getTime() : iso.getTime();
  return new Date(t + KST_OFFSET_MS).toISOString().slice(0, 10);
}

/** KST 시각 'HH:mm' */
export function kstTime(iso: string | Date = new Date()): string {
  const t = typeof iso === 'string' ? new Date(iso).getTime() : iso.getTime();
  return new Date(t + KST_OFFSET_MS).toISOString().slice(11, 16);
}

export function daysBetween(fromIso: string, toIso: string): number {
  return Math.round((Date.parse(kstDate(toIso)) - Date.parse(kstDate(fromIso))) / 86_400_000);
}
