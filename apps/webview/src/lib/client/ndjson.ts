/** 서버의 NDJSON 스트림을 줄 단위 이벤트로 읽는다 */
export async function readNdjson<T = Record<string, unknown>>(
  response: Response,
  onEvent: (event: T) => void,
): Promise<void> {
  if (!response.body) return;
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let newline: number;
    while ((newline = buffer.indexOf('\n')) >= 0) {
      const line = buffer.slice(0, newline).trim();
      buffer = buffer.slice(newline + 1);
      if (line) onEvent(JSON.parse(line) as T);
    }
  }
  if (buffer.trim()) onEvent(JSON.parse(buffer) as T);
}

export async function postJson<T = unknown>(url: string, body?: unknown): Promise<{ ok: boolean; status: number; data: T }> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = (await res.json().catch(() => ({}))) as T;
  return { ok: res.ok, status: res.status, data };
}

export function trackClient(name: string, props?: Record<string, unknown>) {
  void postJson('/api/events', { name, props });
}
