'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { postJson } from '@/lib/client/ndjson';
import type { CourseCard } from '@/lib/views';

import { AppHeader, BottomNav, CHARACTER, IconCheck, IconClose, Main, PrimaryButton, Screen, cx } from '../ui';

type Props = {
  cards: CourseCard[];
  pickedId?: string;
  doneToday: { dropId: string; title: string; courseId: string } | null;
  tomorrow: CourseCard | null;
  weekDays: number;
  stage: { key: 'rabbit' | 'cat' };
  showNotifyBanner: boolean;
};

export function TodayScreen({ cards, pickedId, doneToday, tomorrow, weekDays, stage, showNotifyBanner }: Props) {
  const router = useRouter();
  const [picked, setPicked] = useState(pickedId ?? cards[0]?.id);
  const [banner, setBanner] = useState(showNotifyBanner);
  const [busy, setBusy] = useState(false);
  const cur = cards.find(c => c.id === picked);

  const read = async () => {
    if (!cur?.nextDropId || busy) return;
    setBusy(true);
    await postJson('/api/today/pick', { courseId: cur.id });
    router.push(`/drop/${cur.nextDropId}`);
  };

  return (
    <Screen>
      <AppHeader layout="logo" settings />
      <Main className="pb-8 pt-4">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-[28px] font-bold leading-9 tracking-[-1px]">오늘의 Drop</h1>
          <Link
            href="/map"
            data-badge
            className="flex flex-shrink-0 items-center gap-1 rounded-full bg-shape-depth1 py-1 pl-1 pr-3 text-[13px] font-semibold leading-5 text-txt-point"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={CHARACTER[stage.key].still} alt={`${CHARACTER[stage.key].name} 단계`} className="h-8 w-8 object-contain" />
            이번 주 {weekDays}일
          </Link>
        </div>

        {banner ? (
          <div className="mt-5 flex items-center justify-between gap-2 rounded-2xl bg-shape-depth1 py-3 pl-4 pr-1">
            <Link href="/settings" className="flex flex-col gap-0.5">
              <span className="text-sm font-bold">내일 Drop 알림을 받아 보세요</span>
              <span className="text-sm text-txt-black-tertiary">바쁜 날에도 잊지 않게 하루 한 번 알려드려요.</span>
            </Link>
            <button
              type="button"
              aria-label="알림 안내 닫기"
              className="flex h-11 w-11 flex-shrink-0 items-center justify-center"
              onClick={() => {
                setBanner(false);
                void postJson('/api/me/notify', { dismissBanner: true });
              }}
            >
              <IconClose size={20} color="#9FA0AA" />
            </button>
          </div>
        ) : null}

        {doneToday ? (
          <>
            <div className="mt-6 flex flex-col rounded-2xl border border-border-div p-5">
              <span className="flex items-center gap-1.5 text-base font-bold text-txt-black-secondary">
                <IconCheck />
                오늘 Drop 완료
              </span>
              <Link href={`/drop/${doneToday.dropId}`} className="mt-1 text-sm text-txt-black-tertiary underline">
                {doneToday.title} 다시 보기
              </Link>
            </div>
            {tomorrow ? (
              <div className="mt-3 flex flex-col gap-0.5 rounded-2xl bg-shape-depth1 p-5">
                <span className="text-sm font-semibold text-txt-black-tertiary">내일의 Drop · {tomorrow.topic}</span>
                <span className="text-lg font-bold">{tomorrow.nextTitle}</span>
                <span className="mt-1 text-sm text-txt-black-tertiary">내일 아침에 열려요. Drop은 하루 한 편이에요.</span>
              </div>
            ) : null}
          </>
        ) : cards.length ? (
          <>
            <p className="mt-2 text-base text-txt-black-secondary">오늘 받을 코스를 하나 골라 주세요.</p>
            <div role="radiogroup" aria-label="오늘 받을 코스" className="mt-5 flex flex-col gap-2">
              {cards.map(c => {
                const on = c.id === picked;
                return (
                  <button
                    key={c.id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setPicked(c.id)}
                    className={cx(
                      'mc-press flex w-full items-center gap-3 rounded-2xl border-2 p-4 text-left',
                      on ? 'border-border-brand bg-shape-depth1' : 'border-border-div bg-shape-white',
                    )}
                  >
                    <span
                      className="h-6 w-6 flex-shrink-0 rounded-full bg-shape-white"
                      style={{ border: on ? '7px solid #20967A' : '2px solid #DEDFEB' }}
                    />
                    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className="text-sm font-semibold text-txt-black-tertiary">
                        {c.topic} · Drop {c.done + 1} / {c.total}
                        {c.ready ? ' · 준비됨' : ''}
                      </span>
                      <span className="text-lg font-bold">{c.nextTitle}</span>
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-sm text-txt-black-tertiary">
              {cur?.ready ? 'Drop은 하루 한 편이에요. 어제 고른 코스는 미리 준비해 뒀어요.' : 'Drop은 하루 한 편이에요. 이 코스는 지금 만들어서 30초쯤 걸려요.'}
            </p>
            <PrimaryButton className="mt-6 flex-shrink-0" onClick={read}>
              {cur ? `${cur.topic} Drop 읽기` : 'Drop 읽기'}
            </PrimaryButton>
          </>
        ) : (
          <EmptyCard stage={stage.key} />
        )}

        <Link href="/start" className="mt-4 flex min-h-11 items-center self-center px-3 text-sm text-txt-black-tertiary underline">
          새 주제로 코스 만들기
        </Link>
      </Main>
      <BottomNav active="today" />
    </Screen>
  );
}

function EmptyCard({ stage }: { stage: 'rabbit' | 'cat' }) {
  return (
    <section className="mt-6 flex flex-col items-center rounded-2xl bg-shape-depth1 px-5 py-6 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={CHARACTER[stage].still} alt="" className="aspect-square w-[min(120px,32vw)] object-contain" />
      <h2 className="mt-3 text-lg font-bold">진행 중인 코스가 없어요</h2>
      <p className="mt-1 text-sm text-txt-black-secondary">요즘 궁금한 걸 코스로 만들어 볼까요?</p>
      <PrimaryButton href="/start" className="mt-5 !h-12 !text-sm">
        주제 입력하기
      </PrimaryButton>
    </section>
  );
}
