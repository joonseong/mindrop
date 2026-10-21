import { currentUser } from '@/lib/session';
import { canOpenDrop, generateDrop, ndjsonStream } from '@/lib/service';
import { getStore } from '@/lib/store';

export const maxDuration = 300;

/** 하루 한 편: 오늘 열 수 있는 Drop만 실시간으로 만든다 */
export async function POST(_request: Request, { params }: { params: { id: string } }) {
  const user = await currentUser();
  const drop = await getStore().getDrop(params.id);
  if (!drop || drop.userId !== user.id) return Response.json({ error: 'not found' }, { status: 404 });
  if (drop.status !== 'ready' && !(await canOpenDrop(user, drop))) return Response.json({ error: 'locked' }, { status: 423 });
  return ndjsonStream(send => generateDrop(user, params.id, 'realtime', send));
}
