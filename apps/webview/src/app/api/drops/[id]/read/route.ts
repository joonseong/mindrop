import { currentUser } from '@/lib/session';
import { markRead } from '@/lib/service';

export async function POST(_request: Request, { params }: { params: { id: string } }) {
  await markRead(await currentUser(), params.id);
  return Response.json({ ok: true });
}
