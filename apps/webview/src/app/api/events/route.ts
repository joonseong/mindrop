import { currentUser } from '@/lib/session';
import { track } from '@/lib/service';

const ALLOWED = new Set(['app_open', 'push_opened', 'presub_card_view', 'notify_prompt_view', 'ttfd', 'drop_wait']);

export async function POST(request: Request) {
  const { name, props } = (await request.json()) as { name: string; props?: Record<string, unknown> };
  if (!ALLOWED.has(name)) return Response.json({ error: 'name' }, { status: 400 });
  await track((await currentUser()).id, name, props);
  return Response.json({ ok: true });
}
