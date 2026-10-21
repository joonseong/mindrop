import { BroadScreen } from '@/components/screens/BroadScreen';
import { courseQuota } from '@/lib/service';
import { currentUser } from '@/lib/session';
import { getStore } from '@/lib/store';

export const dynamic = 'force-dynamic';

export default async function BroadPage({ searchParams }: { searchParams: { topic?: string; s?: string; replace?: string } }) {
  const user = await currentUser();
  const quota = await courseQuota(user);
  const current = (await getStore().listCourses(user.id)).find(c => c.status === 'active' || c.status === 'completed');
  return (
    <BroadScreen
      topic={searchParams.topic ?? ''}
      suggestions={(searchParams.s ?? '').split('|').filter(Boolean)}
      quota={quota.ok ? 'ok' : quota.reason}
      currentTopic={current?.topic}
      replace={searchParams.replace === '1'}
    />
  );
}
