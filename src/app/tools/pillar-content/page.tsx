"use client";

import Link from "next/link";
import { useState } from "react";
import { ResultPanel } from "@/components/ResultPanel";
import { Spinner } from "@/components/Spinner";
import { streamFetch } from "@/lib/streamFetch";

export default function PillarContentPage() {
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult("");

    try {
      const res = await streamFetch("/api/pillar-content", { topic, audience }, setResult);
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
          <Link href="/dept/social" className="text-sm text-neutral-400 hover:text-neutral-200">
            ← 소셜·콘텐츠
          </Link>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">Pillar Content</h1>
          <p className="mt-1 text-neutral-400">
            핵심 주제를 입력하면 검색 권위를 잡기 위한 필러 페이지와 클러스터 콘텐츠 구조를 설계합니다.
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-8 sm:px-10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="text-sm font-medium text-neutral-300">
            핵심 주제
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="예: 회의록 자동화"
              className="mt-1.5 w-full rounded-lg border border-neutral-800 bg-neutral-900 p-2.5 text-sm font-normal text-neutral-100 placeholder:text-neutral-600 focus:border-indigo-500 focus:outline-none"
            />
          </label>

          <label className="text-sm font-medium text-neutral-300">
            타겟 독자 (선택)
            <input
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="예: 스타트업 팀장급"
              className="mt-1.5 w-full rounded-lg border border-neutral-800 bg-neutral-900 p-2.5 text-sm font-normal text-neutral-100 placeholder:text-neutral-600 focus:border-indigo-500 focus:outline-none"
            />
          </label>

          <button
            type="submit"
            disabled={loading || !topic.trim()}
            className="flex w-fit items-center gap-2 self-start rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading && <Spinner />}
            {loading ? "설계 중..." : "콘텐츠 구조 설계하기"}
          </button>
        </form>

        {error && (
          <p className="mt-4 rounded-lg border border-red-900 bg-red-950/40 p-3 text-sm text-red-400">
            {error}
          </p>
        )}

        {result && (
          <ResultPanel title={loading ? "실시간 설계 중..." : "필러 콘텐츠 구조"} content={result} />
        )}
      </main>
    </div>
  );
}
