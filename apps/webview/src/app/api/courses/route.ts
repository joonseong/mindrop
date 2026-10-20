import { currentUser } from '@/lib/session';
import { canCreateCourse, createCourse, ndjsonStream } from '@/lib/service';
import type { Level, TaskType } from '@/lib/types';

export const maxDuration = 300;

export async function POST(request: Request) {
  const body = (await request.json()) as { topic: string; level: Level; category: string; taskType: TaskType };
  const user = await currentUser();
  if (!(await canCreateCourse(user))) return Response.json({ needSignup: true }, { status: 403 });
  return ndjsonStream(send => createCourse(user, body, send));
}
