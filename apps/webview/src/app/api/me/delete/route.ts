import { cookies } from 'next/headers';

import { currentUser, UID_COOKIE } from '@/lib/session';
import { track } from '@/lib/service';
import { getStore } from '@/lib/store';

/**
 * 계정 삭제 (App Store 심사 기준 5.1.1(v)). 개인정보와 학습 기록을 지우고 쿠키를 지운다.
 * 사용량 로그(비용 집계)는 사용자 id만 남는다.
 */
export async function POST() {
  const store = getStore();
  const user = await currentUser();
  for (const c of await store.listCourses(user.id)) {
    await store.saveCourse({ ...c, status: 'deleted', title: '', topic: '', outline: [], related: [] });
  }
  for (const d of await store.listDropsByUser(user.id)) {
    await store.saveDrop({ ...d, title: '', body: undefined, easy: undefined, evidence: [], sources: [], courseId: `${d.courseId}:deleted` });
  }
  await store.saveUser({ id: user.id, anon: true, createdAt: user.createdAt, notifyPermission: 'unknown' });
  await track(user.id, 'account_deleted');
  cookies().delete(UID_COOKIE);
  return Response.json({ ok: true });
}
