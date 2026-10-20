'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Icon, Txt } from '@repo/ui';

function MapIcon({ active }: { active: boolean }) {
  const color = active ? '#151517' : '#9FA0AA';
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="2.6" fill={active ? color : 'none'} stroke={color} strokeWidth="1.6" />
      <circle cx="5" cy="6" r="1.8" stroke={color} strokeWidth="1.6" />
      <circle cx="19" cy="6.5" r="1.8" stroke={color} strokeWidth="1.6" />
      <circle cx="6" cy="18.5" r="1.8" stroke={color} strokeWidth="1.6" />
      <circle cx="18.5" cy="18" r="1.8" stroke={color} strokeWidth="1.6" />
      <path d="M10 10.5 6.4 7.2M14 10.6l3.6-2.8M10.2 13.6 7.3 17.2M13.9 13.5l3.3 3.3" stroke={color} strokeWidth="1.6" />
    </svg>
  );
}

const TABS = [
  { href: '/today', label: '오늘', icon: (a: boolean) => <Icon name={a ? 'homeFilled' : 'home'} size={24} color={a ? '#151517' : '#9FA0AA'} /> },
  { href: '/start', label: '탐색', icon: (a: boolean) => <Icon name="search" size={24} color={a ? '#151517' : '#9FA0AA'} /> },
  { href: '/map', label: '지도', icon: (a: boolean) => <MapIcon active={a} /> },
  {
    href: '/library',
    label: '내 코스',
    icon: (a: boolean) => <Icon name={a ? 'bookcaseFilled' : 'bookcase'} size={24} color={a ? '#151517' : '#9FA0AA'} />,
  },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="sticky bottom-0 z-10 mt-auto flex h-16 w-full items-center justify-around border-t border-border-div bg-shape-white pb-[env(safe-area-inset-bottom)]">
      {TABS.map(tab => {
        const active = pathname.startsWith(tab.href);
        return (
          <Link key={tab.href} href={tab.href} className="flex w-16 flex-col items-center gap-0.5">
            {tab.icon(active)}
            <Txt name={active ? 'label-bold' : 'label-regular'} className="text-txt-black-secondary">
              {tab.label}
            </Txt>
          </Link>
        );
      })}
    </nav>
  );
}
