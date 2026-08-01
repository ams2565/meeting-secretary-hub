"use client";

import Link from "next/link";
import { useState } from "react";
import { ChatPanel } from "@/components/ChatPanel";
import { streamFetch } from "@/lib/streamFetch";
import type { ChatMessage } from "@/lib/chat";

export default function LaunchRunbookPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages([...nextMessages, { role: "assistant", content: "" }]);
    setInput("");
    setLoading(true);
    setError("");

    try {
      const result = await streamFetch("/api/launch-runbook", { messages: nextMessages }, (acc) => {
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

  return (
    <div className="flex flex-1 flex-col bg-neutral-950">
      <header className="border-b border-neutral-800 px-6 py-8 sm:px-10">
        <div className="mx-auto max-w-3xl">
          <Link href="/dept/ops" className="text-sm text-neutral-400 hover:text-neutral-200">
            ← 운영
          </Link>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">Launch Runbook</h1>
          <p className="mt-1 text-neutral-400">
            출시할 제품/기능을 이야기해주세요. 대화하면서 체크리스트와 롤백 기준까지 담은 출시 런북을 함께 완성해갑니다.
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
          placeholder="예: 회의비서팀 신규 기능 '이메일 초안 자동 발송' 출시. 기존 사용자 전체 대상, 다음 주 화요일 오전 배포"
          sendButtonClass="bg-lime-500 hover:bg-lime-400"
          assistantRingClass="ring-lime-500/20"
        />
      </main>
    </div>
  );
}
