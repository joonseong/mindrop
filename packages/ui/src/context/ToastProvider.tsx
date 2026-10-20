'use client';

import { ReactNode, createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

import { Toast } from '../components/Toast';

interface ToastOptions {
  duration: number;
  placement: 'bottom' | 'top';
  offset: number;
}

const DEFAULT_OPTION: ToastOptions = {
  duration: 3000,
  placement: 'bottom',
  offset: 48,
};

export const ToastContext = createContext<{
  open: (_message: string, _options?: Partial<ToastOptions>) => void;
}>({
  open: () => undefined,
});

export function ToastProvider({
  options = DEFAULT_OPTION,
  children,
}: {
  options?: Partial<ToastOptions>;
  children: ReactNode;
}) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nextToastRef = useRef<{ message: string; options: ToastOptions } | null>(null);
  const [toast, setToast] = useState<{ message: string; options: ToastOptions; key: string } | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const defaultOptions: ToastOptions = useMemo(
    () => ({
      ...DEFAULT_OPTION,
      ...options,
    }),
    [options],
  );

  const handleShowToast = useCallback((message: string, options: ToastOptions) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setToast({ message, options, key: Date.now().toString() });
    setIsOpen(true);

    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, options.duration);
  }, []);

  const handleExited = useCallback(() => {
    setToast(null);

    setTimeout(() => {
      if (nextToastRef.current) {
        const { message, options } = nextToastRef.current;
        nextToastRef.current = null;

        handleShowToast(message, options);
      }
    }, 0);
  }, [handleShowToast]);

  const open = useCallback(
    (message: string, toastOptions?: Partial<ToastOptions>) => {
      const options = { ...defaultOptions, ...toastOptions };

      if (isOpen) {
        nextToastRef.current = { message, options };
        setIsOpen(false);
      } else {
        handleShowToast(message, options);
      }
    },
    [isOpen, handleShowToast, defaultOptions],
  );

  return (
    <ToastContext.Provider value={{ open }}>
      {children}
      {toast ? (
        <Toast
          isOpen={isOpen}
          placement={toast.options.placement}
          offset={toast.options.offset}
          onExited={handleExited}
        >
          {toast.message}
        </Toast>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast는 ToastProvider 내부에서 사용해야 합니다.');
  }

  return context.open;
}
