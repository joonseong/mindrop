'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button, Txt } from '@repo/ui';

import { postJson } from '@/lib/client/ndjson';

export function AuthForm({ mode, next, reason }: { mode: 'signup' | 'login'; next?: string; reason?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const target = next && next.startsWith('/') ? next : '/today';

  return (
    <main className="flex flex-1 flex-col px-5 pb-8">
      <Txt name="display-1" as="h1" className="mt-4">
        {mode === 'signup' ? '학습 기록 저장하기' : '로그인'}
      </Txt>
      <Txt name="body-2" className="mt-2 text-txt-black-tertiary">
        {reason === 'course'
          ? '두 번째 코스부터는 가입이 필요해요. 가입하면 바로 이어서 만들어 드려요.'
          : mode === 'signup'
            ? '지금까지 읽은 코스와 진도가 그대로 저장돼요.'
            : '이 기기에서 읽은 기록도 계정으로 옮겨 드려요.'}
      </Txt>
      <form
        className="mt-8 flex flex-col gap-3"
        onSubmit={async e => {
          e.preventDefault();
          setBusy(true);
          setError('');
          const res = await postJson<{ error?: string }>(`/api/auth/${mode}`, { email, password });
          setBusy(false);
          if (!res.ok) {
            setError(res.data.error ?? '다시 시도해 주세요.');
            return;
          }
          router.replace(target);
          router.refresh();
        }}
      >
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="이메일"
          autoComplete="email"
          className="h-14 rounded-2xl border border-border-button px-4 outline-none focus:border-border-brand"
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder={mode === 'signup' ? '비밀번호 (8자 이상)' : '비밀번호'}
          autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
          className="h-14 rounded-2xl border border-border-button px-4 outline-none focus:border-border-brand"
        />
        {error ? (
          <Txt name="caption-1" className="text-txt-error">
            {error}
          </Txt>
        ) : null}
        <Button type="submit" variant="primary" size={56} className="mt-2" disabled={busy || !email || !password}>
          {mode === 'signup' ? '가입하기' : '로그인'}
        </Button>
      </form>
      <Link
        href={`/${mode === 'signup' ? 'login' : 'signup'}?next=${encodeURIComponent(target)}`}
        className="mt-6 text-center text-sm text-txt-black-tertiary underline"
      >
        {mode === 'signup' ? '이미 계정이 있어요' : '처음이에요, 가입할게요'}
      </Link>
    </main>
  );
}
