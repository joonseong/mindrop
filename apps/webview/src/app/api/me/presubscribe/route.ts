import { currentUser } from '@/lib/session';
import { track } from '@/lib/service';
import { getStore } from '@/lib/store';
import { nowIso } from '@/lib/util';

/** Gate 1 지불 의향 측정: 사전 구독 신청 (실제 결제 없음, PRD §22.2) */
export async function POST(request: Request) {
  const { courseId } = (await request.json().catch(() => ({}))) as { courseId?: string };
  const user = await currentUser();
  if (!user.presubscribedAt) {
    user.presubscribedAt = nowIso();
    await getStore().saveUser(user);
    await track(user.id, 'presubscribe', { courseId });
  }
  return Response.json({ ok: true });
}
