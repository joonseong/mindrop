import { ClaudeGenerator } from './claude';
import { MockGenerator } from './mock';
import type { Generator } from './types';

const g = globalThis as unknown as { __minicoveryGenerator?: Generator };

/** ANTHROPIC_API_KEY가 있으면 실제 Claude, 없으면 가짜 응답 */
export function getGenerator(): Generator {
  if (!g.__minicoveryGenerator) {
    g.__minicoveryGenerator = process.env.ANTHROPIC_API_KEY ? new ClaudeGenerator() : new MockGenerator();
  }
  return g.__minicoveryGenerator;
}

export type * from './types';
