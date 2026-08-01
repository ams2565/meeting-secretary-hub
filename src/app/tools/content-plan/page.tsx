"use client";

import Link from "next/link";
import { useState } from "react";
import { ChatPanel } from "@/components/ChatPanel";
import { streamFetch } from "@/lib/streamFetch";
import type { ChatMessage } from "@/lib/chat";

export default function ContentPlanPage() {
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
      const result = await streamFetch("/api/content-plan", { messages: nextMessages }, (acc) => {
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
          <Link href="/dept/social" className="text-sm text-neutral-400 hover:text-neutral-200">
            ← 소셜·콘텐츠
          </Link>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">Content Strategy</h1>
          <p className="mt-1 text-neutral-400">
            제품/서비스를 이야기해주세요. 대화하면서 한 달치 콘텐츠 계획안을 함께 다듬어갑니다.
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
          placeholder="예: 회의록을 자동으로 요약해주는 SaaS 서비스, 타겟은 스타트업 팀장급, 채널은 블로그·링크드인"
          sendButtonClass="bg-indigo-500 hover:bg-indigo-400"
          assistantRingClass="ring-indigo-500/20"
        />
      </main>
    </div>
  );
}
