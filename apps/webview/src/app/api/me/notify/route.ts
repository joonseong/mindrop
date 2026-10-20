import { currentUser } from '@/lib/session';
import { track } from '@/lib/service';
import { getStore } from '@/lib/store';
import { nowIso } from '@/lib/util';

/** 알림 권한 결과, 푸시 토큰, 발송 시각, 재안내 배너 닫기 */
export async function POST(request: Request) {
  const body = (await request.json()) as {
    permission?: 'granted' | 'denied';
    pushToken?: string;
    notifyTime?: string;
    dismissBanner?: boolean;
  };
  const user = await currentUser();
  if (body.permission) {
    user.notifyPermission = body.permission;
    await track(user.id, 'notify_permission', { permission: body.permission });
  }
  if (body.pushToken) user.pushToken = body.pushToken;
  if (body.notifyTime && /^\d{2}:\d{2}$/.test(body.notifyTime)) {
    // 21시~08시는 고를 수 없다 (US-07)
    if (body.notifyTime >= '21:00' || body.notifyTime < '08:00') return Response.json({ error: 'quiet' }, { status: 400 });
    user.notifyTime = body.notifyTime;
  }
  if (body.dismissBanner) user.notifyBannerDismissedAt = nowIso();
  await getStore().saveUser(user);
  return Response.json({ ok: true });
}
