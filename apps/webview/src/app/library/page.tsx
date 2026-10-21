import Link from 'next/link';

import { AppHeader, BottomNav, Main, Progress, Screen } from '@/components/ui';
import { CHARACTER } from '@/lib/characters';
import { currentUser } from '@/lib/session';
import { type CourseCard, libraryData } from '@/lib/views';

export const dynamic = 'force-dynamic';

function List({ name, items }: { name: string; items: CourseCard[] }) {
  if (!items.length) return null;
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm font-bold text-txt-black-secondary">
        {name} <span className="font-normal text-txt-black-tertiary">{items.length}</span>
      </h2>
      <ul className="flex flex-col gap-2">
        {items.map(c => (
          <li key={c.id}>
            <Link href={`/course/${c.id}`} className="mc-press flex flex-col gap-3 rounded-2xl border border-border-div p-5">
              <span className="text-lg font-bold">{c.title}</span>
              <span className="flex items-center gap-3">
                <Progress value={c.done / Math.max(1, c.total)} />
                <span className="flex-shrink-0 text-sm font-semibold text-txt-black-secondary">
                  {c.done} / {c.total}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** 프로필: 캐릭터 단계 · 계정 · Plus · 내 코스 목록 */
export default async function LibraryPage() {
  const user = await currentUser();
  const d = await libraryData(user);
  const ch = CHARACTER[d.stage.key];
  return (
    <Screen>
      <AppHeader layout="large" title="프로필" settings />
      <Main className="gap-10 pb-8 pt-2">
        <section className="flex items-center gap-4 rounded-2xl bg-shape-depth1 p-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ch.face} alt={`${ch.name} 등급`} className="h-14 w-14 flex-shrink-0 object-contain" />
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="text-lg font-bold">
              {ch.name} 단계 · {d.stage.learned}개 주제 다 배움
            </span>
            <span className="truncate text-sm text-txt-black-tertiary">
              {d.anon ? '가입하면 학습 기록이 저장돼요' : d.email ?? 'Apple 계정'} · {d.plus ? 'Plus' : '무료'}
            </span>
          </div>
        </section>
        {d.anon ? (
          <Link href="/signup?next=/library" className="-mt-7 self-start text-sm font-semibold text-txt-point underline">
            학습 기록 저장하기
          </Link>
        ) : null}
        <List name="진행 중" items={d.active} />
        <List name="완료" items={d.done} />
        {!d.active.length && !d.done.length ? (
          <p className="rounded-2xl bg-shape-depth1 p-5 text-sm text-txt-black-secondary">아직 코스가 없어요. 탐색에서 궁금한 주제를 입력해 보세요.</p>
        ) : null}
        {!d.plus ? (
          <Link href="/plus" className="flex items-center justify-between rounded-2xl border-2 border-border-brand p-5">
            <span className="flex flex-col gap-0.5">
              <span className="text-lg font-bold">미니커버리 Plus</span>
              <span className="text-sm text-txt-black-tertiary">새 코스를 한 달에 3개까지</span>
            </span>
            <span className="text-sm font-bold text-txt-point">알아보기</span>
          </Link>
        ) : null}
      </Main>
      <BottomNav active="library" />
    </Screen>
  );
}
