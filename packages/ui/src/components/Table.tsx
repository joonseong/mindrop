'use client';

import { HTMLAttributes, ReactNode } from 'react';

import { useControllableState } from '../hooks/useControllableState';
import { twJoin, twMerge } from 'tailwind-merge';

export interface TableRootProps extends Omit<HTMLAttributes<HTMLTableElement>, 'children'> {
  header?: ReactNode;
  body?: ReactNode;
  footer?: ReactNode;
}

export function Root({ className, header, body, footer, ...props }: TableRootProps) {
  return (
    <table className={twMerge('min-w-full table-auto border-collapse text-left', className)} {...props}>
      {header ? <thead>{header}</thead> : null}
      {body ? <tbody>{body}</tbody> : null}
      {footer}
    </table>
  );
}

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  hoverable?: boolean;
  children: ReactNode;
}

export function Row({ children, className, hoverable, ...props }: TableRowProps) {
  return (
    <tr
      className={twMerge(
        'border-b last:border-none',
        twJoin(hoverable ? 'hover:bg-shape-depth1 transition-colors' : undefined),
        className,
      )}
      {...props}
    >
      {children}
    </tr>
  );
}

export interface TableHCellProps extends HTMLAttributes<HTMLTableCellElement> {
  rightAddon?: ReactNode;
  children: ReactNode;
}

export function HCell({ rightAddon, children, className, ...props }: TableHCellProps) {
  return (
    <th
      className={twMerge(
        'group p-3 bg-shape-depth1 border-b border-border-div text-txt-black-tertiary font-[500] text-[14px] leading-[22px]',
        className,
      )}
      {...props}
    >
      <div className="flex justify-between items-center gap-2 group-[&:not(:last-child)]:border-r border-r-border-div">
        {children}
        {rightAddon}
      </div>
    </th>
  );
}

export interface TableCellProps extends HTMLAttributes<HTMLTableCellElement> {
  children: ReactNode;
}

export function Cell({ children, className, ...props }: TableCellProps) {
  return (
    <td
      className={twMerge('p-3 border-b border-border-div text-[#3F4047] text-[14px] leading-[22px]', className)}
      {...props}
    >
      {children}
    </td>
  );
}

export type TableSortAddonValueType = 'ASC' | 'DESC' | null;

export interface TableSortAddonProps
  extends Omit<HTMLAttributes<HTMLButtonElement>, 'children' | 'defaultValue' | 'onChange'> {
  defaultValue?: TableSortAddonValueType;
  value?: TableSortAddonValueType;
  onChange?: (_value?: TableSortAddonValueType) => void;
  disabled?: boolean;
}

export function SortAddon({ className, defaultValue = null, value, onChange, ...props }: TableSortAddonProps) {
  const [sort, setSort] = useControllableState({
    prop: value,
    defaultProp: defaultValue,
    onChange,
  });

  const getIconProps = (target: TableSortAddonValueType) =>
    sort === target ? { fill: '#20967A' } : { fill: 'black', fillOpacity: 0.25 };

  return (
    <button
      className={twMerge('cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed', className)}
      onClick={() => {
        if (sort === 'ASC') {
          setSort('DESC');
        } else if (sort === 'DESC') {
          setSort(null);
        } else {
          setSort('ASC');
        }
      }}
      {...props}
    >
      <svg width="11" height="22" viewBox="0 0 11 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M9.46854 9.0625H1.53146C1.2934 9.0625 1.16047 8.81114 1.3079 8.63954L5.27644 4.03778C5.39003 3.90606 5.60876 3.90606 5.72356 4.03778L9.6921 8.63954C9.83953 8.81114 9.7066 9.0625 9.46854 9.0625Z"
          {...getIconProps('ASC')}
        />
        <path
          d="M9.6921 12.3619L5.72356 16.9637C5.60997 17.0954 5.39124 17.0954 5.27644 16.9637L1.3079 12.3619C1.16047 12.1903 1.2934 11.939 1.53146 11.939H9.46854C9.7066 11.939 9.83953 12.1903 9.6921 12.3619Z"
          {...getIconProps('DESC')}
        />
      </svg>
    </button>
  );
}
