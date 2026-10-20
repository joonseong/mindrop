'use client';

import { HTMLAttributes, ReactNode, useEffect, useRef, useState } from 'react';

import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import { useControllableState } from '../hooks/useControllableState';
import { DialogContext, createDialogContext } from '../utils/createDialogContext';
import { Icon } from './Icon';
import { twMerge } from 'tailwind-merge';

const { Provider, useContext } = createDialogContext('BOTTOM_SHEET');

export interface BottomSheetRootProps extends HTMLAttributes<HTMLDivElement>, Partial<DialogContext> {
  children?: ReactNode;
}

export function Root({ open: openProp, defaultOpen = false, onOpenChange, onExited, children }: BottomSheetRootProps) {
  const [open = false, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });

  return <Provider value={{ open, onOpenChange: setOpen, onExited }}>{children}</Provider>;
}

export interface BottomSheetTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function Trigger({ children, ...props }: BottomSheetTriggerProps) {
  const { onOpenChange } = useContext();

  return (
    <button
      {...props}
      onClick={event => {
        props.onClick?.(event);
        onOpenChange?.(true);
      }}
    >
      {children}
    </button>
  );
}

export interface BottomSheetCloseProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Close({ children, className, ...props }: BottomSheetCloseProps) {
  const { onOpenChange } = useContext();

  return (
    <div className={twMerge('contents', className)} onClick={() => onOpenChange?.(false)} {...props}>
      {children}
    </div>
  );
}

export interface BottomSheetContentProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  closeOnOutsideClick?: boolean;
  title?: ReactNode;
}

export function Content({ closeOnOutsideClick = true, children, className, title, ...props }: BottomSheetContentProps) {
  const { open, onOpenChange, onExited } = useContext();
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(open);
  const rafIds = useRef<number[]>([]);

  useEffect(() => {
    const cancelPendingAnimationFrames = () => {
      rafIds.current.forEach(id => cancelAnimationFrame(id));
      rafIds.current = [];
    };

    cancelPendingAnimationFrames();

    if (open) {
      setMounted(true);

      // 이중으로 requestAnimationFrame을 사용하여 브라우저가 실제로 DOM을 그리도록 보장
      const firstRafId = requestAnimationFrame(() => {
        const secondRafId = requestAnimationFrame(() => {
          rafIds.current = [];
          setVisible(true);
        });
        rafIds.current = [secondRafId];
      });
      rafIds.current = [firstRafId];
    } else {
      setVisible(false);
    }

    return cancelPendingAnimationFrames;
  }, [open]);

  const handleTransitionEnd = () => {
    if (!open && !visible) {
      setMounted(false);
      onExited?.();
    }
  };

  useBodyScrollLock(mounted);

  if (!mounted) {
    return null;
  }

  return (
    <div
      className={twMerge(
        `fixed inset-0 z-[200] flex justify-center items-end will-change-opacity transition-opacity duration-200`,
        visible ? 'opacity-100' : 'opacity-0',
      )}
      onTransitionEnd={handleTransitionEnd}
    >
      <div
        className="absolute inset-0 bg-[#000000] opacity-70"
        onClick={() => {
          if (closeOnOutsideClick) {
            onOpenChange?.(false);
          }
        }}
      />
      <div
        {...props}
        className={twMerge(
          'bg-shape-white z-[201] w-full relative p-4 rounded-t-2xl transform-gpu transition-transform duration-200',
          visible ? 'translate-y-0' : 'translate-y-1/4',
          className,
        )}
      >
        <div className="flex justify-between items-center mb-4">
          <div className="text-xl font-bold tracking-[-0.5px]">{title}</div>
          <button onClick={() => onOpenChange?.(false)}>
            <Icon name="close" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
