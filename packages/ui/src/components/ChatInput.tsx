import { Icon } from './Icon';
import { Input as HeadlessInput } from '@headlessui/react';
import type { InputProps as HeadlessInputProps } from '@headlessui/react';
import { twMerge } from 'tailwind-merge';

export interface ChatInputProps extends HeadlessInputProps {
  className?: string;
  onSend?: () => void;
}

export function ChatInput({ className, onSend, ...props }: ChatInputProps) {
  return (
    <div
      className={twMerge(
        'overflow-hidden relative flex items-center w-full h-12 rounded-full border border-solid border-border-button',
        props.disabled ? 'bg-shape-depth2' : 'bg-shape-white',
      )}
    >
      <HeadlessInput
        className={twMerge(
          'flex-1 size-full outline-none px-4 text-base font-[inherit] bg-transparent text-txt-black-primary caret-shape-brand disabled:text-txt-black-placeholder',
          className,
        )}
        {...props}
      />
      <button
        className={twMerge(
          'grid place-items-center size-8 mr-2 rounded-full',
          props.disabled ? 'bg-shape-iconlight' : 'bg-shape-brand',
        )}
        onClick={onSend}
      >
        <Icon name="top" size={20} color="#FFFFFF" />
      </button>
    </div>
  );
}
