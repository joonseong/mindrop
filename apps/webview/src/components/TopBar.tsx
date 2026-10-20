'use client';

import { useRouter } from 'next/navigation';

import { Icon, Txt } from '@repo/ui';

export function TopBar({
  title,
  back,
  close,
  right,
}: {
  title?: string;
  back?: boolean | string;
  close?: string;
  right?: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <header className="sticky top-0 z-10 flex h-14 w-full flex-shrink-0 items-center justify-between bg-shape-white/95 px-4 pt-[env(safe-area-inset-top)] backdrop-blur">
      <div className="flex w-10 justify-start">
        {back ? (
          <button
            aria-label="뒤로"
            onClick={() => (typeof back === 'string' ? router.push(back) : router.back())}
            className="-ml-1 p-1"
          >
            <Icon name="arrowBack" size={24} />
          </button>
        ) : null}
      </div>
      {title ? (
        <Txt name="title-1" className="truncate">
          {title}
        </Txt>
      ) : (
        <span />
      )}
      <div className="flex w-10 justify-end">
        {close ? (
          <button aria-label="닫기" onClick={() => router.push(close)} className="-mr-1 p-1">
            <Icon name="close" size={24} />
          </button>
        ) : (
          right
        )}
      </div>
    </header>
  );
}
