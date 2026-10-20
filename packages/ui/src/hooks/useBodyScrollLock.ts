'use client';

import { useEffect } from 'react';

let lockCount = 0;
let savedScrollY = 0;
let previousPosition = '';
let previousTop = '';
let previousLeft = '';
let previousRight = '';
let previousWidth = '';
let previousOverflow = '';

export function useBodyScrollLock(enabled: boolean) {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') {
      return;
    }

    if (lockCount === 0) {
      const { body } = document;

      savedScrollY = window.scrollY;
      previousPosition = body.style.position;
      previousTop = body.style.top;
      previousLeft = body.style.left;
      previousRight = body.style.right;
      previousWidth = body.style.width;
      previousOverflow = body.style.overflow;

      body.style.position = 'fixed';
      body.style.top = `-${savedScrollY}px`;
      body.style.left = '0';
      body.style.right = '0';
      body.style.width = '100%';
      body.style.overflow = 'hidden';
    }

    lockCount += 1;

    return () => {
      lockCount -= 1;

      if (lockCount === 0) {
        const { body } = document;

        body.style.position = previousPosition;
        body.style.top = previousTop;
        body.style.left = previousLeft;
        body.style.right = previousRight;
        body.style.width = previousWidth;
        body.style.overflow = previousOverflow;
        window.scrollTo(0, savedScrollY);
      }
    };
  }, [enabled]);
}
