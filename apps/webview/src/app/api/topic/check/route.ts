import { currentUser } from '@/lib/session';
import { checkTopic } from '@/lib/service';

export async function POST(request: Request) {
  const { input } = (await request.json()) as { input?: string };
  const text = (input ?? '').trim();
  if (!text) return Response.json({ error: 'empty' }, { status: 400 });
  const user = await currentUser();
  return Response.json(await checkTopic(user, text));
}
