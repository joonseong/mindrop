import { cookies } from 'next/headers';

import { getStore } from './store';
import type { User } from './types';
import { newId, nowIso } from './util';

export const UID_COOKIE = 'mc_uid';

/**
 * 가입 전에는 기기 임시 계정(쿠키)으로 학습 기록을 저장한다 (PRD §17.1).
 * 앱 껍데기의 웹뷰도 같은 쿠키를 쓴다.
 */
export async function currentUser(): Promise<User> {
  const store = getStore();
  const jar = cookies();
  // 쿠키는 middleware가 첫 방문에 심는다. 저장소에 기록이 없으면 그 id로 만든다
  const id = jar.get(UID_COOKIE)?.value ?? newId();
  const existing = await store.getUser(id);
  if (existing) return existing;
  const user: User = { id, anon: true, createdAt: nowIso(), notifyPermission: 'unknown' };
  await store.saveUser(user);
  return user;
}

export const UID_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 60 * 60 * 24 * 365 * 2,
  path: '/',
};

/** 가입·로그인 시 계정 id로 바꾼다 (route handler에서만 호출) */
export function setUidCookie(id: string) {
  cookies().set(UID_COOKIE, id, UID_COOKIE_OPTIONS);
}
