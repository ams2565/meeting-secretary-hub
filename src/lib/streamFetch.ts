// Client-side helper for reading a streaming text response from one of the
// `streamText`-backed API routes. Calls `onChunk` with the accumulated text
// after every chunk so the caller can render progress live.
export async function streamFetch(
  url: string,
  body: unknown,
  onChunk: (accumulated: string) => void,
): Promise<{ ok: true; text: string } | { ok: false; error: string }> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return { ok: false, error: data.error ?? "요청에 실패했습니다." };
  }

  if (!res.body) {
    return { ok: false, error: "스트리밍 응답을 받지 못했습니다." };
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let accumulated = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    accumulated += decoder.decode(value, { stream: true });
    onChunk(accumulated);
  }
  accumulated += decoder.decode();
  onChunk(accumulated);

  return { ok: true, text: accumulated };
}
