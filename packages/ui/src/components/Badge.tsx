import { Txt } from './Txt';

export type BadgeSize = 16 | 20 | 32;

export interface BadgeProps {
  size: BadgeSize;
  children: string;
}

export function Badge({ size, children }: BadgeProps) {
  const styleClassName = {
    16: 'px-1 py-[1px] rounded-full bg-shape-white border border-solid border-border-div text-txt-black-tertiary',
    20: 'px-1.5 py-[3px] rounded bg-shape-highlight text-txt-white-primary',
    32: 'px-3 py-1.5 rounded-full bg-shape-depth1 text-txt-black-primary',
  };
  const textClassName = { 16: 'label-regular', 20: 'label-bold', 32: 'title-2' } as const;

  return (
    <Txt as="span" name={textClassName[size]} className={styleClassName[size]}>
      {children}
    </Txt>
  );
}
