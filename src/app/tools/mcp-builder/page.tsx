"use client";

import Link from "next/link";
import { useState } from "react";
import { ChatPanel } from "@/components/ChatPanel";
import { streamFetch } from "@/lib/streamFetch";
import type { ChatMessage } from "@/lib/chat";

export default function McpBuilderPage() {
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
      const result = await streamFetch("/api/mcp-builder", { messages: nextMessages }, (acc) => {
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
          <Link href="/dept/dev" className="text-sm text-neutral-400 hover:text-neutral-200">
            ← 개발
          </Link>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">MCP Builder</h1>
          <p className="mt-1 text-neutral-400">
            연결하고 싶은 외부 서비스를 이야기해주세요. 대화하면서 MCP 서버 스캐폴드 코드를 함께 완성해갑니다.
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
          placeholder="예: 사내 고객 티켓 시스템 — 티켓 조회, 상태 변경, 댓글 추가 기능이 있는 REST API"
          sendButtonClass="bg-orange-500 hover:bg-orange-400"
          assistantRingClass="ring-orange-500/20"
        />
      </main>
    </div>
  );
}
