import Link from 'next/link';

import { Txt } from '@repo/ui';

import { BottomNav } from '@/components/BottomNav';
import { currentUser } from '@/lib/session';
import { isLearned } from '@/lib/service';
import { getStore } from '@/lib/store';

export const dynamic = 'force-dynamic';

type NodeState = 'discovered' | 'learning' | 'learned';
interface MapNode {
  label: string;
  state: NodeState;
  href: string;
}

const NODE_CLASS: Record<NodeState, string> = {
  learned: 'bg-shape-brand text-txt-white-primary',
  learning: 'border-2 border-border-brand bg-shape-white text-txt-point',
  discovered: 'border border-dashed border-border-button bg-shape-white/60 text-txt-black-tertiary',
};

export default async function MapPage() {
  const user = await currentUser();
  const store = getStore();
  const courses = (await store.listCourses(user.id)).filter(c => c.status === 'active' || c.status === 'completed');
  const groups = new Map<string, MapNode[]>();
  const add = (category: string, node: MapNode) => {
    const list = groups.get(category) ?? [];
    if (!list.some(n => n.label === node.label)) list.push(node);
    groups.set(category, list);
  };

  let learnedCount = 0;
  for (const course of courses) {
    const drops = await store.listDrops(course.id);
    const learned = isLearned(course, drops);
    if (learned) learnedCount++;
    add(course.category, { label: course.topic, state: learned ? 'learned' : 'learning', href: `/course/${course.id}` });
  }
  // Discovered: 코스를 만들 때 생성한 연결 주제 (PRD §13.2)
  const taken = new Set(courses.map(c => c.topic));
  for (const course of courses) {
    for (const topic of course.related) {
      if (taken.has(topic)) continue;
      const q = new URLSearchParams({ topic, level: 'beginner', category: course.category, taskType: course.taskType });
      add(course.category, { label: topic, state: 'discovered', href: `/course/new?${q}` });
    }
  }

  return (
    <>
      <header className="flex h-14 items-center px-5 pt-[env(safe-area-inset-top)]">
        <Txt name="title-1">나의 지도</Txt>
      </header>
      <main className="flex flex-1 flex-col px-5 pb-8">
        {courses.length === 0 ? (
          <section className="mt-10 flex flex-col items-center text-center">
            <Txt name="title-1">첫 코스를 시작하면 지도가 자라요</Txt>
            <Link
              href="/start"
              className="mt-5 flex h-12 w-full items-center justify-center rounded-full bg-shape-brand text-sm font-bold text-txt-white-primary"
            >
              주제 입력하기
            </Link>
          </section>
        ) : (
          <>
            <div className="mt-2 flex items-baseline gap-2">
              <Txt name="display-1">{learnedCount}</Txt>
              <Txt name="body-2" className="text-txt-black-secondary">
                개 주제를 알게 됐어요
              </Txt>
            </div>
            <div className="mt-3 flex gap-4">
              {(['learned', 'learning', 'discovered'] as NodeState[]).map(s => (
                <span key={s} className="flex items-center gap-1.5">
                  <span className={`inline-block h-3 w-3 rounded-full ${NODE_CLASS[s]}`} />
                  <Txt name="caption-1" className="text-txt-black-tertiary">
                    {s === 'learned' ? '알게 됨' : s === 'learning' ? '배우는 중' : '다음 후보'}
                  </Txt>
                </span>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-4">
              {[...groups.entries()].map(([category, nodes]) => (
                <section key={category} className="rounded-3xl bg-shape-depth1 p-5">
                  <Txt name="title-2" className="text-txt-black-secondary">
                    {category}
                  </Txt>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {nodes.map(n => (
                      <Link key={n.label} href={n.href} className={`rounded-full px-4 py-2 text-sm ${NODE_CLASS[n.state]}`}>
                        {n.label}
                      </Link>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </>
        )}
      </main>
      <BottomNav />
    </>
  );
}
