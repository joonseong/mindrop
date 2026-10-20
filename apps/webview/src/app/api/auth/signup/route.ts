import { hashPassword, isEmail } from '@/lib/auth';
import { currentUser } from '@/lib/session';
import { track } from '@/lib/service';
import { getStore } from '@/lib/store';

/** 가입: 지금 쓰던 임시 계정을 그대로 가입 계정으로 바꾼다. 기록 이전이 필요 없다 (US-11) */
export async function POST(request: Request) {
  const { email, password } = (await request.json()) as { email?: string; password?: string };
  if (!email || !isEmail(email)) return Response.json({ error: '이메일 형식을 확인해 주세요.' }, { status: 400 });
  if (!password || password.length < 8) return Response.json({ error: '비밀번호는 8자 이상이에요.' }, { status: 400 });
  const store = getStore();
  if (await store.findUserByEmail(email.toLowerCase())) {
    return Response.json({ error: '이미 가입된 이메일이에요. 로그인해 주세요.' }, { status: 409 });
  }
  const user = await currentUser();
  user.anon = false;
  user.email = email.toLowerCase();
  user.passwordHash = hashPassword(password);
  await store.saveUser(user);
  await track(user.id, 'signup');
  return Response.json({ ok: true });
}
