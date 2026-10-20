'use client';

import { HTMLAttributes, ReactNode, useEffect, useState } from 'react';

import { twMerge } from 'tailwind-merge';

export type ToastPlacementType = 'top' | 'bottom';

export interface ToastProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  placement: ToastPlacementType;
  offset: number;
  isOpen?: boolean;
  onExited?: () => void;
}

export function Toast({
  children,
  className,
  placement,
  offset,
  isOpen = false,
  style,
  onExited,
  ...props
}: ToastProps) {
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    setVisible(isOpen);
  }, [isOpen]);

  // Toast 는 position: fixed 라 body 의 safe-area padding 을 따르지 않으므로, 노치/홈인디케이터를
  // 침범하지 않도록 inset 을 직접 더한다.
  // 이 앱은 viewport-fit=cover 를 쓰지 않아 iOS 웹뷰에서 env(safe-area-inset-*) 가 0 이다.
  // 따라서 globals.css 와 동일하게 네이티브 브리지가 주입하는 --safe-* 변수를 1순위로 쓰고
  // env() 를 폴백으로 둔다 (웹/스토리북에선 둘 다 0 → offset 만 적용).
  const placementStyle =
    placement === 'top'
      ? { top: `calc(max(var(--safe-top, 0px), env(safe-area-inset-top, 0px)) + ${offset}px)` }
      : { bottom: `calc(max(var(--safe-bottom, 0px), env(safe-area-inset-bottom, 0px)) + ${offset}px)` };

  return (
    <div
      className={twMerge(
        'fixed z-50 left-1/2 translate-x-[-50%] px-5 py-3 rounded-xl bg-[rgba(21,21,23,0.8)] text-txt-white-primary max-w-xs text-[15px] font-normal tracking-[-0.5px] text-center transition-all duration-200',
        visible
          ? 'opacity-100 translate-y-0'
          : `opacity-0 ${placement === 'bottom' ? 'translate-y-2' : '-translate-y-2'}`,
        className,
      )}
      style={{ ...placementStyle, ...style }}
      onTransitionEnd={() => {
        if (!visible) {
          onExited?.();
        }
      }}
      {...props}
    >
      {children}
    </div>
  );
}
