import { ReactNode } from 'react';

import { ICONS } from '../constants/icon';
import { Icon } from './Icon';
import { Txt } from './Txt';

export interface ErrorScreenProps {
  iconName: keyof typeof ICONS;
  title: string;
  description: ReactNode;
  /** 본문 설명 아래 중앙 보조 액션(예: 새로고침 칩). */
  middle?: ReactNode;
  /** 하단 고정 액션 버튼 영역(1~2개 세로 스택). */
  footer?: ReactNode;
}

/**
 * 서버 호출 에러 랜딩 화면의 공용 프리젠테이션 컴포넌트.
 * 아이콘 / 제목 / 설명 / (선택)보조 액션 / (선택)하단 버튼 레이아웃만 담당하며,
 * 실제 핸들러는 사용처(웹뷰 wrapper)에서 footer·middle 로 주입한다.
 */
export function ErrorScreen({ iconName, title, description, middle, footer }: ErrorScreenProps) {
  return (
    <div className="flex flex-col items-stretch h-full p-4">
      <div className="flex-1 flex flex-col items-center justify-center">
        <Icon name={iconName} size={44} />
        <Txt name="display-1" className="mt-2 mb-3">
          {title}
        </Txt>
        <Txt name="caption-1" className="text-txt-black-tertiary text-center">
          {description}
        </Txt>
        {middle ? <div className="mt-4">{middle}</div> : null}
      </div>

      {footer ? <div className="mt-auto flex flex-col gap-2">{footer}</div> : null}
    </div>
  );
}
