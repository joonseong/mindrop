'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Button, Txt } from '@repo/ui';

import { requestPushPermission } from '@/lib/client/bridge';
import { postJson, readNdjson, trackClient } from '@/lib/client/ndjson';
import { estimateMinutes, parseDropText } from '@/lib/drop-format';
import type { Course, Drop, DropBody, ExplainAnswer, Level, User } from '@/lib/types';

import { TopBar } from './TopBar';

type StreamEv =
  | { type: 'status'; message: string }
  | { type: 'text'; delta: string }
  | { type: 'retry' }
  | { type: 'done' | 'ready' | 'corrected'; drop: Drop }
  | { type: 'refused' }
  | { type: 'error'; message: string };

type Phase = 'generating' | 'ready' | 'failed' | 'refused';
type Panel = null | 'notify' | 'signup' | 'dropDone' | 'courseDone';

interface CompleteResult {
  firstEver: boolean;
  courseCompleted: boolean;
  nextDropId?: string;
  askNotify: boolean;
}

const SECTION_LABEL: Partial<Record<keyof DropBody, string>> = {
  concept: '핵심 개념',
  example: '예를 들면',
  connection: '이어서 생각하기',
};

const NEXT_LEVEL: Record<Level, Level> = { beginner: 'some', some: 'advanced', advanced: 'advanced' };

