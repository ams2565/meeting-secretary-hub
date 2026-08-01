"use client";

import Link from "next/link";
import { useState } from "react";
import { ChatPanel } from "@/components/ChatPanel";
import { Markdown } from "@/components/Markdown";
import { streamFetch } from "@/lib/streamFetch";
import { extractCodeBlock } from "@/lib/extractCode";
import type { ChatMessage } from "@/lib/chat";

export default function FrontendDesignPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [codeIndices, setCodeIndices] = useState<Set<number>>(new Set());

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages([...nextMessages, { role: "assistant", content: "" }]);
    setInput("");
    setLoading(true);
    setError("");

    try {
      const result = await streamFetch("/api/frontend-design", { messages: nextMessages }, (acc) => {
        setMessages([...nextMessages, { role: "assistant", content: acc }]);
      });
      if (!result.ok) throw new Error(result.error);
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
      setMessages(nextMessages);
    } finally {
      setLoading(false);
    }
  }

  function toggleCode(index: number) {
    setCodeIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  return (
    <div className="flex flex-1 flex-col bg-neutral-950">
      <header className="border-b border-neutral-800 px-6 py-8 sm:px-10">
        <div className="mx-auto max-w-3xl">
          <Link href="/dept/design" className="text-sm text-neutral-400 hover:text-neutral-200">
            ← 디자인
          </Link>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">Frontend Design</h1>
          <p className="mt-1 text-neutral-400">
            만들고 싶은 화면을 이야기해주세요. 대화하면서 화면을 함께 다듬어갑니다.
          </p>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-8 sm:px-10">
        {error && (
          <p className="mb-4 rounded-lg border border-red-900 bg-red-950/40 p-3 text-sm text-red-400">
            {error}
          </p>
        )}
        <ChatPanel
          messages={messages}
          input={input}
          onInputChange={setInput}
          onSend={handleSend}
          loading={loading}
          placeholder="예: 가격 플랜 3개를 비교하는 프라이싱 카드 섹션, 미니멀한 다크모드로"
          sendButtonClass="bg-purple-500 hover:bg-purple-400"
          assistantRingClass="ring-purple-500/20"
          renderAssistant={(content, index, isStreamingThis) => {
            const hasCode = content.includes("```");

            if (isStreamingThis || !hasCode) {
              return (
                <pre className="max-h-[500px] overflow-auto whitespace-pre-wrap text-xs text-neutral-200">
                  {isStreamingThis ? content : null}
                  {!isStreamingThis && !hasCode ? <Markdown>{content}</Markdown> : null}
                </pre>
              );
            }

            const html = extractCodeBlock(content);
            const showCode = codeIndices.has(index);

            return (
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    화면
                  </span>
                  <button
                    onClick={() => toggleCode(index)}
                    className="text-xs font-medium text-purple-400 hover:text-purple-300"
                  >
                    {showCode ? "미리보기로 전환" : "코드 보기"}
                  </button>
                </div>
                {showCode ? (
                  <pre className="max-h-[500px] overflow-auto rounded-lg border border-neutral-800 bg-neutral-950 p-3 text-xs text-neutral-100">
                    <code>{html}</code>
                  </pre>
                ) : (
                  <iframe
                    title={`미리보기 ${index}`}
                    srcDoc={html}
                    sandbox="allow-scripts"
                    className="h-[500px] w-full rounded-lg border border-neutral-800 bg-white"
                  />
                )}
              </div>
            );
          }}
        />
      </main>
    </div>
  );
}
