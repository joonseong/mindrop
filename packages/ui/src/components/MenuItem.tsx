'use client';

import { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

import { Txt } from './Txt';
import { twMerge } from 'tailwind-merge';

export type MenuItemProps<T extends ElementType> = {
  as?: T;
  label: ReactNode;
  rightAddon?: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, 'children'>;

export function MenuItem<T extends ElementType = 'div'>({
  as,
  className,
  label,
  rightAddon,
  ...props
}: MenuItemProps<T>) {
  const Component = as ?? 'div';

  return (
    <Component
      className={twMerge(
        'w-full h-12 pl-4 pr-2 bg-shape-depth1 rounded-lg flex items-center justify-between',
        className,
      )}
      {...props}
    >
      {typeof label === 'string' ? <Txt name="body-2">{label}</Txt> : label}
      {rightAddon}
    </Component>
  );
}
