import { redirect } from 'next/navigation';

import { currentUser } from '@/lib/session';
import { getStore } from '@/lib/store';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const user = await currentUser();
  const courses = await getStore().listCourses(user.id);
  redirect(courses.some(c => c.status === 'active' || c.status === 'completed') ? '/today' : '/start');
}
