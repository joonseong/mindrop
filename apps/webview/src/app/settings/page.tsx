import Link from 'next/link';

import { Txt } from '@repo/ui';

import { SettingsForm } from '@/components/SettingsForm';
import { TopBar } from '@/components/TopBar';
import { currentUser } from '@/lib/session';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const user = await currentUser();
  return (
    <>
      <TopBar back title="설정" />
      <main className="flex flex-1 flex-col px-5 pb-10">
        <SettingsForm notifyTime={user.notifyTime ?? '08:00'} permission={user.notifyPermission} anon={user.anon} />
        <section className="mt-8 border-t border-border-div pt-6">
          <Txt name="caption-1" className="text-txt-black-tertiary">
            계정
          </Txt>
          {user.anon ? (
            <div className="mt-3 flex flex-col gap-2">
              <Txt name="body-2">아직 가입하지 않았어요. 앱을 지우면 기록이 사라져요.</Txt>
              <Link href="/signup?next=/settings" className="text-sm text-txt-link underline">
                가입하고 기록 저장하기
              </Link>
              <Link href="/login?next=/today" className="text-sm text-txt-black-tertiary underline">
                로그인
              </Link>
            </div>
          ) : (
            <Txt name="body-2" className="mt-3">
              {user.email}
            </Txt>
          )}
        </section>
      </main>
    </>
  );
}
