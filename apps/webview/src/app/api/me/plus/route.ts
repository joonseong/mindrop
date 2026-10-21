import { currentUser } from '@/lib/session';
import { grantPlus } from '@/lib/service';

/** Plus 시작. 인앱 결제 연동 전에는 PLUS_BETA_FREE=true일 때만 결제 없이 켠다 */
export async function POST() {
  const ok = await grantPlus(await currentUser());
  return Response.json({ ok }, { status: ok ? 200 : 503 });
}
