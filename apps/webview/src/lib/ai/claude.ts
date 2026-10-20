import Anthropic from '@anthropic-ai/sdk';

import type { Source } from '../types';
import { MODEL_ID, type Usage } from './pricing';
import {
  CURRICULUM_SYSTEM,
  DROP_SYSTEM,
  TOPIC_CHECK_SCHEMA,
  TOPIC_CHECK_SYSTEM,
  VERIFY_SCHEMA,
  VERIFY_SYSTEM,
  curriculumSchema,
  curriculumUserPrompt,
  dropUserPrompt,
  verifyUserPrompt,
} from './prompts';
import type { BatchItem, BatchPoll, DropOutput, DropParams, Generator, Metered } from './types';

// 서버 도구 블록(web_search_tool_result 등)은 SDK 유니언이 넓어 필요한 필드만 any로 읽는다

const WEB_SEARCH_TOOL = {
  type: 'web_search_20260209' as const,
  name: 'web_search' as const,
  // PRD §29: Drop당 검색 1회
  max_uses: 1,
  user_location: { type: 'approximate' as const, country: 'KR', timezone: 'Asia/Seoul' },
};

function usageOf(message: Anthropic.Message): Usage {
  const u = message.usage as any;
  return {
    inputTokens: u.input_tokens ?? 0,
    outputTokens: u.output_tokens ?? 0,
    cacheReadTokens: u.cache_read_input_tokens ?? 0,
    cacheWriteTokens: u.cache_creation_input_tokens ?? 0,
    searches: u.server_tool_use?.web_search_requests ?? 0,
  };
}

function addUsage(a: Usage, b: Usage): Usage {
  return {
    inputTokens: a.inputTokens + b.inputTokens,
    outputTokens: a.outputTokens + b.outputTokens,
    cacheReadTokens: a.cacheReadTokens + b.cacheReadTokens,
    cacheWriteTokens: a.cacheWriteTokens + b.cacheWriteTokens,
    searches: a.searches + b.searches,
  };
}

const zero = (): Usage => ({ inputTokens: 0, outputTokens: 0, cacheReadTokens: 0, cacheWriteTokens: 0, searches: 0 });

function textOf(message: Anthropic.Message): string {
  return message.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map(b => b.text)
    .join('');
}

/** 출처는 웹 검색 결과로 받은 URL만 쓴다 (PRD §14.2). 인용된 URL을 먼저, 그다음 검색 결과 순 */
function collectSources(message: Anthropic.Message, into: { sources: Source[]; evidence: string[] }) {
  const cited: Source[] = [];
  const results: Source[] = [];
  for (const block of message.content as any[]) {
    if (block.type === 'web_search_tool_result' && Array.isArray(block.content)) {
      for (const r of block.content) if (r.url) results.push({ url: r.url, title: r.title ?? r.url });
    }
    if (block.type === 'text' && Array.isArray(block.citations)) {
      for (const c of block.citations) {
        if (c.url) cited.push({ url: c.url, title: c.title ?? c.url });
        if (c.cited_text) into.evidence.push(c.cited_text);
      }
    }
  }
  const seen = new Set(into.sources.map(s => s.url));
  for (const s of [...cited, ...results]) {
    if (!seen.has(s.url)) {
      seen.add(s.url);
      into.sources.push(s);
    }
  }
}

function dropRequest(params: DropParams, messages: Anthropic.MessageParam[]) {
  return {
    model: MODEL_ID[params.model],
    max_tokens: 8000,
    system: [{ type: 'text' as const, text: DROP_SYSTEM, cache_control: { type: 'ephemeral' as const } }],
    tools: [WEB_SEARCH_TOOL],
    output_config: { effort: 'medium' as const },
    messages,
  };
}

/** 스트리밍 중인 커리큘럼 JSON에서 완성된 Drop 제목만 꺼낸다 */
function completedStrings(json: string, key: string): string[] {
  const start = json.indexOf(`"${key}"`);
  if (start < 0) return [];
  const open = json.indexOf('[', start);
  if (open < 0) return [];
  const close = json.indexOf(']', open);
  const segment = json.slice(open + 1, close < 0 ? undefined : close);
  return [...segment.matchAll(/"((?:[^"\\]|\\.)*)"/g)].map(m => JSON.parse(`"${m[1]}"`));
}

export class ClaudeGenerator implements Generator {
  readonly name = 'claude' as const;
  private client = new Anthropic();

  async checkTopic(input: string) {
    const message = await this.client.messages.create({
      model: MODEL_ID.haiku,
      max_tokens: 1024,
      system: TOPIC_CHECK_SYSTEM,
      output_config: { format: { type: 'json_schema', schema: TOPIC_CHECK_SCHEMA } },
      messages: [{ role: 'user', content: input.slice(0, 200) }],
    });
    const usage = usageOf(message);
    if (message.stop_reason === 'refusal') {
      return {
        model: 'haiku' as const,
        usage,
        result: {
          status: 'blocked' as const,
          topic: input,
          category: '라이프스타일',
          taskType: 'hobby' as const,
          suggestions: [],
          message: '이 주제는 미니커버리에서 다루지 않아요.',
        },
      };
    }
    const r = JSON.parse(textOf(message));
    return {
      model: 'haiku' as const,
      usage,
      result: {
        status: r.status,
        topic: r.topic,
        category: r.category,
        taskType: r.task_type,
        suggestions: r.suggestions,
        message: r.message || undefined,
      },
    };
  }

