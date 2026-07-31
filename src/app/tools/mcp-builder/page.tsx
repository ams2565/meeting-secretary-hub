"use client";

import Link from "next/link";
import { useState } from "react";
import { ResultPanel } from "@/components/ResultPanel";
import { Spinner } from "@/components/Spinner";
import { streamFetch } from "@/lib/streamFetch";

export default function McpBuilderPage() {
  const [service, setService] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult("");

    try {
      const res = await streamFetch("/api/mcp-builder", { service }, setResult);
      if (!res.ok) throw new Error(res.error);
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
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
            연결하고 싶은 외부 서비스를 설명하면 Claude와 연결하는 MCP 서버 스캐폴드 코드를 생성합니다.
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-8 sm:px-10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <textarea
            value={service}
            onChange={(e) => setService(e.target.value)}
            placeholder="예: 사내 고객 티켓 시스템 — 티켓 조회, 상태 변경, 댓글 추가 기능이 있는 REST API"
            rows={5}
            className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-4 text-sm text-neutral-100 placeholder:text-neutral-600 focus:border-orange-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading || !service.trim()}
            className="flex w-fit items-center gap-2 self-start rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading && <Spinner />}
            {loading ? "생성 중..." : "MCP 서버 코드 생성하기"}
          </button>
        </form>

        {error && (
          <p className="mt-4 rounded-lg border border-red-900 bg-red-950/40 p-3 text-sm text-red-400">
            {error}
          </p>
        )}

        {result && (
          <ResultPanel title={loading ? "실시간 생성 중..." : "MCP 서버 스캐폴드"} content={result} />
        )}
      </main>
    </div>
  );
}
