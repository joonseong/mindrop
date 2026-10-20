import { currentUser } from '@/lib/session';
import { answerExplain } from '@/lib/service';
import type { ExplainAnswer } from '@/lib/types';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const { answer } = (await request.json()) as { answer: ExplainAnswer };
  await answerExplain(await currentUser(), params.id, answer);
  return Response.json({ ok: true });
}
