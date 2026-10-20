import { currentUser } from '@/lib/session';
import { generateDrop, ndjsonStream } from '@/lib/service';
import type { GenerationMode } from '@/lib/types';

export const maxDuration = 300;

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const { mode = 'realtime' } = (await request.json().catch(() => ({}))) as { mode?: GenerationMode };
  const user = await currentUser();
  return ndjsonStream(send => generateDrop(user, params.id, mode === 'prefetch' ? 'prefetch' : 'realtime', send));
}
