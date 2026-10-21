import { currentUser } from '@/lib/session';
import { pickTomorrow } from '@/lib/service';

/** 내일 받을 코스 바꾸기 (야간에 이 코스의 다음 Drop을 미리 만든다) */
export async function POST(request: Request) {
  const { courseId } = (await request.json()) as { courseId?: string };
  const ok = courseId ? await pickTomorrow(await currentUser(), courseId) : false;
  return Response.json({ ok }, { status: ok ? 200 : 400 });
}
