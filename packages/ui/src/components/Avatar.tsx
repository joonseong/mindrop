'use client';

import {
  ImgHTMLAttributes,
  ReactNode,
  SVGAttributes,
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';

import { ImageLoadingStatus, useImageLoadingStatus } from '../hooks/useImageLoadingStatus';
import { twMerge } from 'tailwind-merge';

const DEFAULT_SIZE = 80;

const AvatarContext = createContext<{ status: ImageLoadingStatus; setStatus: (_status: ImageLoadingStatus) => void }>({
  status: 'idle',
  setStatus: () => {},
});

export interface AvatarRootProps {
  size?: number;
  className?: string;
  children: ReactNode;
}

export function Root({ size = DEFAULT_SIZE, className, children }: AvatarRootProps) {
  const [status, setStatus] = useState<ImageLoadingStatus>('idle');

  return (
    <AvatarContext.Provider value={{ status, setStatus }}>
      <div className={twMerge('relative rounded-full bg-shape-div', className)} style={{ width: size, height: size }}>
        {children}
      </div>
    </AvatarContext.Provider>
  );
}

export interface AvatarImageProps extends ImgHTMLAttributes<HTMLImageElement> {}

export function Img({ src, className, ...props }: AvatarImageProps) {
  const context = useContext(AvatarContext);

  if (!context) {
    throw new Error('Avatar.Img는 Avatar.Root 내부에서 사용해야 합니다.');
  }

  const status = useImageLoadingStatus(src);

  useLayoutEffect(() => {
    if (status !== 'idle') {
      context.setStatus(status);
    }
  }, [status]);

  return status === 'loaded' ? (
    <img src={src} className={twMerge('size-full rounded-full object-cover', className)} {...props} />
  ) : null;
}

export interface AvatarFallbackProps extends SVGAttributes<SVGSVGElement> {
  delayMs?: number;
}

export function Fallback({ delayMs, className, ...props }: AvatarFallbackProps) {
  const [canRender, setCanRender] = useState<boolean>(delayMs === undefined);
  const context = useContext(AvatarContext);

  if (!context) {
    throw new Error('Avatar.Fallback은 Avatar.Root 내부에서 사용해야 합니다.');
  }

  useEffect(() => {
    if (delayMs !== undefined) {
      const timeout = setTimeout(() => setCanRender(true), delayMs);
      return () => clearTimeout(timeout);
    }
  }, [delayMs]);

  return canRender && context.status !== 'loaded' ? (
    <svg
      className={twMerge('size-full', className)}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="40" cy="40" r="40" fill="#E9F5F2" />
      <path
        d="M29.3026 54H24V34.2617C24.0331 28.4889 27.2147 26 33.4784 26C36.3786 26 38.519 26.4962 40 27.5592C41.481 26.4962 43.6214 26 46.5216 26C52.7853 26 55.9669 28.4889 56 34.2617V54H50.6974V33.363C50.6974 31.3235 49.4712 30.0444 46.5216 30.0444C43.9035 30.0444 42.6441 31.3235 42.6441 33.363L42.6585 38.5758H37.3415L37.3559 33.363C37.3559 31.3235 36.0965 30.0444 33.4784 30.0444C30.5288 30.0444 29.3026 31.3235 29.3026 33.363V54Z"
        fill="#90CBBC"
      />
    </svg>
  ) : null;
}
