'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';

import { Button, Txt } from '@repo/ui';

import { TopBar } from '@/components/TopBar';
import { readNdjson } from '@/lib/client/ndjson';

type Ev =
  | { type: 'course'; courseId: string }
  | { type: 'title'; title: string }
  | { type: 'drop'; title: string; index: number }
  | { type: 'retry' }
  | { type: 'done'; courseId: string; firstDropId?: string }
  | { type: 'error'; message: string };

function Generating() {
  const router = useRouter();
  const params = useSearchParams();
  const regenerateId = params.get('regenerate');
  const [title, setTitle] = useState('');
  const [drops, setDrops] = useState<string[]>([]);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const started = useRef(-1);

  useEffect(() => {
    if (started.current === attempt) return;
    started.current = attempt;
    setTitle('');
    setDrops([]);
    setFailed(false);

    const run = async () => {
      const res = regenerateId
        ? await fetch(`/api/courses/${regenerateId}/regenerate`, { method: 'POST' })
        : await fetch('/api/courses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              topic: params.get('topic'),
              level: params.get('level'),
              category: params.get('category'),
              taskType: params.get('taskType'),
            }),
          });
      if (res.status === 403) {
        // 가입 전 생성은 기기당 1코스 → 가입 후 이 주제로 이어서 만든다 (US-01)
        router.replace(`/signup?reason=course&next=${encodeURIComponent(`/course/new?${params}`)}`);
        return;
      }
      if (!res.ok) {
        setFailed(true);
        return;
      }
      await readNdjson<Ev>(res, e => {
        if (e.type === 'title') setTitle(e.title);
        if (e.type === 'drop') setDrops(d => [...d, e.title]);
        if (e.type === 'retry') setDrops([]);
        if (e.type === 'error') setFailed(true);
        if (e.type === 'done' && e.firstDropId) router.replace(`/drop/${e.firstDropId}`);
      });
    };
    run().catch(() => setFailed(true));
  }, [attempt, params, regenerateId, router]);

  return (
    <>
      <TopBar close="/today" />
      <main className="flex flex-1 flex-col px-5 pb-8">
        <Txt name="caption-1" className="mt-2 text-txt-point">
          {failed ? '' : drops.length ? '코스를 만들고 있어요' : '커리큘럼을 짜고 있어요'}
        </Txt>
        <Txt name="display-1" as="h1" className="mt-1 min-h-8">
          {title || params.get('topic')}
        </Txt>

        <ol className="mt-6 flex flex-col gap-2">
          {drops.map((d, i) => (
            <li key={`${i}-${d}`} className="flex animate-fade-in items-start gap-3 rounded-2xl bg-shape-depth1 px-4 py-3">
              <Txt name="title-2" className="w-5 flex-shrink-0 text-txt-point">
                {i + 1}
              </Txt>
              <Txt name="body-2">{d}</Txt>
            </li>
          ))}
          {!failed ? (
            <li className="flex items-center gap-3 px-4 py-3">
              <span className="h-2 w-2 animate-pulse rounded-full bg-shape-brand" />
              <Txt name="body-2" className="text-txt-black-tertiary">
                {drops.length ? '다음 Drop을 고르는 중' : '주제를 정리하는 중'}
              </Txt>
            </li>
          ) : null}
        </ol>

        {failed ? (
          <div className="mt-auto flex flex-col gap-2">
            <Txt name="body-2" className="mb-2 text-center text-txt-black-secondary">
              코스를 만들지 못했어요.
            </Txt>
            <Button variant="primary" size={56} onClick={() => setAttempt(a => a + 1)}>
              다시 만들기
            </Button>
            <Button variant="secondary" size={56} onClick={() => router.replace('/start')}>
              다른 주제로 시작하기
            </Button>
          </div>
        ) : null}
      </main>
    </>
  );
}

export default function NewCoursePage() {
  return (
    <Suspense>
      <Generating />
    </Suspense>
  );
}