  async curriculum(params: Parameters<Generator['curriculum']>[0], on: Parameters<Generator['curriculum']>[1]) {
    const range = params.isFirstCourse ? { min: 5, max: 7 } : { min: 5, max: 14 };
    const stream = this.client.messages.stream({
      model: MODEL_ID.opus,
      max_tokens: 4000,
      system: [{ type: 'text', text: CURRICULUM_SYSTEM, cache_control: { type: 'ephemeral' } }],
      output_config: { effort: 'low', format: { type: 'json_schema', schema: curriculumSchema(range) } },
      messages: [{ role: 'user', content: curriculumUserPrompt(params) }],
    });

    let json = '';
    let titleSent = false;
    let dropsSent = 0;
    for await (const event of stream) {
      if (event.type !== 'content_block_delta' || event.delta.type !== 'text_delta') continue;
      json += event.delta.text;
      if (!titleSent) {
        const m = json.match(/"course_title"\s*:\s*"((?:[^"\\]|\\.)*)"/);
        if (m) {
          titleSent = true;
          on.title?.(JSON.parse(`"${m[1]}"`));
        }
      }
      const titles = completedStrings(json, 'drop_titles');
      while (dropsSent < titles.length) {
        on.drop?.(titles[dropsSent]!, dropsSent);
        dropsSent++;
      }
    }
    const message = await stream.finalMessage();
    if (message.stop_reason === 'refusal') throw new Error('refusal');
    const r = JSON.parse(textOf(message));
    return {
      model: 'opus' as const,
      usage: usageOf(message),
      result: { title: r.course_title, drops: r.drop_titles, related: r.related_topics },
    };
  }

  async drop(params: DropParams, on: Parameters<Generator['drop']>[1]): Promise<Metered<DropOutput>> {
    const messages: Anthropic.MessageParam[] = [{ role: 'user', content: dropUserPrompt(params) }];
    const out = { text: '', sources: [] as Source[], evidence: [] as string[], refused: false };
    let usage = zero();

    // 서버 도구가 오래 걸리면 pause_turn으로 멈출 수 있어 이어서 요청한다
    for (let turn = 0; turn < 4; turn++) {
      const stream = this.client.messages.stream(dropRequest(params, messages));
      for await (const event of stream) {
        if (event.type === 'content_block_start' && (event.content_block as any).type === 'server_tool_use') {
          on.status?.('자료를 찾고 있어요');
        }
        if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
          out.text += event.delta.text;
          on.text?.(event.delta.text);
        }
      }
      const message = await stream.finalMessage();
      usage = addUsage(usage, usageOf(message));
      collectSources(message, out);
      if (message.stop_reason === 'refusal') {
        out.refused = true;
        break;
      }
      if (message.stop_reason !== 'pause_turn') break;
      messages.push({ role: 'assistant', content: message.content });
    }
    return { model: params.model, usage, result: out };
  }

  async verify(text: string, evidence: string[]) {
    const message = await this.client.messages.create({
      model: MODEL_ID.haiku,
      max_tokens: 4000,
      system: VERIFY_SYSTEM,
      output_config: { format: { type: 'json_schema', schema: VERIFY_SCHEMA } },
      messages: [{ role: 'user', content: verifyUserPrompt({ text, evidence }) }],
    });
    const r = JSON.parse(textOf(message));
    return {
      model: 'haiku' as const,
      usage: usageOf(message),
      result: { verdict: r.verdict, fixedText: r.fixed_text },
    };
  }

  async submitBatch(items: BatchItem[]) {
    const batch = await this.client.messages.batches.create({
      requests: items.map(item => ({
        custom_id: item.customId,
        params: dropRequest(item.params, [{ role: 'user', content: dropUserPrompt(item.params) }]),
      })),
    });
    return batch.id;
  }

  async pollBatch(batchId: string): Promise<BatchPoll> {
    const batch = await this.client.messages.batches.retrieve(batchId);
    if (batch.processing_status !== 'ended') return { status: 'processing' };
    const results: { customId: string; output?: Metered<DropOutput>; error?: string }[] = [];
    for await (const r of await this.client.messages.batches.results(batchId)) {
      if (r.result.type !== 'succeeded') {
        results.push({ customId: r.custom_id, error: r.result.type });
        continue;
      }
      const message = r.result.message;
      if (message.stop_reason === 'pause_turn' || message.stop_reason === 'refusal') {
        results.push({ customId: r.custom_id, error: message.stop_reason });
        continue;
      }
      const out = { text: textOf(message), sources: [] as Source[], evidence: [] as string[], refused: false };
      collectSources(message, out);
      // 모델 종류는 호출하는 쪽이 아는 값으로 덮어쓴다
      results.push({ customId: r.custom_id, output: { model: 'opus', usage: usageOf(message), result: out } });
    }
    return { status: 'ended', results };
  }
}
