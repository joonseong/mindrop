'use client';

import { HTMLAttributes, ReactNode, useEffect, useRef, useState } from 'react';

import { useControllableState } from '../hooks/useControllableState';
import { DialogContext, createDialogContext } from '../utils/createDialogContext';
import { twMerge } from 'tailwind-merge';

const { Provider, useContext } = createDialogContext('DROPDOWN');

export interface DropdownRootProps extends HTMLAttributes<HTMLDivElement>, Partial<DialogContext> {
  children?: ReactNode;
}

export function Root({ open: openProp, defaultOpen = false, onOpenChange, children }: DropdownRootProps) {
  const [open = false, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });

  return (
    <div className="relative inline-block">
      <Provider value={{ open, onOpenChange: setOpen }}>{children}</Provider>
    </div>
  );
}

export interface DropdownTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function Trigger({ children, ...props }: DropdownTriggerProps) {
  const { open, onOpenChange } = useContext();

  return (
    <button
      {...props}
      onClick={event => {
        props.onClick?.(event);
        onOpenChange?.(!open);
      }}
    >
      {children}
    </button>
  );
}

export interface DropdownContentProps extends HTMLAttributes<HTMLDivElement> {
  align?: 'start' | 'center' | 'end';
  offset?: number;
}

export function Content({ children, className, align = 'start', offset = 8, ...props }: DropdownContentProps) {
  const { open, onOpenChange } = useContext();
  const contentRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      setTimeout(() => {
        requestAnimationFrame(() => setVisible(true));
      }, 0);
    } else {
      setVisible(false);
    }
  }, [open]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
        onOpenChange?.(false);
      }
    }

    if (mounted) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mounted, onOpenChange]);

  const handleTransitionEnd = () => {
    if (!open && !visible) {
      setMounted(false);
    }
  };

  const getAlign = (align: DropdownContentProps['align']) => {
    switch (align) {
      case 'start':
        return 'left-0';
      case 'center':
        return 'left-1/2 -translate-x-1/2';
      case 'end':
        return 'right-0';
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div
      className={twMerge(
        'absolute z-200 will-change-opacity transition-opacity duration-150',
        visible ? 'opacity-100' : 'opacity-0',
        getAlign(align),
      )}
      style={{ marginTop: offset }}
      onTransitionEnd={handleTransitionEnd}
    >
      <div
        ref={contentRef}
        className={twMerge(
          'bg-shape-white rounded-lg p-1 min-w-[160px] border border-border-div shadow-[0_4px_8px_0_rgba(0,0,0,0.08)] transform-gpu transition-transform duration-150',
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

export interface DropdownItemProps extends HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
}

export function Item({ children, className, disabled, onClick, ...props }: DropdownItemProps) {
  const { onOpenChange } = useContext();

  return (
    <div
      role="menuitem"
      tabIndex={0}
      className={twMerge(
        'px-3 py-2 text-sm cursor-pointer select-none rounded-md',
        'hover:bg-shape-depth1 focus:bg-shape-depth1 outline-none',
        className,
      )}
      onClick={e => {
        if (disabled) {
          return;
        }

        onClick?.(e);
        onOpenChange?.(false);
      }}
      {...props}
    >
      {children}
    </div>
  );
}
