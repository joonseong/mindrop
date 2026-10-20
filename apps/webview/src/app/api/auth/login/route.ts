import { verifyPassword } from '@/lib/auth';
import { currentUser, setUidCookie } from '@/lib/session';
import { getStore } from '@/lib/store';

/** 로그인: 이 기기의 임시 계정 기록이 있으면 로그인한 계정으로 옮긴다 */
export async function POST(request: Request) {
  const { email, password } = (await request.json()) as { email?: string; password?: string };
  const store = getStore();
  const account = email ? await store.findUserByEmail(email.toLowerCase()) : null;
  if (!account?.passwordHash || !password || !verifyPassword(password, account.passwordHash)) {
    return Response.json({ error: '이메일 또는 비밀번호가 맞지 않아요.' }, { status: 401 });
  }
  const device = await currentUser();
  if (device.anon && device.id !== account.id) {
    try {
      await store.moveUserData(device.id, account.id);
    } catch (error) {
      // 이전에 실패해도 임시 데이터는 지우지 않는다 (US-11)
      console.error('[login] moveUserData', error);
    }
  }
  setUidCookie(account.id);
  return Response.json({ ok: true });
}
