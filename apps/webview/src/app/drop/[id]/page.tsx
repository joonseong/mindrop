import { notFound } from 'next/navigation';

import { DropView } from '@/components/DropView';
import { currentUser } from '@/lib/session';
import { getStore } from '@/lib/store';
import { kstDate } from '@/lib/util';

export const dynamic = 'force-dynamic';

export default async function DropPage({ params }: { params: { id: string } }) {
  const user = await currentUser();
  const store = getStore();
  const drop = await store.getDrop(params.id);
  if (!drop || drop.userId !== user.id) notFound();
  const course = (await store.getCourse(drop.courseId))!;
  const drops = await store.listDrops(course.id);
  const next = drops.find(d => d.index === drop.index + 1);
  // 첫날에만 2번 Drop을 미리 만든다 (PRD §16.2 ④)
  const prefetchId =
    drop.index === 0 && kstDate(course.createdAt) === kstDate() && next?.status === 'pending' ? next.id : undefined;
  const canRegenerate = !course.regenUsed && !drops.some(d => d.completedAt);

  return (
    <DropView
      initialDrop={drop}
      course={course}
      total={course.outline.length}
      nextTitle={next?.title}
      prefetchId={prefetchId}
      canRegenerate={canRegenerate}
      isAnon={user.anon}
      notifyPermission={user.notifyPermission}
      presubEnabled={process.env.NEXT_PUBLIC_PRESUB_ENABLED === 'true' && !user.presubscribedAt}
    />
  );
}
