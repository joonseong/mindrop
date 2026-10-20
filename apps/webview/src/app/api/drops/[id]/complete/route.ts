import { currentUser } from '@/lib/session';
import { completeDrop } from '@/lib/service';
import type { UnderstandingSignal } from '@/lib/types';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const { signal } = (await request.json()) as { signal: UnderstandingSignal };
  if (signal !== 'understood' && signal !== 'confused') return Response.json({ error: 'signal' }, { status: 400 });
  return Response.json(await completeDrop(await currentUser(), params.id, signal));
}
