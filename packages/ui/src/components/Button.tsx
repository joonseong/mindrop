import { ReactNode } from 'react';

import { TEXT_CLASS_NAME } from '../constants/text';
import { Button as HeadlessButton } from '@headlessui/react';
import type { ButtonProps as HeadlessButtonProps } from '@headlessui/react';
import { twMerge } from 'tailwind-merge';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary';
export type ButtonSize = 32 | 48 | 56;

export interface ButtonProps extends Omit<HeadlessButtonProps, 'className'> {
  variant: ButtonVariant;
  size: ButtonSize;
  children: ReactNode;
  className?: string;
}

export function Button({ variant, size, children, className, ...props }: ButtonProps) {
  const styleClassName = {
    primary: {
      32: 'bg-shape-brand text-txt-white-primary',
      48: 'bg-shape-brand text-txt-white-primary',
      56: 'bg-shape-brand text-txt-white-primary',
    },
    secondary: {
      32: 'bg-shape-black text-txt-white-primary',
      48: 'bg-shape-white text-txt-black-primary border border-solid border-border-button',
      56: 'bg-shape-white text-txt-black-primary border border-solid border-border-button',
    },
    tertiary: {
      32: 'bg-shape-depth1 text-txt-black-secondary border border-solid border-border-button',
      48: 'bg-shape-black text-txt-white-primary',
      56: 'bg-shape-black text-txt-white-primary',
    },
  };

  const sizeClassName = {
    32: 'px-3 h-8 rounded',
    48: 'w-full h-12 rounded-full',
    56: 'w-full h-14 rounded-full',
  };

  const buttonTextClassName = {
    primary: {
      32: TEXT_CLASS_NAME['body-2'],
      48: TEXT_CLASS_NAME['title-2'],
      56: TEXT_CLASS_NAME['title-1'],
    },
    secondary: {
      32: TEXT_CLASS_NAME['body-2'],
      48: TEXT_CLASS_NAME['body-2'],
      56: TEXT_CLASS_NAME['body-1'],
    },
    tertiary: {
      32: TEXT_CLASS_NAME['body-2'],
      48: twMerge(TEXT_CLASS_NAME['title-2'], 'font-normal'),
      56: twMerge(TEXT_CLASS_NAME['title-1'], 'font-normal'),
    },
  };

  const commonClassName =
    'transition-colors disabled:bg-shape-depth2 disabled:text-txt-black-tertiary disabled:font-normal';

  return (
    <HeadlessButton
      className={twMerge(
        styleClassName[variant][size],
        sizeClassName[size],
        buttonTextClassName[variant][size],
        commonClassName,
        className,
      )}
      {...props}
    >
      {children}
    </HeadlessButton>
  );
}
