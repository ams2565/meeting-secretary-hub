import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const client = new Anthropic();

/**
 * Streams a Claude text response back to the client as plain text chunks.
 *
 * The first stream event is awaited before any bytes are sent to the
 * client — if the request fails immediately (bad API key, invalid params),
 * this still returns a normal JSON `{ error }` response with a proper
 * status code, matching the non-streaming routes. Only once we know the
 * request is actually underway do we commit to a 200 streaming response.
 *
 * `bufferUntilToolUse`: for routes that call a tool (e.g. web_fetch) before
 * writing the real answer, the model sometimes writes a short preamble
 * ("I'll fetch the page...") before the tool call. With `true`, any text
 * emitted before the first non-text content block is held back and
 * discarded once a tool block appears — only the text written after the
 * tool call reaches the client. If no tool is ever used, the held-back
 * text is flushed at the end as a fallback so nothing is silently lost.
 */
export async function streamText(
  params: Parameters<typeof client.messages.stream>[0],
  options?: { bufferUntilToolUse?: boolean },
): Promise<Response> {
  const anthropicStream = client.messages.stream(params);
  const iterator = anthropicStream[Symbol.asyncIterator]();

  let first: Awaited<ReturnType<typeof iterator.next>>;
  try {
    first = await iterator.next();
  } catch (err) {
    const message =
      err instanceof Anthropic.APIError
        ? `Claude API 오류: ${err.message}`
        : "생성 중 오류가 발생했습니다. ANTHROPIC_API_KEY가 설정되어 있는지 확인해주세요.";
    return NextResponse.json({ error: message }, { status: 502 });
  }

  const encoder = new TextEncoder();

  type Event = Awaited<ReturnType<typeof iterator.next>>["value"];

  function textOf(event: Event): string | null {
    if (event && event.type === "content_block_delta" && event.delta.type === "text_delta") {
      return event.delta.text;
    }
    return null;
  }

  function isNonTextBlockStart(event: Event): boolean {
    return !!event && event.type === "content_block_start" && event.content_block.type !== "text";
  }

  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      let sawToolUse = !options?.bufferUntilToolUse;
      let preamble = "";

      function handle(event: Event) {
        if (!sawToolUse) {
          if (isNonTextBlockStart(event)) {
            sawToolUse = true;
            preamble = "";
            return;
          }
          const text = textOf(event);
          if (text) preamble += text;
          return;
        }
        const text = textOf(event);
        if (text) controller.enqueue(encoder.encode(text));
      }

      try {
        if (!first.done) handle(first.value);
        while (true) {
          const { value, done } = await iterator.next();
          if (done) break;
          handle(value);
        }
        if (!sawToolUse && preamble) {
          // A tool was never called — fall back to whatever text we held
          // back rather than silently discarding the entire response.
          controller.enqueue(encoder.encode(preamble));
        }
      } catch {
        // Mid-stream failure (rare) — end the stream early with whatever
        // was produced so far rather than crashing the response.
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
