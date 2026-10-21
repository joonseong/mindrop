import { LevelScreen } from '@/components/screens/LevelScreen';

export default function LevelPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  return (
    <LevelScreen
      topic={searchParams.topic ?? ''}
      category={searchParams.category ?? '라이프스타일'}
      taskType={searchParams.taskType ?? 'hobby'}
      replace={searchParams.replace === '1'}
    />
  );
}
