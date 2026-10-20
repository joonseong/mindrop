import { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';

import { TEXT_CLASS_NAME } from '../constants/text';
import { Txt } from './Txt';
import { twMerge } from 'tailwind-merge';

export interface HeaderRootProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Root({ children, className, ...props }: HeaderRootProps) {
  return (
    <div
      className={twMerge('flex-shrink-0 flex items-center justify-between w-full h-16 px-4 bg-shape-white', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export interface HeaderTitleProps extends Omit<HTMLAttributes<HTMLDivElement>, 'prefix'> {
  children: ReactNode;
  prefix?: ReactNode;
  typography?: keyof typeof TEXT_CLASS_NAME;
}

export function Title({ children, className, prefix, typography = 'display-2', ...props }: HeaderTitleProps) {
  return (
    <div className={twMerge('flex items-center gap-2', className)} {...props}>
      {prefix}
      <Txt name={typography}>{children}</Txt>
    </div>
  );
}

export interface HeaderMenuProps extends HTMLAttributes<HTMLDivElement> {}

export function Menu({ children, className, ...props }: HeaderMenuProps) {
  return (
    <div className={twMerge('flex items-center gap-4', className)} {...props}>
      {children}
    </div>
  );
}

export interface HeaderMenuItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export function MenuItem({ children, className, ...props }: HeaderMenuItemProps) {
  return (
    <button className={twMerge('border-none bg-transparent', className)} {...props}>
      {children}
    </button>
  );
}
