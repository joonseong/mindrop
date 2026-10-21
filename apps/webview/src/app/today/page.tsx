import { redirect } from 'next/navigation';

import { TodayScreen } from '@/components/screens/TodayScreen';
import { currentUser } from '@/lib/session';
import { todayData } from '@/lib/views';

export const dynamic = 'force-dynamic';

export default async function TodayPage() {
  const user = await currentUser();
  const data = await todayData(user);
  if (data.cards.length === 0 && !data.doneToday && (user.learned?.length ?? 0) === 0) redirect('/start');
  return <TodayScreen {...data} />;
}
