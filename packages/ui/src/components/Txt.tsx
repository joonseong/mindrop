import { ElementType, ReactNode } from 'react';

import { TEXT_CLASS_NAME } from '../constants/text';
import { twMerge } from 'tailwind-merge';

export interface TxtProps {
  name: keyof typeof TEXT_CLASS_NAME;
  className?: string;
  as?: ElementType;
  children: ReactNode;
}

export function Txt({ name, className, as: Tag = 'p', children }: TxtProps) {
  return <Tag className={twMerge(TEXT_CLASS_NAME[name], className)}>{children}</Tag>;
}
