'use client';

import { postJson } from './ndjson';

export type TopicResult =
  | { status: 'ok'; topic: string; category: string; taskType: string }
  | { status: 'broad'; topic: string; suggestions: string[] }
  | { status: 'blocked'; message?: string; suggestions: string[] }
  | { status: 'error' };

/** 주제 검사: 코스로 만들 수 있는지, 너무 넓은지, 다루지 않는 주제인지 */
export async function checkTopic(input: string): Promise<TopicResult> {
  const res = await postJson<{
    status: 'ok' | 'broad' | 'blocked';
    topic: string;
    category: string;
    taskType: string;
    suggestions: string[];
    message?: string;
  }>('/api/topic/check', { input });
  if (!res.ok) return { status: 'error' };
  return res.data as TopicResult;
}

export function levelHref(r: { topic: string; category: string; taskType: string }, replace?: boolean) {
  const q = new URLSearchParams({ topic: r.topic, category: r.category, taskType: r.taskType });
  if (replace) q.set('replace', '1');
  return `/start/level?${q}`;
}
