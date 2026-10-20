import { Txt } from './Txt';
import { Button as HeadlessButton } from '@headlessui/react';
import type { ButtonProps as HeadlessButtonProps } from '@headlessui/react';
import { twMerge } from 'tailwind-merge';

export interface RoundTabProps extends HeadlessButtonProps {
  children: string;
  active?: boolean;
  className?: string;
}

export function RoundTab({ children, active = false, className, ...props }: RoundTabProps) {
  return (
    <HeadlessButton
      className={twMerge(
        'px-4 py-2 text-sm rounded-full',
        active ? 'bg-shape-brand text-txt-white-primary' : 'bg-shape-depth1',
        className,
      )}
      {...props}
    >
      <Txt name={active ? 'title-2' : 'body-2'}>{children}</Txt>
    </HeadlessButton>
  );
}
