'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Txt } from '@repo/ui';

import { isNative, postNative, requestPushPermission } from '@/lib/client/bridge';
import { postJson } from '@/lib/client/ndjson';

/** 알림 거절 후 재안내. 닫으면 7일간 숨긴다 (US-07) */
export function NotifyBanner() {
  const router = useRouter();
  const [hidden, setHidden] = useState(false);
  if (hidden) return null;
  return (
    <div className="mt-4 flex items-start justify-between gap-3 rounded-2xl bg-shape-depth1 px-4 py-3">
      <button
        className="text-left"
        onClick={async () => {
          const { granted, token } = await requestPushPermission();
          if (granted) {
            await postJson('/api/me/notify', { permission: 'granted', pushToken: token });
            setHidden(true);
            router.refresh();
          } else if (isNative()) {
            // OS에서 거절된 상태면 시스템 설정으로
            postNative({ type: 'openSettings' });
          }
        }}
      >
        <Txt name="title-2">내일 Drop 알림을 받아 보세요</Txt>
        <Txt name="caption-1" className="text-txt-black-tertiary">
          바쁜 날에도 잊지 않게 하루 한 번 알려드려요.
        </Txt>
      </button>
      <button
        aria-label="닫기"
        className="text-[13px] text-txt-black-tertiary"
        onClick={() => {
          setHidden(true);
          void postJson('/api/me/notify', { dismissBanner: true });
        }}
      >
        닫기
      </button>
    </div>
  );
}
