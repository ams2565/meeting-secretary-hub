"use client";

import Link from "next/link";
import { useState } from "react";
import { ResultPanel } from "@/components/ResultPanel";
import { Spinner } from "@/components/Spinner";
import { streamFetch } from "@/lib/streamFetch";

export default function AiSeoPage() {
  const [topic, setTopic] = useState("");
  const [content, setContent] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult("");

    try {
      const res = await streamFetch("/api/ai-seo", { topic, content }, setResult);
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
          <Link href="/dept/marketing" className="text-sm text-neutral-400 hover:text-neutral-200">
            ← 마케팅
          </Link>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">AI SEO</h1>
          <p className="mt-1 text-neutral-400">
            주제나 기존 콘텐츠를 입력하면 ChatGPT·Perplexity 같은 AI 검색에 인용되기 좋은 구조로 개선합니다.
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-8 sm:px-10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="text-sm font-medium text-neutral-300">
            주제
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="예: 회의록 자동화 도구 선택 기준"
              className="mt-1.5 w-full rounded-lg border border-neutral-800 bg-neutral-900 p-2.5 text-sm font-normal text-neutral-100 placeholder:text-neutral-600 focus:border-rose-500 focus:outline-none"
            />
          </label>

          <label className="text-sm font-medium text-neutral-300">
            기존 콘텐츠 (선택)
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="개선하고 싶은 기존 글이 있다면 붙여넣으세요"
              rows={6}
              className="mt-1.5 w-full rounded-xl border border-neutral-800 bg-neutral-900 p-4 text-sm font-normal text-neutral-100 placeholder:text-neutral-600 focus:border-rose-500 focus:outline-none"
            />
          </label>

          <button
            type="submit"
            disabled={loading || !topic.trim()}
            className="flex w-fit items-center gap-2 self-start rounded-lg bg-rose-500 px-5 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading && <Spinner />}
            {loading ? "분석 중..." : "AI 검색 최적화하기"}
          </button>
        </form>

        {error && (
          <p className="mt-4 rounded-lg border border-red-900 bg-red-950/40 p-3 text-sm text-red-400">
            {error}
          </p>
        )}

        {result && (
          <ResultPanel title={loading ? "실시간 분석 중..." : "AI 검색 최적화 결과"} content={result} />
        )}
      </main>
    </div>
  );
}
