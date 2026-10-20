import { BottomNav } from '@/components/BottomNav';
import { CuriosityInput } from '@/components/CuriosityInput';
import { currentUser } from '@/lib/session';
import { getStore } from '@/lib/store';

export const dynamic = 'force-dynamic';

export default async function StartPage({ searchParams }: { searchParams: { topic?: string } }) {
  const user = await currentUser();
  const hasCourse = (await getStore().listCourses(user.id)).some(c => c.status !== 'failed');
  return (
    <>
      <CuriosityInput initialTopic={searchParams.topic} />
      {hasCourse ? <BottomNav /> : null}
    </>
  );
}
