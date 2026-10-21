import { currentUser } from '@/lib/session';
import { pickToday } from '@/lib/service';

/** 오늘 Drop을 받을 코스 고르기 (하루 한 편) */
export async function POST(request: Request) {
  const { courseId } = (await request.json()) as { courseId?: string };
  const ok = courseId ? await pickToday(await currentUser(), courseId) : false;
  return Response.json({ ok }, { status: ok ? 200 : 409 });
}
