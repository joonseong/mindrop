'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { Button, Chip, Txt } from '@repo/ui';

import { SUGGESTED_TOPICS } from '@/lib/constants';
import { postJson } from '@/lib/client/ndjson';

import { Wordmark } from './Wordmark';

interface Check {
  status: 'ok' | 'broad' | 'blocked';
  topic: string;
  category: string;
  taskType: string;
  suggestions: string[];
  message?: string;
}

export function CuriosityInput({ initialTopic }: { initialTopic?: string }) {
  const router = useRouter();
  const [input, setInput] = useState(initialTopic ?? '');
  const autoSubmitted = useRef(false);
  const [loading, setLoading] = useState(false);
  const [check, setCheck] = useState<Check | null>(null);
  const [error, setError] = useState('');

  const goLevel = (c: Pick<Check, 'topic' | 'category' | 'taskType'>) => {
    const q = new URLSearchParams({ topic: c.topic, category: c.category, taskType: c.taskType });
    router.push(`/start/level?${q}`);
  };

  const submit = async (value: string) => {
    const text = value.trim();
    if (!text || loading) return;
    setLoading(true);
    setError('');
    setCheck(null);
    const res = await postJson<Check>('/api/topic/check', { input: text });
    setLoading(false);
    if (!res.ok) {
      setError('잠시 후 다시 시도해 주세요.');
      return;
    }
    if (res.data.status === 'ok') goLevel(res.data);
    else setCheck(res.data);
  };

  useEffect(() => {
    if (initialTopic && !autoSubmitted.current) {
      autoSubmitted.current = true;
      void submit(initialTopic);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTopic]);

  return (
    <main className="flex flex-1 flex-col px-5 pb-8 pt-[calc(env(safe-area-inset-top)+20px)]">
      <Wordmark />
      <div className="mt-14">
        <Txt name="display-1" as="h1">
          요즘 뭐가 궁금하세요?
        </Txt>
        <Txt name="body-2" className="mt-2 text-txt-black-tertiary">
          입력한 주제를 하루 3분짜리 코스로 만들어 드려요.
        </Txt>
      </div>

      <form
        className="mt-8"
        onSubmit={e => {
          e.preventDefault();
          void submit(input);
        }}
      >
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          maxLength={100}
          placeholder="예: 금리가 오르면 환율은 왜 움직일까"
          className="h-14 w-full rounded-2xl border border-border-button bg-shape-white px-4 text-base outline-none placeholder:text-txt-black-placeholder focus:border-border-brand"
          autoFocus
        />
        <Button type="submit" variant="primary" size={56} className="mt-3" disabled={!input.trim() || loading}>
          {loading ? '주제를 살펴보는 중…' : '코스 만들기'}
        </Button>
      </form>

      {error ? (
        <Txt name="body-2" className="mt-3 text-txt-error">
          {error}
        </Txt>
      ) : null}

      {check?.status === 'broad' ? (
        <section className="mt-8 animate-fade-in">
          <Txt name="title-2">조금 좁혀 볼까요? 이 중에서 골라 주세요.</Txt>
          <div className="mt-3 flex flex-wrap gap-2">
            {check.suggestions.map(s => (
              <Chip key={s} onClick={() => goLevel({ ...check, topic: s })}>
                {s}
              </Chip>
            ))}
          </div>
        </section>
      ) : null}

      {check?.status === 'blocked' ? (
        <section className="mt-8 animate-fade-in rounded-2xl bg-shape-depth1 p-4">
          <Txt name="body-2" className="text-txt-black-secondary">
            {check.message ?? '이 주제는 미니커버리에서 다루지 않아요.'}
          </Txt>
          <div className="mt-3 flex flex-wrap gap-2">
            {check.suggestions.map(s => (
              <Chip key={s} className="bg-shape-white" onClick={() => void submit(s)}>
                {s}
              </Chip>
            ))}
          </div>
        </section>
      ) : null}

      {!check ? (
        <section className="mt-10">
          <Txt name="caption-1" className="text-txt-black-tertiary">
            이런 주제는 어때요?
          </Txt>
          <div className="mt-3 flex flex-wrap gap-2">
            {SUGGESTED_TOPICS.map(s => (
              <Chip
                key={s}
                onClick={() => {
                  setInput(s);
                  void submit(s);
                }}
              >
                {s}
              </Chip>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
