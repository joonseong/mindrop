import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Txt } from '@repo/ui';

import { TopBar } from '@/components/TopBar';
import { LEVEL_LABEL } from '@/lib/types';
import { currentUser } from '@/lib/session';
import { getStore } from '@/lib/store';

export const dynamic = 'force-dynamic';

export default async function CourseOverviewPage({ params }: { params: { id: string } }) {
  const user = await currentUser();
  const store = getStore();
  const course = await store.getCourse(params.id);
  if (!course || course.userId !== user.id) notFound();
  const drops = await store.listDrops(course.id);
  const done = drops.filter(d => d.completedAt).length;
  const confused = drops.filter(d => d.signal === 'confused').length;
  const nextIndex = drops.find(d => !d.completedAt)?.index ?? -1;
  const canRegenerate = !course.regenUsed && done === 0;

  return (
    <>
      <TopBar back="/library" />
      <main className="flex flex-1 flex-col px-5 pb-10">
        <Txt name="caption-1" className="text-txt-point">
          {LEVEL_LABEL[course.level]} · {course.category}
        </Txt>
        <Txt name="display-1" as="h1" className="mt-1">
          {course.title}
        </Txt>
        <Txt name="body-2" className="mt-2 text-txt-black-secondary">
          {done} / {course.outline.length} Drop 완료{confused ? ` · 헷갈린 Drop ${confused}개` : ''}
        </Txt>

        <ol className="mt-6 flex flex-col gap-2">
          {drops.map(d => {
            const isNext = d.index === nextIndex;
            const locked = !d.completedAt && !isNext;
            const content = (
              <div
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 ${isNext ? 'border-2 border-border-brand' : 'bg-shape-depth1'} ${locked ? 'opacity-50' : ''}`}
              >
                <Txt name="title-2" className="w-5 flex-shrink-0 text-txt-point">
                  {d.completedAt ? '✓' : d.index + 1}
                </Txt>
                <Txt name="body-2" className="flex-1">
                  {d.title}
                </Txt>
                {d.signal === 'confused' ? (
                  <Txt name="label-bold" className="text-txt-highlight">
                    헷갈림
                  </Txt>
                ) : null}
              </div>
            );
            return (
              <li key={d.id}>
                {locked ? (
                  <div title="앞 Drop을 먼저 읽어 주세요">{content}</div>
                ) : (
                  <Link href={`/drop/${d.id}`}>{content}</Link>
                )}
              </li>
            );
          })}
        </ol>
        {nextIndex > 0 ? (
          <Txt name="caption-1" className="mt-3 text-txt-black-tertiary">
            흐린 Drop은 앞 Drop을 먼저 읽으면 열려요.
          </Txt>
        ) : null}

        {canRegenerate ? (
          <Link
            href={`/course/new?regenerate=${course.id}&topic=${encodeURIComponent(course.topic)}`}
            className="mt-8 text-center text-sm text-txt-black-tertiary underline"
          >
            커리큘럼 다시 만들기 (1회)
          </Link>
        ) : null}
      </main>
    </>
  );
}
