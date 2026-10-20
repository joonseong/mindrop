import type { ModelTier } from '../types';

/** Claude API 정가 (USD / 1M tokens, 2026-10). PRD §29.1, cost-model/cost_model.py와 같은 값 */
export const MODEL_ID: Record<ModelTier, string> = {
  opus: 'claude-opus-5-5',
  sonnet: 'claude-sonnet-5-5',
  haiku: 'claude-haiku-5-5',
};

const PRICE: Record<ModelTier, { input: number; output: number; cacheRead: number; cacheWrite: number }> = {
  opus: { input: 4, output: 20, cacheRead: 0.2, cacheWrite: 5 },
  sonnet: { input: 2, output: 10, cacheRead: 0.2, cacheWrite: 2.5 },
  haiku: { input: 0.1, output: 0.5, cacheRead: 0.01, cacheWrite: 0.125 },
};

export const WEB_SEARCH_USD = 0.01;
export const USD_KRW = 1400;

export interface Usage {
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens: number;
  cacheWriteTokens: number;
  searches: number;
}

export function costUsd(model: ModelTier, u: Usage, batch = false): number {
  const p = PRICE[model];
  const tokens =
    (u.inputTokens * p.input + u.outputTokens * p.output + u.cacheReadTokens * p.cacheRead + u.cacheWriteTokens * p.cacheWrite) /
    1e6;
  return tokens * (batch ? 0.5 : 1) + u.searches * WEB_SEARCH_USD;
}
