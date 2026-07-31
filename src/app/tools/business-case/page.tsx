"use client";

import Link from "next/link";
import { useState } from "react";
import { ResultPanel } from "@/components/ResultPanel";
import { Spinner } from "@/components/Spinner";
import { streamFetch } from "@/lib/streamFetch";

export default function BusinessCasePage() {
  const [idea, setIdea] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult("");

    try {
      const res = await streamFetch("/api/business-case", { idea }, setResult);
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
          <Link href="/dept/ops" className="text-sm text-neutral-400 hover:text-neutral-200">
            ← 운영
          </Link>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">Business Case</h1>
          <p className="mt-1 text-neutral-400">
            사업 아이디어를 입력하면 비용·수익·리스크를 분석한 타당성 검토 보고서를 만들어드립니다.
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-8 sm:px-10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="예: 소규모 카페를 위한 재고관리 자동화 앱, 월 3만원 구독"
            rows={5}
            className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-4 text-sm text-neutral-100 placeholder:text-neutral-600 focus:border-emerald-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading || !idea.trim()}
            className="flex w-fit items-center gap-2 self-start rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading && <Spinner />}
            {loading ? "분석 중..." : "타당성 분석하기"}
          </button>
        </form>

        {error && (
          <p className="mt-4 rounded-lg border border-red-900 bg-red-950/40 p-3 text-sm text-red-400">
            {error}
          </p>
        )}

        {result && (
          <ResultPanel title={loading ? "실시간 분석 중..." : "타당성 검토 보고서"} content={result} />
        )}
      </main>
    </div>
  );
}
