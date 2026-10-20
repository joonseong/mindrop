export type Level = 'beginner' | 'some' | 'advanced';
export type TaskType = 'work' | 'hobby';
export type UnderstandingSignal = 'understood' | 'confused';
export type ExplainAnswer = 'yes' | 'some' | 'not_yet';
export type GenerationMode = 'realtime' | 'prefetch' | 'batch';
export type ModelTier = 'opus' | 'sonnet' | 'haiku';

export const LEVEL_LABEL: Record<Level, string> = {
  beginner: '처음이에요',
  some: '조금 알아요',
  advanced: '꽤 알아요',
};

export interface User {
  id: string;
  anon: boolean;
  email?: string;
  nickname?: string;
  /** scrypt 'salt:hash' (Supabase Auth로 옮기기 전 MVP용) */
  passwordHash?: string;
  createdAt: string;
  /** 'HH:mm' KST. 비어 있으면 첫 Drop을 읽은 시각 */
  notifyTime?: string;
  notifyPermission: 'unknown' | 'granted' | 'denied';
  /** 거절 후 재안내 배너를 닫은 시각 (7일간 숨김) */
  notifyBannerDismissedAt?: string;
  pushToken?: string;
  /** 사전 구독 신청 (Gate 1 지불 의향 측정) */
  presubscribedAt?: string;
}

export interface CourseOutlineItem {
  title: string;
}

export interface Course {
  id: string;
  userId: string;
  topic: string;
  title: string;
  level: Level;
  category: string;
  taskType: TaskType;
  status: 'generating' | 'active' | 'completed' | 'failed';
  outline: CourseOutlineItem[];
  /** 코스를 만들 때 함께 생성한 연결 주제 2개 → Map의 Discovered 노드 */
  related: string[];
  regenUsed: boolean;
  createdAt: string;
  completedAt?: string;
  explainAnswer?: ExplainAnswer;
  /** 마지막으로 Drop을 완료한 시각 (알림 대상 코스 고르기) */
  lastReadAt?: string;
}

export interface DropBody {
  hook: string;
  concept: string;
  example: string;
  connection?: string;
  takeaway: string;
}

export interface Source {
  url: string;
  title: string;
}

export interface Drop {
  id: string;
  courseId: string;
  userId: string;
  index: number;
  title: string;
  status: 'pending' | 'generating' | 'ready' | 'failed';
  body?: DropBody;
  sources: Source[];
  /** 병렬 검증에서 고친 경우 */
  corrected?: boolean;
  verify?: 'pending' | 'ok' | 'fixed' | 'conflict';
  mode?: GenerationMode;
  model?: ModelTier;
  generatedAt?: string;
  completedAt?: string;
  signal?: UnderstandingSignal;
  readAt?: string;
  reportedAt?: string;
  /** 야간 Batch로 생성 중일 때의 batch id */
  batchId?: string;
  /** 사실 검증에 쓰는 근거 문장 (웹 검색 인용) */
  evidence?: string[];
}

export interface UsageLog {
  id: string;
  userId: string;
  at: string;
  purpose: 'check' | 'curriculum' | 'drop' | 'verify';
  model: ModelTier;
  mode: GenerationMode;
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens: number;
  searches: number;
  costUsd: number;
}

export interface AppEvent {
  id: string;
  userId: string;
  name: string;
  props?: Record<string, unknown>;
  at: string;
}

export interface Report {
  id: string;
  userId: string;
  dropId: string;
  at: string;
}

export interface FailureLog {
  id: string;
  userId: string;
  at: string;
  stage: string;
  message: string;
}
