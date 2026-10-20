'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

import { Txt } from '@repo/ui';

import { TopBar } from '@/components/TopBar';
import { LEVEL_LABEL, type Level } from '@/lib/types';

const DESCRIPTION: Record<Level, string> = {
  beginner: '기본 개념부터 차근차근',
  some: '들어 본 적은 있어요',
  advanced: '입문은 건너뛰고 핵심으로',
};

function LevelSelect() {
  const router = useRouter();
  const params = useSearchParams();
  const topic = params.get('topic') ?? '';

  const choose = (level: Level) => {
    // Time to First Drop 측정 시작점: 수준 선택 완료 (PRD §19.2)
    sessionStorage.setItem('ttfd_start', String(Date.now()));
    const q = new URLSearchParams(params);
    q.set('level', level);
    router.push(`/course/new?${q}`);
  };

  return (
    <>
      <TopBar back />
      <main className="flex flex-1 flex-col px-5 pb-8">
        <Txt name="display-1" as="h1" className="mt-4">
          {topic}에 대해
          <br />
          어느 정도 알고 있나요?
        </Txt>
        <div className="mt-8 flex flex-col gap-3">
          {(Object.keys(LEVEL_LABEL) as Level[]).map(level => (
            <button
              key={level}
              onClick={() => choose(level)}
              className="flex flex-col items-start rounded-2xl border border-border-button bg-shape-white px-5 py-4 text-left transition-colors active:bg-shape-depth1"
            >
              <Txt name="title-1">{LEVEL_LABEL[level]}</Txt>
              <Txt name="body-2" className="mt-0.5 text-txt-black-tertiary">
                {DESCRIPTION[level]}
              </Txt>
            </button>
          ))}
        </div>
      </main>
    </>
  );
}

export default function LevelPage() {
  return (
    <Suspense>
      <LevelSelect />
    </Suspense>
  );
}
