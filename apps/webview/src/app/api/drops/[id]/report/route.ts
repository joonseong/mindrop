import { currentUser } from '@/lib/session';
import { reportDrop } from '@/lib/service';

export async function POST(_request: Request, { params }: { params: { id: string } }) {
  await reportDrop(await currentUser(), params.id);
  return Response.json({ ok: true });
}
