import { currentUser } from '@/lib/session';
import { easyExplain } from '@/lib/service';

export const maxDuration = 60;

/** 조금 헷갈려요 → 같은 내용을 더 쉽게 (Drop당 한 번 만들고 저장) */
export async function POST(_request: Request, { params }: { params: { id: string } }) {
  const easy = await easyExplain(await currentUser(), params.id);
  return easy ? Response.json(easy) : Response.json({ error: 'failed' }, { status: 500 });
}
