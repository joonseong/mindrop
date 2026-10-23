'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { postJson } from '@/lib/client/ndjson';

import { AppHeader, Footer, IconCheck, Main, PrimaryButton, Progress, Screen } from '../ui';

type D = { id: string; index: number; title: string; done: boolean };

export function CourseScreen(props: {
  courseId: string;
  title: string;
  meta: string;
  drops: D[];
  nextId?: string;
  doneToday: boolean;
  isPicked: boolean;
  completed: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const done = props.drops.filter(d => d.done).length;
  const total = props.drops.length;

  const receive = async () => {
    if (!props.nextId || busy) return;
    setBusy(true);
    await postJson('/api/today/pick', { courseId: props.courseId });
    router.push(`/drop/${props.nextId}`);
  };

  return (
    <Screen>
      <AppHeader layout="nav" back />
      <Main className="pb-6 pt-4">
        <p className="text-sm font-semibold text-txt-black-tertiary">{props.meta}</p>
        <h1 className="mt-1 text-2xl font-bold tracking-[-1px]">{props.title}</h1>
        <div className="mt-4 flex items-center gap-3">
          <Progress value={done / Math.max(1, total)} />
          <span className="flex-shrink-0 text-sm font-semibold text-txt-black-secondary">
            {done} / {total} 완료
          </span>
        </div>
        <ol className="mt-8 flex flex-col gap-2">
          {props.drops.map(d => {
            const isNext = d.id === props.nextId;
            if (d.done || isNext) {
              const row = (
                <>
                  <span className="flex w-6 flex-shrink-0 justify-center text-sm font-bold text-txt-point">{d.done ? <IconCheck /> : d.index + 1}</span>
                  <span className={isNext ? 'flex-1 text-sm font-bold' : 'flex-1 text-sm'}>{d.title}</span>
                  {isNext ? <span className="flex-shrink-0 text-sm font-bold text-txt-point">{props.doneToday ? '내일' : '오늘'}</span> : null}
                </>
              );
              const cls = isNext
                ? 'flex min-h-14 items-center gap-3 rounded-2xl border-2 border-border-brand bg-shape-white p-4'
                : 'flex min-h-14 items-center gap-3 rounded-2xl bg-shape-depth1 p-4';
              return (
                <li key={d.id}>
                  {d.done ? (
                    <Link href={`/drop/${d.id}`} className={cls}>
                      {row}
                    </Link>
                  ) : (
                    <div className={cls}>{row}</div>
                  )}
                </li>
              );
            }
            return (
              <li key={d.id}>
                <div aria-disabled="true" className="flex min-h-14 items-center gap-3 rounded-2xl bg-shape-depth1 p-4">
                  <span className="w-6 flex-shrink-0 text-center text-sm font-bold text-txt-black-tertiary">{d.index + 1}</span>
                  <span className="flex-1 text-sm text-txt-black-tertiary">{d.title}</span>
                </div>
              </li>
            );
          })}
        </ol>
        <p className="mt-3 text-sm text-txt-black-tertiary">Drop은 하루 한 편, 오늘 화면에서 고른 코스로 받아요. 읽은 Drop은 언제든 다시 볼 수 있어요.</p>
      </Main>
      {!props.completed && props.nextId ? (
        <Footer>
          {props.doneToday ? (
            <PrimaryButton disabled>오늘 Drop은 다 읽었어요 · 내일 열려요</PrimaryButton>
          ) : (
            <PrimaryButton onClick={() => void receive()}>{props.isPicked ? '오늘의 Drop 읽기' : '오늘은 이 코스로 받기'}</PrimaryButton>
          )}
        </Footer>
      ) : null}
    </Screen>
  );
}
