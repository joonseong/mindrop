'use client';

import { useState } from 'react';

import { postJson } from '@/lib/client/ndjson';
import type { ExplainAnswer } from '@/lib/types';

import { AppHeader, Badge, CHARACTER, Main, Screen, cx } from '../ui';

const ANSWERS: [ExplainAnswer, string][] = [
  ['yes', '예'],
  ['some', '조금'],
  ['not_yet', '아직'],
];

export function CourseDoneScreen(props: {
  courseId: string;
  learnedCount: number;
  stageKey: 'rabbit' | 'cat';
  next: { name: string; left: number; min: number } | null;
  related: string[];
  plus: boolean;
  first: boolean;
  answer: ExplainAnswer | null;
}) {
  const [answer, setAnswer] = useState(props.answer);
  const ch = CHARACTER[props.stageKey];
  const nextKey = props.stageKey === 'rabbit' ? 'cat' : null;

  return (
    <Screen>
      <AppHeader layout="nav" close="/today" />
      <Main className="pb-8 pt-2">
        <section className="flex flex-shrink-0 flex-col items-center rounded-2xl bg-shape-brand px-5 pb-7 pt-6 text-center text-txt-white-primary">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ch.full} alt={`기뻐하는 ${ch.name} 캐릭터`} className="mc-pop aspect-square w-[min(176px,44vw)] object-contain" />
          <h1 className="mt-3 text-[28px] font-bold leading-9 tracking-[-1px]">{props.first ? '첫 주제를 다 배웠어요!' : '주제를 하나 더 다 배웠어요!'}</h1>
          <p className="mt-2 text-base font-semibold">
            {props.next ? `주제 ${props.next.left}개를 더 배우면 ${props.next.name}로 성장해요.` : `다 배운 주제가 ${props.learnedCount}개가 됐어요.`}
          </p>
          {props.next && nextKey ? (
            <div className="mt-4 flex items-center gap-2 self-stretch">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-[rgba(255,255,255,0.3)]">
                <div className="h-full rounded-full bg-shape-white" style={{ width: `${Math.round((props.learnedCount / props.next.min) * 100)}%` }} />
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={CHARACTER[nextKey].still} alt={`다음 단계 ${props.next.name}`} className="h-8 w-8 flex-shrink-0 object-contain opacity-70 brightness-150 grayscale" />
            </div>
          ) : null}
        </section>

        <section className="mt-8 flex flex-col">
          <p className="text-base font-semibold">이제 이 주제를 남에게 대략 설명할 수 있나요?</p>
          <div role="radiogroup" aria-label="설명할 수 있는지" className="mt-3 grid grid-cols-3 gap-2">
            {ANSWERS.map(([v, label]) => {
              const on = answer === v;
              return (
                <button
                  key={v}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => {
                    setAnswer(v);
                    void postJson(`/api/courses/${props.courseId}/explain`, { answer: v });
                  }}
                  className={cx(
                    'h-12 rounded-full border text-sm',
                    on ? 'border-border-brand bg-shape-depth1 font-bold text-txt-point' : 'border-border-button bg-shape-white text-txt-black-primary',
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </section>

        {props.related.length ? (
          <section className="mt-10 flex flex-col gap-3">
            <h2 className="text-lg font-semibold">{props.plus ? '다음엔 이걸 알아볼까요?' : 'Plus로 이어서 배울 수 있어요'}</h2>
            <div className="flex flex-col gap-2">
              {props.related.map(r => (
                <a
                  key={r}
                  href={props.plus ? `/start?topic=${encodeURIComponent(r)}` : '/plus'}
                  className="mc-press flex items-center justify-between gap-3 rounded-2xl border border-border-button px-5 py-4"
                >
                  <span className="text-lg font-semibold">{r}</span>
                  {props.plus ? <span className="flex-shrink-0 text-sm font-bold text-txt-point">시작하기</span> : <Badge>Plus</Badge>}
                </a>
              ))}
            </div>
          </section>
        ) : null}
      </Main>
    </Screen>
  );
}
