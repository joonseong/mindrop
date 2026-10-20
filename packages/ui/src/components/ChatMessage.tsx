import { ReactNode } from 'react';

import { Txt } from './Txt';
import { twMerge } from 'tailwind-merge';

export interface ChatMessageProps {
  className?: string;
  isMyMessage?: boolean;
  children: ReactNode;
}

export function ChatMessage({ className, isMyMessage = false, children }: ChatMessageProps) {
  const messageUserClassName = isMyMessage
    ? 'bg-shape-brand text-txt-white-primary rounded-tr'
    : 'bg-shape-depth1 text-txt-black-secondary rounded-tl';

  return (
    <div className="flex">
      <Txt
        name="body-2"
        className={twMerge('inline-block py-3 px-4 rounded-2xl break-all', messageUserClassName, className)}
      >
        {children}
      </Txt>
    </div>
  );
}
