import Link from 'next/link';

import { Chip, Txt } from '@repo/ui';

import { BottomNav } from '@/components/BottomNav';
import { NotifyBanner } from '@/components/NotifyBanner';
import { Wordmark } from '@/components/Wordmark';
import { SUGGESTED_TOPICS } from '@/lib/constants';
import { estimateMinutes } from '@/lib/drop-format';
import { currentUser } from '@/lib/session';
import { todayView, weekLearningDays } from '@/lib/service';

export const dynamic = 'force-dynamic';

export default async function TodayPage() {
  const user = await currentUser();
  const [items, weekDays] = await Promise.all([todayView(user), weekLearningDays(user.id)]);
  const bannerHidden =
    user.notifyBannerDismissedAt && Date.now() - Date.parse(user.notifyBannerDismissedAt) < 7 * 86_400_000;
  const anyReadToday = items.some(i => i.readToday);

  return (
    <>
      <header className="flex h-14 items-center justify-between px-5 pt-[env(safe-area-inset-top)]">
        <Wordmark />
        <Link href="/settings" className="text-[13px] text-txt-black-tertiary">
          설정
        </Link>
      </header>
      <main className="flex flex-1 flex-col px-5 pb-8">
        <div className="mt-2 flex items-end justify-between">
          <Txt name="display-1" as="h1">
            오늘의 Drop
          </Txt>
          <Txt name="caption-1" className="text-txt-point">
            이번 주 학습 {weekDays}일
          </Txt>
        </div>

        {user.notifyPermission === 'denied' && !bannerHidden && anyReadToday ? <NotifyBanner /> : null}

        {items.length === 0 ? (
          <section className="mt-8 rounded-3xl bg-shape-depth1 p-5">
            <Txt name="title-1">진행 중인 코스가 없어요</Txt>
            <Txt name="body-2" className="mt-1 text-txt-black-secondary">
              요즘 궁금한 걸 코스로 만들어 볼까요?
            </Txt>
            <div className="mt-4 flex flex-wrap gap-2">
              {SUGGESTED_TOPICS.slice(0, 3).map(t => (
                <Link key={t} href={`/start?topic=${encodeURIComponent(t)}`}>
                  <Chip className="bg-shape-white">{t}</Chip>
                </Link>
              ))}
            </div>
            <Link
              href="/start"
              className="mt-4 flex h-12 items-center justify-center rounded-full bg-shape-brand text-sm font-bold text-txt-white-primary"
            >
              주제 입력하기
            </Link>
          </section>
        ) : (
          <ul className="mt-6 flex flex-col gap-3">
            {items.map(({ course, drop, readToday, nextTitle }) => (
              <li key={course.id}>
                <Link
                  href={drop ? `/drop/${drop.id}` : `/course/${course.id}`}
                  className="block rounded-3xl border border-border-div bg-shape-white p-5 shadow-[0_1px_0_rgba(0,0,0,0.02)]"
                >
                  <Txt name="caption-1" className="text-txt-black-tertiary">
                    {course.title} #{String((drop?.index ?? 0) + 1).padStart(2, '0')}
                  </Txt>
                  {readToday ? (
                    <>
                      <Txt name="title-1" className="mt-1 text-txt-black-secondary">
                        오늘 Drop을 읽었어요
                      </Txt>
                      <Txt name="body-2" className="mt-1 text-txt-black-tertiary">
                        내일의 Drop: {nextTitle}
                      </Txt>
                      <Txt name="caption-1" className="mt-3 text-txt-point">
                        다음 Drop 이어 읽기 →
                      </Txt>
                    </>
                  ) : (
                    <>
                      <Txt name="title-1" className="mt-1">
                        {drop?.title}
                      </Txt>
                      <Txt name="caption-1" className="mt-3 text-txt-point">
                        {estimateMinutes(drop?.body)}분 · 읽기
                      </Txt>
                    </>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}

        {items.length > 0 ? (
          <Link href="/start" className="mt-6 text-center text-sm text-txt-black-tertiary underline">
            새 주제로 코스 만들기
          </Link>
        ) : null}
      </main>
      <BottomNav />
    </>
  );
}
