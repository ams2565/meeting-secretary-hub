"use client";

import Link from "next/link";
import { useState } from "react";
import { ResultPanel } from "@/components/ResultPanel";
import { Spinner } from "@/components/Spinner";
import { streamFetch } from "@/lib/streamFetch";

export default function ClaudeAdsPage() {
  const [performance, setPerformance] = useState("");
  const [goal, setGoal] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult("");

    try {
      const res = await streamFetch("/api/claude-ads", { performance, goal }, setResult);
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
          <h1 className="mt-2 text-2xl font-bold tracking-tight">Claude Ads</h1>
          <p className="mt-1 text-neutral-400">
            광고 캠페인 성과 데이터를 붙여넣으면 예산·타겟팅·소재 개선 방향을 분석합니다.
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-8 sm:px-10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="text-sm font-medium text-neutral-300">
            광고 성과 데이터
            <textarea
              value={performance}
              onChange={(e) => setPerformance(e.target.value)}
              placeholder={"예: 캠페인A - 노출 50,000 / 클릭 800 / 전환 12 / 비용 40만원\n캠페인B - 노출 20,000 / 클릭 600 / 전환 25 / 비용 25만원"}
              rows={7}
              className="mt-1.5 w-full rounded-xl border border-neutral-800 bg-neutral-900 p-4 text-sm font-normal text-neutral-100 placeholder:text-neutral-600 focus:border-rose-500 focus:outline-none"
            />
          </label>

          <label className="text-sm font-medium text-neutral-300">
            목표 (선택)
            <input
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="예: 전환당 비용(CPA) 30% 낮추기"
              className="mt-1.5 w-full rounded-lg border border-neutral-800 bg-neutral-900 p-2.5 text-sm font-normal text-neutral-100 placeholder:text-neutral-600 focus:border-rose-500 focus:outline-none"
            />
          </label>

          <button
            type="submit"
            disabled={loading || !performance.trim()}
            className="flex w-fit items-center gap-2 self-start rounded-lg bg-rose-500 px-5 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading && <Spinner />}
            {loading ? "분석 중..." : "성과 분석하기"}
          </button>
        </form>

        {error && (
          <p className="mt-4 rounded-lg border border-red-900 bg-red-950/40 p-3 text-sm text-red-400">
            {error}
          </p>
        )}

        {result && (
          <ResultPanel title={loading ? "실시간 분석 중..." : "광고 성과 분석"} content={result} />
        )}
      </main>
    </div>
  );
}
