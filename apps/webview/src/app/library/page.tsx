import Link from 'next/link';

import { Txt } from '@repo/ui';

import { BottomNav } from '@/components/BottomNav';
import { currentUser } from '@/lib/session';
import { getStore } from '@/lib/store';

export const dynamic = 'force-dynamic';

export default async function LibraryPage() {
  const user = await currentUser();
  const store = getStore();
  const courses = (await store.listCourses(user.id)).filter(c => c.status === 'active' || c.status === 'completed');
  const rows = await Promise.all(
    courses.map(async c => ({ course: c, done: (await store.listDrops(c.id)).filter(d => d.completedAt).length })),
  );
  const active = rows.filter(r => r.course.status === 'active');
  const completed = rows.filter(r => r.course.status === 'completed');

  const List = ({ items }: { items: typeof rows }) => (
    <ul className="mt-3 flex flex-col gap-2">
      {items.map(({ course, done }) => (
        <li key={course.id}>
          <Link href={`/course/${course.id}`} className="block rounded-2xl border border-border-div px-5 py-4">
            <Txt name="title-2">{course.title}</Txt>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-shape-depth2">
              <div
                className="h-full rounded-full bg-shape-brand"
                style={{ width: `${Math.round((done / Math.max(1, course.outline.length)) * 100)}%` }}
              />
            </div>
            <Txt name="caption-1" className="mt-1.5 text-txt-black-tertiary">
              {done} / {course.outline.length} Drop
            </Txt>
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <header className="flex h-14 items-center justify-between px-5 pt-[env(safe-area-inset-top)]">
        <Txt name="title-1">내 코스</Txt>
        <Link href="/settings" className="text-[13px] text-txt-black-tertiary">
          설정
        </Link>
      </header>
      <main className="flex flex-1 flex-col px-5 pb-8">
        {rows.length === 0 ? (
          <Txt name="body-2" className="mt-10 text-center text-txt-black-tertiary">
            아직 시작한 코스가 없어요.
          </Txt>
        ) : null}
        {active.length ? (
          <section className="mt-2">
            <Txt name="caption-1" className="text-txt-black-tertiary">
              진행 중
            </Txt>
            <List items={active} />
          </section>
        ) : null}
        {completed.length ? (
          <section className="mt-8">
            <Txt name="caption-1" className="text-txt-black-tertiary">
              완료
            </Txt>
            <List items={completed} />
          </section>
        ) : null}
      </main>
      <BottomNav />
    </>
  );
}