export function DropView(props: {
  initialDrop: Drop;
  course: Course;
  total: number;
  nextTitle?: string;
  prefetchId?: string;
  canRegenerate: boolean;
  isAnon: boolean;
  notifyPermission: User['notifyPermission'];
  presubEnabled: boolean;
}) {
  const { course, total, nextTitle, prefetchId, canRegenerate, isAnon } = props;
  const router = useRouter();
  const [drop, setDrop] = useState<Drop>(props.initialDrop);
  const [phase, setPhase] = useState<Phase>(props.initialDrop.status === 'ready' ? 'ready' : 'generating');
  const [streamText, setStreamText] = useState('');
  const [status, setStatus] = useState('Drop을 준비하고 있어요');
  const [corrected, setCorrected] = useState(Boolean(props.initialDrop.corrected));
  const [attempt, setAttempt] = useState(0);
  const [completing, setCompleting] = useState(false);
  const [result, setResult] = useState<CompleteResult | null>(null);
  const [panel, setPanel] = useState<Panel>(null);
  const [reported, setReported] = useState(Boolean(props.initialDrop.reportedAt));
  const started = useRef(-1);
  const ttfdSent = useRef(false);
  const sentinel = useRef<HTMLDivElement>(null);

  // 실시간 생성 (아직 준비되지 않은 Drop)
  useEffect(() => {
    if (props.initialDrop.status === 'ready' && attempt === 0) return;
    if (started.current === attempt) return;
    started.current = attempt;
    setPhase('generating');
    setStreamText('');
    const waitStart = Date.now();

    const run = async () => {
      const res = await fetch(`/api/drops/${drop.id}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'realtime' }),
      });
      let firstText = true;
      await readNdjson<StreamEv>(res, e => {
        if (e.type === 'status') setStatus(e.message);
        if (e.type === 'retry') setStreamText('');
        if (e.type === 'text') {
          if (firstText) {
            firstText = false;
            trackClient('drop_wait', { dropId: drop.id, index: drop.index, ms: Date.now() - waitStart });
          }
          setStreamText(t => t + e.delta);
        }
        if (e.type === 'done' || e.type === 'ready') {
          setDrop(e.drop);
          setPhase('ready');
        }
        if (e.type === 'corrected') {
          setDrop(e.drop);
          setCorrected(true);
        }
        if (e.type === 'refused') setPhase('refused');
        if (e.type === 'error') setPhase(p => (p === 'ready' ? p : 'failed'));
      });
    };
    run().catch(() => setPhase(p => (p === 'ready' ? p : 'failed')));
  }, [attempt, drop.id, drop.index, props.initialDrop.status]);

  // 알림을 탭해 들어온 경우 (앱 껍데기가 ?from=push를 붙인다)
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('from') === 'push') {
      trackClient('push_opened', { dropId: drop.id });
    }
  }, [drop.id]);

  // 첫날 2번 Drop 미리 생성 (응답은 기다리지 않는다)
  useEffect(() => {
    if (!prefetchId) return;
    void fetch(`/api/drops/${prefetchId}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: 'prefetch' }),
    }).catch(() => undefined);
  }, [prefetchId]);

  const body: Partial<DropBody> = phase === 'ready' && drop.body ? drop.body : parseDropText(streamText);

  // Time to First Drop: 수준 선택 완료 → 첫 문단 표시 (PRD §19.2)
  useEffect(() => {
    if (ttfdSent.current || drop.index !== 0 || !body.hook) return;
    const start = Number(sessionStorage.getItem('ttfd_start'));
    if (!start) return;
    ttfdSent.current = true;
    sessionStorage.removeItem('ttfd_start');
    trackClient('ttfd', { ms: Date.now() - start, courseId: course.id });
  }, [body.hook, course.id, drop.index]);

  // 끝까지 스크롤 → drop_read
  useEffect(() => {
    if (phase !== 'ready' || !sentinel.current) return;
    const observer = new IntersectionObserver(entries => {
      if (entries.some(e => e.isIntersecting)) {
        void postJson(`/api/drops/${drop.id}/read`);
        observer.disconnect();
      }
    });
    observer.observe(sentinel.current);
    return () => observer.disconnect();
  }, [phase, drop.id]);

  const afterNotify = useCallback(
    (r: CompleteResult) => {
      if (isAnon && r.firstEver) setPanel('signup');
      else setPanel(r.courseCompleted ? 'courseDone' : 'dropDone');
    },
    [isAnon],
  );

  const complete = async (signal: 'understood' | 'confused') => {
    if (completing) return;
    setCompleting(true);
    const res = await postJson<CompleteResult>(`/api/drops/${drop.id}/complete`, { signal });
    setCompleting(false);
    if (!res.ok) return;
    setDrop(d => ({ ...d, signal, completedAt: d.completedAt ?? new Date().toISOString() }));
    setResult(res.data);
    if (res.data.askNotify) {
      setPanel('notify');
      trackClient('notify_prompt_view');
    } else afterNotify(res.data);
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const showMeta = phase === 'ready';
  const streaming = phase === 'generating';
  const sections: (keyof DropBody)[] = ['concept', 'example', 'connection'];
  const lastSection = (['hook', 'concept', 'example', 'connection', 'takeaway'] as (keyof DropBody)[])
    .filter(k => body[k])
    .pop();

  return (
    <>
      <TopBar title={`${course.title}`} close="/today" />
      <main className="flex flex-1 flex-col px-5 pb-10">
        <div className="flex items-center justify-between">
          <Txt name="caption-1" className="text-txt-point">
            Drop {drop.index + 1} / {total}
            {showMeta ? ` · ${estimateMinutes(drop.body)}분` : ''}
          </Txt>
          {canRegenerate && drop.index === 0 && !drop.completedAt ? (
            <Link
              href={`/course/new?regenerate=${course.id}&topic=${encodeURIComponent(course.topic)}`}
              className="text-[13px] text-txt-black-tertiary underline"
            >
              코스 다시 만들기
            </Link>
          ) : null}
        </div>
        <Txt name="display-2" as="h1" className="mt-1">
          {drop.title}
        </Txt>

        {corrected ? (
          <div className="mt-4 rounded-xl bg-shape-depth1 px-4 py-3">
            <Txt name="caption-1" className="text-txt-black-secondary">
              내용을 고쳤어요. 근거와 다른 부분을 찾아 바로잡았어요.
            </Txt>
          </div>
        ) : null}

        {phase === 'generating' && !body.hook ? (
          <div className="mt-8 flex items-center gap-3">
            <span className="h-2 w-2 animate-pulse rounded-full bg-shape-brand" />
            <Txt name="body-2" className="text-txt-black-tertiary">
              {status}
            </Txt>
          </div>
        ) : null}

        {phase === 'failed' ? (
          <div className="mt-10 flex flex-col gap-2">
            <Txt name="body-2" className="mb-2 text-center text-txt-black-secondary">
              Drop을 만들지 못했어요.
            </Txt>
            <Button variant="primary" size={56} onClick={() => setAttempt(a => a + 1)}>
              다시 만들기
            </Button>
            <Button variant="secondary" size={56} onClick={() => router.push('/today')}>
              내일 읽기
            </Button>
          </div>
        ) : null}

        {phase === 'refused' ? (
          <div className="mt-10 rounded-2xl bg-shape-depth1 p-5">
            <Txt name="body-2">이 내용은 미니커버리에서 다룰 수 없어요. 다른 주제로 시작해 보세요.</Txt>
            <Button variant="primary" size={48} className="mt-4" onClick={() => router.push('/start')}>
              다른 주제 찾기
            </Button>
          </div>
        ) : null}

        {body.hook ? (
          <article className="mt-6 flex flex-col gap-7">
            <Txt
              name="body-1"
              className={`whitespace-pre-line text-[17px] font-semibold leading-[30px] ${streaming && lastSection === 'hook' ? 'streaming-caret' : ''}`}
            >
              {body.hook}
            </Txt>
            {sections.map(key =>
              body[key] ? (
                <section key={key} className="animate-fade-in">
                  <Txt name="caption-1" className="mb-1.5 text-txt-black-tertiary">
                    {SECTION_LABEL[key]}
                  </Txt>
                  <Txt
                    name="viewer-s"
                    className={`whitespace-pre-line text-txt-black-primary ${streaming && lastSection === key ? 'streaming-caret' : ''}`}
                  >
                    {body[key]}
                  </Txt>
                </section>
              ) : null,
            )}
            {body.takeaway ? (
              <section className="animate-fade-in rounded-2xl bg-shape-depth1 px-5 py-4">
                <Txt name="caption-1" className="mb-1 text-txt-point">
                  한 문장으로
                </Txt>
                <Txt name="title-1" className={streaming ? 'streaming-caret' : ''}>
                  {body.takeaway}
                </Txt>
              </section>
            ) : null}
          </article>
        ) : null}

        {showMeta ? (
          <>
            <section className="mt-8">
              <Txt name="caption-1" className="text-txt-black-tertiary">
                출처 · 더 알아보기
              </Txt>
              <ul className="mt-2 flex flex-col gap-1.5">
                {drop.sources.map(s => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel="noreferrer" className="text-sm text-txt-link underline">
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
              {drop.sources.length < 2 ? (
                <Txt name="caption-1" className="mt-2 text-txt-black-tertiary">
                  출처가 적은 주제예요.
                </Txt>
              ) : null}
              <div className="mt-4 flex items-center justify-between">
                <Txt name="caption-1" className="text-txt-black-tertiary">
                  AI가 만든 콘텐츠예요
                </Txt>
                <button
                  disabled={reported}
                  onClick={() => {
                    setReported(true);
                    void postJson(`/api/drops/${drop.id}/report`);
                  }}
                  className="text-[13px] text-txt-black-tertiary underline disabled:no-underline"
                >
                  {reported ? '알려 주셔서 고마워요' : '내용이 이상해요'}
                </button>
              </div>
            </section>
            <div ref={sentinel} />

            {!result ? (
              <section className="mt-10">
                <Txt name="title-1" className="text-center">
                  {drop.completedAt ? '다시 읽은 Drop이에요' : '오늘 Drop, 어땠어요?'}
                </Txt>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Button variant="primary" size={56} disabled={completing} onClick={() => void complete('understood')}>
                    이해했어요
                  </Button>
                  <Button variant="secondary" size={56} disabled={completing} onClick={() => void complete('confused')}>
                    조금 헷갈려요
                  </Button>
                </div>
              </section>
            ) : null}

            {panel === 'notify' && result ? (
              <NotifyPrompt
                onDone={() => {
                  afterNotify(result);
                }}
              />
            ) : null}

            {panel === 'signup' && result ? (
              <PanelCard title="학습 기록을 저장할까요?" body="가입하면 다른 기기에서도 이어서 읽을 수 있어요.">
                <Button
                  variant="primary"
                  size={56}
                  onClick={() => router.push(`/signup?next=${encodeURIComponent(`/drop/${drop.id}`)}`)}
                >
                  가입하고 저장하기
                </Button>
                <Button
                  variant="secondary"
                  size={56}
                  onClick={() => setPanel(result.courseCompleted ? 'courseDone' : 'dropDone')}
                >
                  나중에
                </Button>
              </PanelCard>
            ) : null}

            {panel === 'dropDone' && result ? (
              <PanelCard title="오늘의 Drop 완료!" body={nextTitle ? `내일의 Drop: ${nextTitle}` : undefined}>
                {result.nextDropId ? (
                  <Button variant="primary" size={56} onClick={() => router.push(`/drop/${result.nextDropId}`)}>
                    다음 Drop 이어 읽기
                  </Button>
                ) : null}
                <Button variant="secondary" size={56} onClick={() => router.push('/today')}>
                  오늘은 여기까지
                </Button>
              </PanelCard>
            ) : null}

            {panel === 'courseDone' ? (
              <CourseComplete course={course} isAnon={isAnon} presubEnabled={props.presubEnabled} />
            ) : null}
          </>
        ) : null}
      </main>
    </>
  );
}

function PanelCard({ title, body, children }: { title: string; body?: string; children: React.ReactNode }) {
  return (
    <section className="mt-10 animate-fade-in rounded-3xl bg-shape-depth1 p-5">
      <Txt name="display-2">{title}</Txt>
      {body ? (
        <Txt name="body-2" className="mt-1 text-txt-black-secondary">
          {body}
        </Txt>
      ) : null}
      <div className="mt-5 flex flex-col gap-2">{children}</div>
    </section>
  );
}

function NotifyPrompt({ onDone }: { onDone: () => void }) {
  const [busy, setBusy] = useState(false);
  return (
    <PanelCard title="내일 다음 Drop이 도착하면 알려드릴까요?" body="하루 한 번, 오늘 읽은 시간쯤 알려드려요.">
      <Button
        variant="primary"
        size={56}
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          const { granted, token } = await requestPushPermission();
          await postJson('/api/me/notify', { permission: granted ? 'granted' : 'denied', pushToken: token });
          onDone();
        }}
      >
        알림 받기
      </Button>
      <Button
        variant="secondary"
        size={56}
        disabled={busy}
        onClick={async () => {
          await postJson('/api/me/notify', { permission: 'denied' });
          onDone();
        }}
      >
        나중에
      </Button>
    </PanelCard>
  );
}

