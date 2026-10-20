import { ReactNode } from 'react';

import { Icon } from './Icon';
import { Txt } from './Txt';
import { twMerge } from 'tailwind-merge';

export interface ChipProps {
  children: ReactNode;
  className?: string;
  /** 칩 본문 클릭 시 호출 (예: 검색어 선택) */
  onClick?: () => void;
  /** X 버튼 클릭 시 호출. 전달하면 X 버튼이 노출된다 (예: 삭제) */
  onDelete?: () => void;
  disabled?: boolean;
}

export function Chip({ children, className, onClick, onDelete, disabled }: ChipProps) {
  return (
    <span
      className={twMerge(
        'w-fit flex items-center justify-center rounded-full bg-shape-depth1 px-4 py-2.5',
        disabled ? 'text-[#7D7E8C]' : 'text-txt-black-primary',
        className,
      )}
    >
      <button onClick={onClick} disabled={disabled}>
        <Txt name="body-2" className="text-txt-black-primary">
          {children}
        </Txt>
      </button>
      {onDelete ? (
        <button className="ml-1" onClick={onDelete} disabled={disabled}>
          <Icon name="close" size={16} color="#9FA0AA" />
        </button>
      ) : null}
    </span>
  );
}
