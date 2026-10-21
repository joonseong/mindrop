'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { canAppleSignIn, nativeAppleSignIn } from '@/lib/client/bridge';
import { postJson } from '@/lib/client/ndjson';

import { cx } from './ui';

/**
 * 소셜 로그인 버튼. 카카오 → Google → Apple 순서.
 * 카카오·Google은 앱 키를 받은 뒤 켠다 (NEXT_PUBLIC_KAKAO_LOGIN / NEXT_PUBLIC_GOOGLE_LOGIN).
 * Apple은 iOS 앱에서만 보인다. 그 밖에는 이메일로 계속하기.
 */
export function SocialButtons({ height = 56, next, onDone }: { height?: 52 | 56; next: string; onDone: () => void }) {
  const [apple, setApple] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => setApple(canAppleSignIn()), []);
  const base = 'relative flex items-center justify-center rounded-xl text-base font-semibold';
  const kakao = process.env.NEXT_PUBLIC_KAKAO_LOGIN === 'true';
  const google = process.env.NEXT_PUBLIC_GOOGLE_LOGIN === 'true';

  const signInApple = async () => {
    setError('');
    const r = await nativeAppleSignIn();
    if (!r.identityToken) {
      if (r.error && r.error !== 'canceled') setError('Apple 로그인을 하지 못했어요. 다시 시도해 주세요.');
      return;
    }
    const res = await postJson('/api/auth/apple', { identityToken: r.identityToken });
    if (res.ok) onDone();
    else setError('Apple 로그인을 확인하지 못했어요.');
  };

  return (
    <div className="flex flex-col gap-2">
      {kakao ? (
        <a href={`/api/auth/kakao?next=${encodeURIComponent(next)}`} className={cx(base, 'bg-[#FEE500] text-[rgba(0,0,0,0.85)]')} style={{ height }}>
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" className="absolute left-5">
            <path d="M12 4C7.03 4 3 7.13 3 11c0 2.5 1.67 4.69 4.19 5.93l-.86 3.13c-.08.28.24.5.48.34l3.73-2.47c.48.05.97.07 1.46.07 4.97 0 9-3.13 9-7s-4.03-7-9-7z" fill="#000" />
          </svg>
          카카오로 시작하기
        </a>
      ) : null}
      {google ? (
        <a href={`/api/auth/google?next=${encodeURIComponent(next)}`} className={cx(base, 'border border-border-button bg-shape-white')} style={{ height }}>
          Google로 시작하기
        </a>
      ) : null}
      {apple ? (
        <button type="button" onClick={() => void signInApple()} className={cx(base, 'mc-press bg-[#000] text-txt-white-primary')} style={{ height }}>
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" className="absolute left-5">
            <path
              fill="#fff"
              d="M16.37 12.6c-.02-2.2 1.8-3.26 1.88-3.31-1.03-1.5-2.62-1.7-3.18-1.73-1.35-.14-2.64.8-3.33.8-.69 0-1.74-.78-2.86-.76-1.47.02-2.83.86-3.59 2.17-1.53 2.66-.39 6.6 1.1 8.76.73 1.06 1.6 2.24 2.73 2.2 1.1-.04 1.51-.71 2.84-.71 1.32 0 1.7.71 2.86.69 1.18-.02 1.93-1.07 2.65-2.13.84-1.22 1.18-2.41 1.2-2.47-.03-.01-2.3-.88-2.3-3.51zM14.2 6.13c.6-.73 1.01-1.75.9-2.76-.87.04-1.92.58-2.54 1.31-.56.65-1.05 1.68-.92 2.68.97.07 1.96-.49 2.56-1.23z"
            />
          </svg>
          Apple로 시작하기
        </button>
      ) : null}
      <Link
        href={`/login?mode=signup&next=${encodeURIComponent(next)}`}
        className={cx(base, 'mc-press border border-border-button bg-shape-white text-txt-black-primary')}
        style={{ height }}
      >
        이메일로 계속하기
      </Link>
      {error ? <p className="text-center text-sm text-txt-error">{error}</p> : null}
    </div>
  );
}
