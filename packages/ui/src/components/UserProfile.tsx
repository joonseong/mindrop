import { Icon } from './Icon';
import { Txt } from './Txt';
export type Grade = 'BEGINNER' | 'NOVICE' | 'INTERMEDIATE' | 'ADVANCED' | 'MASTER' | 'LEGENDARY';
import { twMerge } from 'tailwind-merge';

export type UserProfileSizeType = 20 | 28;

export interface UserProfileProps {
  size: UserProfileSizeType;
  nickname: string;
  grade: Grade;
}

export function UserProfile({ size, nickname, grade }: UserProfileProps) {
  const wrapperClassName = { 20: 'gap-0.5', 28: 'gap-1' };
  const textType = { 20: 'title-2', 28: 'display-2' } as const;
  const textColorClassName: Record<Grade, string> = {
    BEGINNER: 'text-[#151517]',
    NOVICE: 'text-[#2140AE]',
    INTERMEDIATE: 'text-[#6833AA]',
    ADVANCED: 'text-[#BFA032]',
    MASTER: 'text-[#18715B]',
    LEGENDARY: 'from-[#20967A] to-[#2C55E8] bg-gradient-to-br bg-clip-text text-transparent',
  };

  return (
    <div className={twMerge('flex items-center', wrapperClassName[size])}>
      <Txt name={textType[size]} className={textColorClassName[grade]}>
        {nickname}
      </Txt>
      <Icon name={grade.toLowerCase() as Lowercase<Grade>} size={20} />
    </div>
  );
}
