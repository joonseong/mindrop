'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { requestPushPermission } from '@/lib/client/bridge';
import { postJson } from '@/lib/client/ndjson';

import { SocialButtons } from './Social';
import { PrimaryButton, Sheet, TextButton } from './ui';

export interface CompleteResult {
  firstEver: boolean;
  courseCompleted: boolean;
  courseId: string;
  levelUp: boolean;
  askNotify: boolean;
  askSignup: boolean;
}

/** 완료 뒤 어디로 갈지: 단계 상승 → 코스 완료 → 오늘의 Drop 완료 */
export function afterCompleteHref(r: CompleteResult, dropId: string) {
  const done = r.courseCompleted ? `/course/${r.courseId}/done` : `/drop/${dropId}/done`;
  return r.levelUp ? `/levelup?next=${encodeURIComponent(done)}` : done;
}

/**
 * Drop을 다 읽은 뒤 순서대로: 알림 권한 안내(첫 Drop) → 가입 안내(첫 Drop, 임시 계정) → 완료 화면.
 * 팝업이 연달아 뜨지 않게 각각 한 번만 묻는다.
 */
export function AfterComplete({ result, dropId }: { result: CompleteResult | null; dropId: string }) {
  const router = useRouter();
  const [step, setStep] = useState<'notify' | 'signup' | 'go' | null>(null);
  const next = result ? afterCompleteHref(result, dropId) : '/today';

  useEffect(() => {
    if (!result) return;
    setStep(result.askNotify ? 'notify' : result.askSignup ? 'signup' : 'go');
  }, [result]);

  useEffect(() => {
    if (step === 'go') router.replace(next);
  }, [step, next, router]);

  const afterNotify = () => setStep(result?.askSignup ? 'signup' : 'go');

  return (
    <>
      <Sheet open={step === 'notify'} labelledBy="notifyTitle">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/bell.png" alt="" className="mt-6 h-16 w-16 object-contain" />
        <h2 id="notifyTitle" className="mt-4 text-2xl font-bold tracking-[-1px]">
          내일 다음 Drop이 도착하면
          <br />
          알려드릴까요?
        </h2>
        <p className="mt-2 text-base text-txt-black-secondary">하루 한 번, 오늘 읽은 시간쯤 알려드려요.</p>
        <p className="mt-1 text-sm text-txt-black-tertiary">밤 9시부터 아침 8시까지는 보내지 않아요.</p>
        <div className="mt-8 flex flex-col gap-2 pb-2">
          <PrimaryButton
            onClick={async () => {
              const r = await requestPushPermission();
              await postJson('/api/me/notify', { permission: r.granted ? 'granted' : 'denied', pushToken: r.token });
              afterNotify();
            }}
          >
            알림 받기
          </PrimaryButton>
          <TextButton onClick={afterNotify}>나중에</TextButton>
        </div>
      </Sheet>

      <Sheet open={step === 'signup'} labelledBy="signupTitle">
        <div className="mt-6 flex flex-col gap-1 text-center">
          <p className="text-sm font-semibold text-txt-black-tertiary">첫 Drop을 읽었어요</p>
          <h2 id="signupTitle" className="text-2xl font-bold tracking-[-1px]">
            학습 기록을 저장할까요?
          </h2>
        </div>
        <p className="mt-3 text-center text-base text-txt-black-secondary">
          가입하면 진도와 내 학습 기록이 저장되고,
          <br />
          다른 기기에서도 이어서 읽을 수 있어요.
        </p>
        <div className="mt-6 flex flex-col gap-2 pb-2">
          <SocialButtons height={52} next={next} onDone={() => setStep('go')} />
          <TextButton onClick={() => setStep('go')}>나중에</TextButton>
        </div>
      </Sheet>
    </>
  );
}
