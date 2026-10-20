'use client';

import { forwardRef, useEffect, useRef, useState } from 'react';

import { Icon } from './Icon';
import { Txt } from './Txt';
import { Input as HeadlessInput } from '@headlessui/react';
import type { InputProps as HeadlessInputProps } from '@headlessui/react';
import { twMerge } from 'tailwind-merge';

export interface InputProps extends HeadlessInputProps {
  className?: string;
  bottomText?: string;
  error?: boolean;
  onReset?: () => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, bottomText, error, onReset, ...props },
  ref,
) {
  const [focused, setFocused] = useState<boolean>(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resolvedInputRef = ref ?? inputRef;

  const handleFocus = () => setFocused(true);

  const handleUnfocus: EventListener = event => {
    if (wrapperRef.current && event.target instanceof Node && !wrapperRef.current.contains(event.target)) {
      setFocused(false);
    }
  };

  const handleClick = () => {
    if ('current' in resolvedInputRef && resolvedInputRef.current) {
      resolvedInputRef.current.focus();
    }

    onReset!();
  };

  const getBorderStyle = () => {
    if (error) {
      return 'border-border-error';
    } else if (focused) {
      return 'border-border-brand';
    } else {
      return 'border-border-button';
    }
  };

  useEffect(() => {
    if (!props.disabled) {
      window.addEventListener('click', handleUnfocus);

      return () => window.removeEventListener('click', handleUnfocus);
    } else {
      setFocused(false);
    }
  }, [props.disabled]);

  return (
    <div className="flex flex-col gap-1">
      <div
        className={twMerge(
          'flex items-center gap-2 w-full py-3 pl-4 pr-3 rounded border border-solid bg-shape-white transition-all',
          props.disabled ? 'border-border-button bg-shape-depth2' : '',
          getBorderStyle(),
          className,
        )}
        ref={wrapperRef}
      >
        <HeadlessInput
          ref={resolvedInputRef}
          className="w-full outline-none text-base rounded bg-transparent text-txt-black-primary caret-shape-brand disabled:text-txt-black-placeholder"
          onFocus={handleFocus}
          {...props}
        />

        {onReset && focused && (
          <button onClick={handleClick}>
            <Icon name="cancel" size={20} />
          </button>
        )}
      </div>

      {bottomText && (
        <Txt name="body-2" className={error ? 'text-txt-error' : 'text-txt-black-tertiary'}>
          {bottomText}
        </Txt>
      )}
    </div>
  );
});