function CourseComplete({ course, isAnon, presubEnabled }: { course: Course; isAnon: boolean; presubEnabled: boolean }) {
  const router = useRouter();
  const [answer, setAnswer] = useState<ExplainAnswer | null>(course.explainAnswer ?? null);
  const [presubDone, setPresubDone] = useState(false);

  useEffect(() => {
    if (presubEnabled) trackClient('presub_card_view', { courseId: course.id });
  }, [presubEnabled, course.id]);

  const suggestions = [
    { topic: `${course.topic} 심화`, label: `더 깊게: ${course.topic} 심화`, level: NEXT_LEVEL[course.level] },
    ...(course.related[0] ? [{ topic: course.related[0], label: course.related[0], level: 'beginner' as Level }] : []),
  ];

  const start = (topic: string, level: Level) => {
    const q = new URLSearchParams({ topic, level, category: course.category, taskType: course.taskType });
    sessionStorage.setItem('ttfd_start', String(Date.now()));
    const target = `/course/new?${q}`;
    router.push(isAnon ? `/signup?reason=course&next=${encodeURIComponent(target)}` : target);
  };

  return (
    <section className="mt-10 animate-fade-in">
      <div className="rounded-3xl bg-shape-depth1 p-5">
        <Txt name="caption-1" className="text-txt-point">
          코스 완료
        </Txt>
        <Txt name="display-2" className="mt-1">
          {course.title}를 다 읽었어요!
        </Txt>
        <Txt name="title-2" className="mt-5">
          이제 이 주제를 남에게 대략 설명할 수 있나요?
        </Txt>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {(
            [
              ['yes', '예'],
              ['some', '조금'],
              ['not_yet', '아직'],
            ] as [ExplainAnswer, string][]
          ).map(([value, label]) => (
            <button
              key={value}
              onClick={() => {
                setAnswer(value);
                void postJson(`/api/courses/${course.id}/explain`, { answer: value });
              }}
              className={`h-11 rounded-full border text-sm ${answer === value ? 'border-border-brand bg-shape-white font-bold text-txt-point' : 'border-border-button bg-shape-white'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <Txt name="title-1" className="mt-8">
        다음엔 이걸 알아볼까요?
      </Txt>
      <div className="mt-3 flex flex-col gap-2">
        {suggestions.map(s => (
          <button
            key={s.topic}
            onClick={() => start(s.topic, s.level)}
            className="flex items-center justify-between rounded-2xl border border-border-button px-5 py-4 text-left"
          >
            <Txt name="title-2">{s.label}</Txt>
            <Txt name="caption-1" className="text-txt-point">
              시작하기
            </Txt>
          </button>
        ))}
      </div>

      {presubEnabled ? (
        <div className="mt-8 rounded-3xl bg-shape-black p-5 text-txt-white-primary">
          <Txt name="caption-1" className="text-txt-white-tertiary">
            미니커버리 Plus
          </Txt>
          <Txt name="display-2" className="mt-1">
            월 7,900원으로 코스 무제한
          </Txt>
          <ul className="mt-3 flex flex-col gap-1 text-sm text-txt-white-secondary">
            <li>· 궁금한 주제를 제한 없이 코스로</li>
            <li>· 개념을 더 깊게 파는 Deep Dive</li>
            <li>· 한 달 동안 배운 개념 리포트</li>
          </ul>
          {presubDone ? (
            <Txt name="body-2" className="mt-5 text-txt-white-secondary">
              베타 기간에는 무료예요. 출시하면 알려드릴게요.
            </Txt>
          ) : (
            <Button
              variant="primary"
              size={48}
              className="mt-5"
              onClick={() => {
                setPresubDone(true);
                void postJson('/api/me/presubscribe', { courseId: course.id });
              }}
            >
              출시하면 첫 달 50% 할인으로 구독하기 — 사전 신청
            </Button>
          )}
        </div>
      ) : null}
    </section>
  );
}
