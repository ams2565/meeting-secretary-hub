"use client";

import Link from "next/link";
import { useState } from "react";
import { ChatPanel } from "@/components/ChatPanel";
import { CodePreviewBubble } from "@/components/CodePreviewBubble";
import { streamFetch } from "@/lib/streamFetch";
import type { ChatMessage } from "@/lib/chat";

function wrapSvg(svg: string): string {
  return `<!DOCTYPE html><html><head><style>
    html,body{margin:0;height:100%;display:flex;align-items:center;justify-content:center;background:#0a0a0a;}
    svg{max-width:100%;max-height:100%;}
  </style></head><body>${svg}</body></html>`;
}

export default function AlgorithmicArtPage() {
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
      const result = await streamFetch("/api/algorithmic-art", { messages: nextMessages }, (acc) => {
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
          <h1 className="mt-2 text-2xl font-bold tracking-tight">Algorithmic Art</h1>
          <p className="mt-1 text-neutral-400">
            원하는 분위기나 테마를 이야기해주세요. 대화하면서 코드로 만든 아트를 함께 다듬어갑니다.
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
          placeholder="예: 새벽의 파도, 기하학적 도시, 차분한 가을 숲"
          sendButtonClass="bg-purple-500 hover:bg-purple-400"
          assistantRingClass="ring-purple-500/20"
          renderAssistant={(content, index, isStreamingThis) => (
            <CodePreviewBubble
              content={content}
              index={index}
              isStreamingThis={isStreamingThis}
              codeIndices={codeIndices}
              onToggle={toggleCode}
              toggleTextClass="text-purple-400"
              sandbox=""
              wrap={wrapSvg}
              previewBg="bg-neutral-950"
            />
          )}
        />
      </main>
    </div>
  );
}
