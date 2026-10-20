'use client';

import { ComponentProps } from 'react';

import { useControllableState } from '../hooks/useControllableState';
import { getPaginationItems } from '../utils/getPaginationItems';
import { Icon } from './Icon';
import { twJoin, twMerge } from 'tailwind-merge';

export interface PaginationProps extends Omit<ComponentProps<'nav'>, 'children'> {
  totalPages: number;
  defaultPage?: number;
  page?: number;
  siblings?: number;
  onPageChange?: (_page: number) => void;
}

export function Pagination({
  totalPages,
  defaultPage = 1,
  page: pageProp,
  siblings = 1,
  onPageChange,
  className,
  ...props
}: PaginationProps) {
  const [page, setPage] = useControllableState({
    prop: pageProp,
    defaultProp: defaultPage,
    onChange: onPageChange,
  });

  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={twMerge('flex justify-center w-full mx-auto', className)}
      {...props}
    >
      <ul className="flex items-center gap-3 h-8">
        <button
          className={twJoin(
            'grid place-items-center size-8 rounded-[4px] bg-shape-white border border-border-button rotate-180',
            page <= 1 ? 'cursor-not-allowed' : undefined,
          )}
          disabled={page <= 1}
          onClick={() => setPage(prev => prev - 1)}
        >
          <Icon name="arrow" size={16} />
        </button>

        {getPaginationItems({ totalPages, page, siblings }).map((item, index) => {
          if (item === 'ellipsis') {
            return (
              <span aria-hidden className="flex items-center justify-center w-8 h-5" key={`${item}-${index}`}>
                ...
              </span>
            );
          } else {
            return (
              <button
                className={twMerge(
                  'flex justify-center items-center w-8 h-5',
                  item === page ? 'text-txt-point font-bold' : 'text-txt-black-secondary',
                )}
                key={`${item}-${index}`}
                onClick={() => setPage(item)}
              >
                {item}
              </button>
            );
          }
        })}

        <button
          className={twJoin(
            'grid place-items-center size-8 rounded-[4px] bg-shape-white border border-border-button',
            page >= totalPages ? 'cursor-not-allowed' : undefined,
          )}
          disabled={page >= totalPages}
          onClick={() => setPage(prev => prev + 1)}
        >
          <Icon name="arrow" size={16} />
        </button>
      </ul>
    </nav>
  );
}
