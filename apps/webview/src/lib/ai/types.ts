import type { Level, ModelTier, Source, TaskType } from '../types';
import type { Usage } from './pricing';

export interface TopicCheck {
  status: 'ok' | 'broad' | 'blocked';
  topic: string;
  category: string;
  taskType: TaskType;
  suggestions: string[];
  message?: string;
}

export interface Curriculum {
  title: string;
  drops: string[];
  related: string[];
}

export interface CurriculumParams {
  topic: string;
  level: Level;
  isFirstCourse: boolean;
}

export interface DropParams {
  courseTitle: string;
  level: Level;
  outline: string[];
  index: number;
  learnedTitles: string[];
  model: ModelTier;
}

export interface DropOutput {
  text: string;
  sources: Source[];
  evidence: string[];
  refused: boolean;
}

export interface VerifyOutput {
  verdict: 'ok' | 'fixed' | 'conflict';
  fixedText: string;
}

export interface Metered<T> {
  result: T;
  usage: Usage;
  model: ModelTier;
}

export interface BatchItem {
  customId: string;
  params: DropParams;
}

export type BatchPoll =
  | { status: 'processing' }
  | { status: 'ended'; results: { customId: string; output?: Metered<DropOutput>; error?: string }[] };

export interface Generator {
  readonly name: 'mock' | 'claude';
  checkTopic(input: string): Promise<Metered<TopicCheck>>;
  curriculum(
    params: CurriculumParams,
    on: { title?: (title: string) => void; drop?: (title: string, index: number) => void },
  ): Promise<Metered<Curriculum>>;
  drop(params: DropParams, on: { status?: (message: string) => void; text?: (delta: string) => void }): Promise<Metered<DropOutput>>;
  verify(text: string, evidence: string[]): Promise<Metered<VerifyOutput>>;
  /** 야간 Batch 제출. mock은 즉시 처리하고 'mock-<n>' id를 돌려준다 */
  submitBatch(items: BatchItem[]): Promise<string>;
  pollBatch(batchId: string): Promise<BatchPoll>;
}
