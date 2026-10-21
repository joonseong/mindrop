import { notFound, redirect } from 'next/navigation';

import { EasyScreen } from '@/components/screens/EasyScreen';
import { canOpenDrop } from '@/lib/service';
import { currentUser } from '@/lib/session';
import { getStore } from '@/lib/store';

export const dynamic = 'force-dynamic';

export default async function EasyPage({ params }: { params: { id: string } }) {
  const user = await currentUser();
  const store = getStore();
  const drop = await store.getDrop(params.id);
  if (!drop || drop.userId !== user.id) notFound();
  if (!drop.body || !(await canOpenDrop(user, drop))) redirect(`/drop/${drop.id}`);
  const course = (await store.getCourse(drop.courseId))!;
  return <EasyScreen dropId={drop.id} title={drop.title} courseTitle={course.title} initial={drop.easy ?? null} completed={Boolean(drop.completedAt)} />;
}
