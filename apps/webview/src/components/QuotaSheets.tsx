'use client';

import { PLUS_PRICE_LABEL } from '@/lib/constants';

import { PrimaryButton, Sheet, TextButton } from './ui';

/** 무료 사용자가 새 주제로 바꿀 때: 지금 코스는 삭제(학습 기록은 남음) + Plus 안내 */
export function ReplaceConfirm({ courseTopic, replaceHref, onClose }: { courseTopic?: string; replaceHref: string; onClose?: () => void }) {
  return (
    <>
      <h2 id="replaceTitle" className="mt-6 text-2xl font-bold tracking-[-1px]">
        지금 코스는 삭제돼요
      </h2>
      <p className="mt-1 text-base text-txt-black-secondary">
        무료는 코스를 1개만 둘 수 있어요. 새 주제로 바꾸면 {courseTopic ? `‘${courseTopic}’ ` : ''}코스와 읽은 Drop은 사라지지만, 내 학습 기록은
        남아요.
      </p>
      <div className="mt-5 flex flex-col gap-1 rounded-2xl bg-shape-depth1 px-5 py-4">
        <span className="text-sm font-bold text-txt-point">Plus · {PLUS_PRICE_LABEL}</span>
        <span className="text-lg font-bold">구독하고 여러 코스를 경험해 보세요</span>
        <span className="text-sm text-txt-black-secondary">지금 코스는 그대로 두고, 새 코스를 한 달에 3개까지 만들 수 있어요.</span>
      </div>
      <PrimaryButton href="/plus" className="mt-6">
        Plus로 코스 지키기
      </PrimaryButton>
      <TextButton href={replaceHref} className="mt-1" onClick={onClose}>
        삭제하고 새 주제로 바꾸기
      </TextButton>
    </>
  );
}

export function ReplaceSheet(props: { open: boolean; onClose: () => void; courseTopic?: string; replaceHref: string }) {
  return (
    <Sheet open={props.open} onClose={props.onClose} labelledBy="replaceTitle">
      <ReplaceConfirm courseTopic={props.courseTopic} replaceHref={props.replaceHref} onClose={props.onClose} />
    </Sheet>
  );
}

export function MonthlySheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Sheet open={open} onClose={onClose} labelledBy="monthlyTitle">
      <h2 id="monthlyTitle" className="mt-6 text-2xl font-bold tracking-[-1px]">
        이번 달 새 코스를 다 만들었어요
      </h2>
      <p className="mt-1 text-base text-txt-black-secondary">Plus는 새 코스를 한 달에 3개까지 만들 수 있어요. 다음 달 1일에 다시 만들 수 있어요.</p>
      <PrimaryButton className="mt-6" onClick={onClose}>
        확인
      </PrimaryButton>
    </Sheet>
  );
}
