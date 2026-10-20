import { currentUser } from '@/lib/session';
import { getStore } from '@/lib/store';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const user = await currentUser();
  const drop = await getStore().getDrop(params.id);
  if (!drop || drop.userId !== user.id) return Response.json({ error: 'not found' }, { status: 404 });
  return Response.json(drop);
}
