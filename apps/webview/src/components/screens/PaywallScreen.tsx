'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { PLUS_PRICE_LABEL } from '@/lib/constants';
import { postJson } from '@/lib/client/ndjson';

import { AppHeader, CHARACTER, Footer, IconCheck, Main, PrimaryButton, Screen, TextButton } from '../ui';

const BENEFITS = ['새 코스를 한 달에 3개까지 만들기', '매일 원하는 코스를 골라 Drop 받기', '이미 읽은 Drop은 언제든 다시 보기', '한 달 동안 배운 내용 정리 리포트'];

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
      <AppHeader layout="nav" back />
      <Main className="pb-6 pt-2">
        <section className="flex flex-col items-center gap-4 text-center">
          <div className="flex flex-col items-center gap-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ch.face} alt={`${ch.name} 등급 캐릭터`} className="h-16 w-[min(120px,32vw)] object-contain" />
            <p className="mt-2 text-sm font-bold text-txt-point">{plus ? '지금 Plus를 쓰고 있어요' : '무료 코스 1개를 다 썼어요'}</p>
          </div>
          <div className="flex flex-col items-center">
            <h1 className="mt-1 text-[28px] font-bold leading-9 tracking-[-1px]">
              다음 주제도
              <br />
              계속 배워 볼까요?
            </h1>
            <p className="mt-2 text-base text-txt-black-secondary">
              무료로는 코스를 1개까지 만들 수 있어요.
              <br />
              Plus는 한 달에 3개까지 새 코스를 만들 수 있어요.
            </p>
          </div>
        </section>

        <section className="mt-8 flex flex-col gap-4 rounded-2xl border-2 border-border-brand p-5">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-lg font-bold">미니커버리 Plus</span>
            <span className="text-2xl font-bold tracking-[-1px]">{PLUS_PRICE_LABEL}</span>
          </div>
          <ul className="flex flex-col gap-1">
            {BENEFITS.map(b => (
              <li key={b} className="flex items-start gap-2 text-base">
                <span className="mt-0.5 flex-shrink-0">
                  <IconCheck />
                </span>
                {b}
              </li>
            ))}
          </ul>
        </section>
        {beta && !plus ? <p className="mt-4 text-center text-sm text-txt-black-tertiary">베타 기간에는 결제 없이 Plus를 써 볼 수 있어요.</p> : null}
        {message ? <p className="mt-4 text-center text-sm text-txt-black-secondary">{message}</p> : null}
      </Main>
      <Footer>
        {plus ? (
          <PrimaryButton href="/start" replace>
            새 코스 만들기
          </PrimaryButton>
        ) : (
          <PrimaryButton onClick={() => void start()}>{busy ? '처리하는 중…' : `${PLUS_PRICE_LABEL}으로 시작하기`}</PrimaryButton>
        )}
        <TextButton href="/today" replace>
          나중에
        </TextButton>
      </Footer>
    </Screen>
  );
}
