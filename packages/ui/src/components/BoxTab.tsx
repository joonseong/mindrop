'use client';

import { HTMLAttributes, ReactNode, createContext, useContext } from 'react';

import { useControllableState } from '../hooks/useControllableState';
import { Txt } from './Txt';
import { twMerge } from 'tailwind-merge';

const BoxTabContext = createContext<{ tab: string | undefined; setTab: (_tab: string) => void }>({
  tab: undefined,
  setTab: () => {},
});

export interface BoxTabRootProps {
  defaultValue?: string;
  value?: string;
  onChange?: (_value?: string) => void;
  children: ReactNode;
}

export function Root({ children, defaultValue, value, onChange }: BoxTabRootProps) {
  const [tab, setTab] = useControllableState({
    prop: value,
    defaultProp: defaultValue,
    onChange,
  });

  return <BoxTabContext.Provider value={{ tab, setTab }}>{children}</BoxTabContext.Provider>;
}

export interface BoxTabListProps extends HTMLAttributes<HTMLDivElement> {}

export function List({ children, className, ...props }: BoxTabListProps) {
  return (
    <div className={twMerge('flex w-full', className)} {...props}>
      {children}
    </div>
  );
}

export interface BoxTabItemProps extends Omit<HTMLAttributes<HTMLButtonElement>, 'onClick'> {
  value: string;
}

export function Item({ value, children, className, ...props }: BoxTabItemProps) {
  const context = useContext(BoxTabContext);

  if (!context) {
    throw new Error('BoxTab.Item BoxTab.Root 내부에서 사용해야 합니다.');
  }

  const { tab, setTab } = context;
  const isActive = tab === value;

  return (
    <button
      className={twMerge('flex-1 relative grid place-items-center h-12 bg-shape-white', className)}
      onClick={() => setTab(value)}
      {...props}
    >
      <Txt as="span" name={isActive ? 'title-1' : 'body-1'} className="text-txt-black-primary">
        {children}
      </Txt>

      {isActive && (
        <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 size-1.5 bg-shape-brand rounded-full" />
      )}
    </button>
  );
}

export interface BoxTabPanelProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
}

export function Panel({ value, children, className, ...props }: BoxTabPanelProps) {
  const context = useContext(BoxTabContext);

  if (!context) {
    throw new Error('BoxTab.Item BoxTab.Root 내부에서 사용해야 합니다.');
  }

  return context.tab === value ? (
    <div className={className} {...props}>
      {children}
    </div>
  ) : null;
}
