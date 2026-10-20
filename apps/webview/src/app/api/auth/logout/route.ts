import { cookies } from 'next/headers';

import { UID_COOKIE } from '@/lib/session';

export async function POST() {
  cookies().delete(UID_COOKIE);
  return Response.json({ ok: true });
}
