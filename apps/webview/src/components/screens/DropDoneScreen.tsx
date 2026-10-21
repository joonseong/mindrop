'use client';

import { useState } from 'react';

import { postJson } from '@/lib/client/ndjson';
import { josa } from '@/lib/josa';

import { ReplaceConfirm } from '../QuotaSheets';
import { CHARACTER, Footer, IconPlus, IconSwap, Main, PrimaryButton, Progress, Screen, Sheet, AppHeader, cx } from '../ui';

type C = { id: string; topic: string; index: number; total: number; title: string };
const LABELS = ['월', '화', '수', '목', '금', '토', '일'];

export function DropDoneScreen(props: {
  courseTitle: string;
  dropTitle: string;
  week: boolean[];
  courses: C[];
  tomorrowId?: string;
  plus: boolean;
  currentTopic: string;
}) {
  const [tomorrow, setTomorrow] = useState(props.tomorrowId);
  const [draft, setDraft] = useState(props.tomorrowId);
  const [sheet, setSheet] = useState<null | 'list' | 'confirm'>(null);
  const cur = props.courses.find(c => c.id === tomorrow);
  const days = props.week.filter(Boolean).length;

  const save = async () => {
    if (draft && draft !== tomorrow) {
      setTomorrow(draft);
      await postJson('/api/tomorrow/pick', { courseId: draft });
    }
    setSheet(null);
  };

  return (
    <Screen className="relative">
      <AppHeader layout="nav" close="/today" />
      <Main className="pb-6 pt-2">
        <section className="flex flex-col items-center text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={CHARACTER.rabbit.full} alt="기뻐하는 토끼 캐릭터" className="mc-pop aspect-square w-[min(160px,40vw)] object-contain" />
          <h1 className="mt-4 text-[28px] font-bold leading-9 tracking-[-1px]">오늘의 Drop 완료!</h1>
          <p className="mt-2 text-base text-txt-black-secondary">
            <b>{props.courseTitle}</b>
            {josa(props.courseTitle, '을/를').slice(props.courseTitle.length)} 통해
            <br />‘{props.dropTitle}’{josa(props.dropTitle.replace(/[?？!.]$/, ''), '을/를').slice(-1)} 알게 됐어요.
          </p>
        </section>

        <section className="mt-8 flex flex-col gap-5 rounded-2xl bg-shape-depth1 p-5">
          <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-sm font-bold text-txt-black-secondary">이번 주 학습 {days}일</p>
              <p className="flex-shrink-0 text-sm font-semibold text-txt-point">{days} / 7</p>
            </div>
            <div className="flex">
              <Progress value={days / 7} />
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {LABELS.map((l, i) => (
              <div key={l} className="flex flex-col items-center gap-1">
                {props.week[i] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src="/img/check.png" alt="학습함" className="-m-px h-[30px] w-[30px] object-contain" />
                ) : (
                  <span className="h-7 w-7 rounded-full border border-border-button bg-shape-white" />
                )}
                <span className="text-sm text-txt-black-tertiary">{l}</span>
              </div>
            ))}
          </div>
        </section>

        {cur ? (
          <section className="mt-3 flex items-center gap-2 rounded-2xl border border-border-div py-4 pl-5 pr-1">
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="text-sm font-semibold text-txt-black-tertiary">내일의 Drop · {cur.topic}</span>
              <span className="text-lg font-bold">{cur.title}</span>
            </span>
            <button
              type="button"
              aria-label="내일 받을 코스 바꾸기"
              onClick={() => {
                setDraft(tomorrow);
                setSheet('list');
              }}
              className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full"
            >
              <IconSwap />
            </button>
          </section>
        ) : null}
      </Main>
      <Footer>
        <PrimaryButton href="/today" replace>
          오늘 학습 마치기
        </PrimaryButton>
      </Footer>

      <Sheet open={sheet !== null} onClose={() => setSheet(null)} labelledBy={sheet === 'confirm' ? 'replaceTitle' : 'tomorrowTitle'}>
        {sheet === 'confirm' ? (
          <ReplaceConfirm courseTopic={props.currentTopic} replaceHref="/start?replace=1" onClose={() => setSheet(null)} />
        ) : (
          <>
            <h2 id="tomorrowTitle" className="mt-6 text-2xl font-bold tracking-[-1px]">
              내일 받을 코스
            </h2>
            <p className="mt-1 text-base text-txt-black-secondary">지금 코스로 이어 가거나, 새 주제로 바꿀 수 있어요.</p>
            <div role="radiogroup" aria-label="내일 받을 코스" className="mt-5 flex flex-col gap-2">
              {props.courses.map(c => {
                const on = c.id === draft;
                return (
                  <button
                    key={c.id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setDraft(c.id)}
                    className={cx('flex w-full items-center gap-3 rounded-2xl border-2 p-4 text-left', on ? 'border-border-brand bg-shape-depth1' : 'border-border-div bg-shape-white')}
                  >
                    <span className="h-6 w-6 flex-shrink-0 rounded-full bg-shape-white" style={{ border: on ? '7px solid #20967A' : '2px solid #DEDFEB' }} />
                    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className="text-sm font-semibold text-txt-black-tertiary">
                        {c.topic} · Drop {c.index + 1} / {c.total}
                      </span>
                      <span className="text-lg font-bold">{c.title}</span>
                    </span>
                  </button>
                );
              })}
              {props.plus ? (
                <a href="/start" className="flex w-full items-center gap-3 rounded-2xl border border-dashed border-border-button bg-shape-white p-4">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center">
                    <IconPlus color="#18715B" />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="text-lg font-bold text-txt-point">새 주제로 바꾸기</span>
                    <span className="text-sm text-txt-black-tertiary">지금 코스는 프로필에 남아서 언제든 이어 볼 수 있어요.</span>
                  </span>
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => setSheet('confirm')}
                  className="flex w-full items-center gap-3 rounded-2xl border border-dashed border-border-button bg-shape-white p-4 text-left"
                >
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center">
                    <IconPlus color="#18715B" />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="text-lg font-bold text-txt-point">새 주제로 바꾸기</span>
                    <span className="text-sm text-txt-black-tertiary">무료는 코스 1개라 지금 코스 대신 새 코스를 만들어요.</span>
                  </span>
                </button>
              )}
            </div>
            <PrimaryButton className="mt-6" onClick={() => void save()}>
              이 코스로 받기
            </PrimaryButton>
          </>
        )}
      </Sheet>
    </Screen>
  );
}
