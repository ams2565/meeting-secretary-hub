"use client";

import Link from "next/link";
import { useState } from "react";
import { ChatPanel } from "@/components/ChatPanel";
import { streamFetch } from "@/lib/streamFetch";
import type { ChatMessage } from "@/lib/chat";

export default function TasteSkillPage() {
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
      const result = await streamFetch("/api/taste-skill", { messages: nextMessages }, (acc) => {
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
          <Link href="/dept/design" className="text-sm text-neutral-400 hover:text-neutral-200">
            ← 디자인
          </Link>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">Taste Skill</h1>
          <p className="mt-1 text-neutral-400">
            지금 있는 화면 설명이나 코드를 이야기해주세요. 대화하면서 왜 뻔해 보이는지 짚어드리고 함께 개선해갑니다.
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
          placeholder="예: 보라색-파란색 그라데이션 배경에 흰색 카드 3개가 나란히 있는 가격 섹션. 어디서 본 것 같은 느낌이 듦"
          sendButtonClass="bg-purple-500 hover:bg-purple-400"
          assistantRingClass="ring-purple-500/20"
        />
      </main>
    </div>
  );
}
