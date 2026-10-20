'use client';

import { HTMLAttributes, ReactNode, useEffect, useRef, useState } from 'react';

import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import { useControllableState } from '../hooks/useControllableState';
import { DialogContext, createDialogContext } from '../utils/createDialogContext';
import { twMerge } from 'tailwind-merge';

const { Provider, useContext } = createDialogContext('MODAL');

export interface ModalRootProps extends HTMLAttributes<HTMLDivElement>, Partial<DialogContext> {
  children?: ReactNode;
}

export function Root({ open: openProp, defaultOpen = false, onOpenChange, onExited, children }: ModalRootProps) {
  const [open = false, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });

  return <Provider value={{ open, onOpenChange: setOpen, onExited }}>{children}</Provider>;
}

export interface ModalTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function Trigger({ children, ...props }: ModalTriggerProps) {
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

export interface ModalCloseProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Close({ children, className, ...props }: ModalCloseProps) {
  const { onOpenChange } = useContext();

  return (
    <div className={twMerge('contents', className)} onClick={() => onOpenChange?.(false)} {...props}>
      {children}
    </div>
  );
}

export interface ModalContentProps extends HTMLAttributes<HTMLDivElement> {
  closeOnOutsideClick?: boolean;
}

export function Content({ closeOnOutsideClick = true, children, className, ...props }: ModalContentProps) {
  const { open, onOpenChange, onExited } = useContext();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
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
        `fixed inset-0 z-[200] flex justify-center items-center px-4 will-change-opacity transition-opacity duration-200`,
        visible ? 'opacity-100' : 'opacity-0',
      )}
      onTransitionEnd={handleTransitionEnd}
    >
      <div
        className="absolute inset-0 bg-shape-black opacity-70"
        onClick={() => {
          if (closeOnOutsideClick) {
            onOpenChange?.(false);
          }
        }}
      />
      <div
        className={twMerge(
          `bg-shape-white z-[201] relative overflow-auto w-full max-w-[min(92vw,616px)] max-h-[calc(100vh-8rem)] px-4 pt-6 pb-4 rounded-3xl transform-gpu transition-transform duration-200`,
          visible ? 'scale-100' : 'scale-95',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}
