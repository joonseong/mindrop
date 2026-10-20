'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Txt } from '@repo/ui';

import { isNative, postNative, requestPushPermission } from '@/lib/client/bridge';
import { postJson } from '@/lib/client/ndjson';
import type { User } from '@/lib/types';

// 21시~08시는 고를 수 없다 (US-07)
const TIMES = Array.from({ length: 26 }, (_, i) => {
  const minutes = 8 * 60 + i * 30;
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
});

export function SettingsForm({
  notifyTime,
  permission,
  anon,
}: {
  notifyTime: string;
  permission: User['notifyPermission'];
  anon: boolean;
}) {
  const router = useRouter();
  const [time, setTime] = useState(notifyTime);
  const [saved, setSaved] = useState(false);

  return (
    <section>
      <Txt name="caption-1" className="text-txt-black-tertiary">
        알림
      </Txt>
      {permission !== 'granted' ? (
        <button
          className="mt-3 w-full rounded-2xl bg-shape-depth1 px-4 py-3 text-left"
          onClick={async () => {
            const { granted, token } = await requestPushPermission();
            if (granted) {
              await postJson('/api/me/notify', { permission: 'granted', pushToken: token });
              router.refresh();
            } else if (isNative()) postNative({ type: 'openSettings' });
          }}
        >
          <Txt name="title-2">알림이 꺼져 있어요</Txt>
          <Txt name="caption-1" className="text-txt-black-tertiary">
            눌러서 켜기
          </Txt>
        </button>
      ) : null}
      <label className="mt-4 flex items-center justify-between">
        <Txt name="body-1">다음 Drop 알림 시간</Txt>
        <select
          value={time}
          onChange={async e => {
            setTime(e.target.value);
            const res = await postJson('/api/me/notify', { notifyTime: e.target.value });
            setSaved(res.ok);
          }}
          className="h-10 rounded-xl border border-border-button bg-shape-white px-3 text-sm"
        >
          {TIMES.map(t => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>
      <Txt name="caption-1" className="mt-1 text-txt-black-tertiary">
        {saved ? '저장했어요. 다음 날부터 이 시간에 알려드려요.' : '하루 한 번, 오늘 Drop을 아직 안 읽었을 때만 보내요.'}
      </Txt>
      {!anon ? (
        <button
          className="mt-6 text-sm text-txt-black-tertiary underline"
          onClick={async () => {
            await postJson('/api/auth/logout');
            router.replace('/');
            router.refresh();
          }}
        >
          로그아웃
        </button>
      ) : null}
    </section>
  );
}
