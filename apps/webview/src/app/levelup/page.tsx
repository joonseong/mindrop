import { AppHeader, Footer, Main, PrimaryButton, Screen, TextButton } from '@/components/ui';
import { CHARACTER } from '@/lib/characters';
import { stageOf } from '@/lib/service';
import { currentUser } from '@/lib/session';

export const dynamic = 'force-dynamic';

export default async function LevelUpPage({ searchParams }: { searchParams: { next?: string } }) {
  const user = await currentUser();
  const stage = stageOf(user);
  const ch = CHARACTER[stage.key];
  const last = user.learned?.[user.learned.length - 1];
  const next = searchParams.next?.startsWith('/') ? searchParams.next : '/today';
  return (
    <Screen>
      <AppHeader layout="nav" close={next} />
      <Main className="items-center justify-center pb-6 pt-4 text-center">
        <div className="mc-pop mt-4 flex aspect-square w-[min(224px,56vw)] items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ch.full} alt={`${ch.name} 캐릭터`} className="block h-full w-full object-contain" />
        </div>
        <h1 className="mt-4 text-[28px] font-bold leading-9 tracking-[-1px]">{ch.name} 단계가 됐어요!</h1>
        <p className="mt-2 text-base text-txt-black-secondary">
          {last ? `‘${last.topic}’까지 ` : ''}다 배운 주제가 {stage.learned}개가 됐어요.
        </p>
      </Main>
      <Footer>
        <PrimaryButton href="/map" replace>
          내 학습 보기
        </PrimaryButton>
        <TextButton href={next} replace>
          닫기
        </TextButton>
      </Footer>
    </Screen>
  );
}
