'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { PLUS_PRICE_LABEL } from '@/lib/constants';
import { postJson } from '@/lib/client/ndjson';

import { AppHeader, CHARACTER, Footer, IconCheck, Main, PrimaryButton, Screen } from '../ui';

const BENEFITS = [
  { title: '새 코스 한 달 3개', desc: '궁금한 주제가 생기면 바로 코스로 만들어요.' },
  { title: '매일 코스를 골라 받기', desc: '진행 중인 코스 중 오늘 읽을 하나를 골라요.' },
  { title: '읽은 Drop 다시 보기', desc: '지난 Drop은 언제든 다시 열 수 있어요.' },
  { title: '한 달 학습 리포트', desc: '이번 달 배운 내용을 한눈에 정리해 드려요.' },
];

export function PaywallScreen({ stageKey, plus, beta }: { stageKey: 'rabbit' | 'cat'; plus: boolean; beta: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const ch = CHARACTER[stageKey];

  const start = async () => {
    if (busy) return;
    setBusy(true);
    const res = await postJson('/api/me/plus');
    setBusy(false);
    if (res.ok) router.replace('/start');
    else setMessage('결제는 정식 출시 때 열려요. 조금만 기다려 주세요.');
  };

  return (
    <Screen>
      <AppHeader layout="nav" close="/today" />
      <Main className="pb-6 pt-2">
        <section className="flex flex-col items-center text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ch.face} alt={`${ch.name} 등급 캐릭터`} className="h-[72px] w-[72px] object-contain" />
          <p className="mt-3 text-sm font-bold text-txt-point">{plus ? '지금 Plus를 쓰고 있어요' : '무료 코스 1개를 다 썼어요'}</p>
          <h1 className="mt-1 text-[28px] font-bold leading-9 tracking-[-1px]">
            다음 주제도
            <br />
            계속 배워 볼까요?
          </h1>
        </section>
        <ul className="mt-8 flex flex-col gap-5">
          {BENEFITS.map(b => (
            <li key={b.title} className="flex items-start gap-3">
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-shape-depth1">
                <IconCheck />
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="text-base font-semibold">{b.title}</span>
                <span className="text-sm text-txt-black-tertiary">{b.desc}</span>
              </span>
            </li>
          ))}
        </ul>
        {beta && !plus ? <p className="mt-6 text-center text-sm text-txt-black-tertiary">베타 기간에는 결제 없이 Plus를 써 볼 수 있어요.</p> : null}
        {message ? <p className="mt-4 text-center text-sm text-txt-black-secondary">{message}</p> : null}
      </Main>
      <Footer className="gap-3">
        <div className="flex items-center justify-between gap-3 rounded-2xl border-2 border-border-brand bg-shape-depth1 px-5 py-4">
          <span className="flex flex-col gap-0.5">
            <span className="text-base font-semibold">미니커버리 Plus</span>
            <span className="text-sm text-txt-black-tertiary">매달 자동 갱신</span>
          </span>
          <span className="text-lg font-semibold">{PLUS_PRICE_LABEL}</span>
        </div>
        {plus ? (
          <PrimaryButton href="/start" replace>
            새 코스 만들기
          </PrimaryButton>
        ) : (
          <PrimaryButton onClick={() => void start()}>{busy ? '처리하는 중…' : 'Plus 시작하기'}</PrimaryButton>
        )}
        <p className="text-center text-sm text-txt-black-tertiary">
          언제든 해지할 수 있어요 ·{' '}
          <button type="button" className="underline" onClick={() => setMessage('복원할 구매 내역이 없어요.')}>
            구매 복원
          </button>{' '}
          ·{' '}
          <Link href="/terms" className="underline">
            이용약관
          </Link>
        </p>
      </Footer>
    </Screen>
  );
}
