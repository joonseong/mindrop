import { currentUser } from '@/lib/session';
import { createCourse, ndjsonStream } from '@/lib/service';
import { getStore } from '@/lib/store';

export const maxDuration = 300;

/** 커리큘럼 재생성은 코스당 1회 (US-13) */
export async function POST(_request: Request, { params }: { params: { id: string } }) {
  const user = await currentUser();
  const course = await getStore().getCourse(params.id);
  if (!course || course.userId !== user.id) return Response.json({ error: 'not found' }, { status: 404 });
  if (course.regenUsed) return Response.json({ error: 'used' }, { status: 409 });
  const drops = await getStore().listDrops(course.id);
  if (drops.some(d => d.completedAt)) return Response.json({ error: 'started' }, { status: 409 });
  course.regenUsed = true;
  return ndjsonStream(send => createCourse(user, course, send, course));
}
