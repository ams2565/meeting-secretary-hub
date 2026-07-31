"use client";

import Link from "next/link";
import { useState } from "react";
import { ResultPanel } from "@/components/ResultPanel";
import { Spinner } from "@/components/Spinner";
import { streamFetch } from "@/lib/streamFetch";

export default function CroPage() {
  const [copy, setCopy] = useState("");
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
      const res = await streamFetch("/api/cro", { copy, goal }, setResult);
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
          <h1 className="mt-2 text-2xl font-bold tracking-tight">CRO</h1>
          <p className="mt-1 text-neutral-400">
            페이지 카피를 붙여넣으면 방문자가 가입·구매하게 만드는 개선안을 제시합니다.
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-8 sm:px-10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="text-sm font-medium text-neutral-300">
            현재 페이지 카피
            <textarea
              value={copy}
              onChange={(e) => setCopy(e.target.value)}
              placeholder="헤드라인, 설명, CTA 버튼 문구 등 현재 페이지 텍스트를 붙여넣으세요"
              rows={8}
              className="mt-1.5 w-full rounded-xl border border-neutral-800 bg-neutral-900 p-4 text-sm font-normal text-neutral-100 placeholder:text-neutral-600 focus:border-rose-500 focus:outline-none"
            />
          </label>

          <label className="text-sm font-medium text-neutral-300">
            전환 목표 (선택)
            <input
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="예: 무료 체험 가입, 상담 신청"
              className="mt-1.5 w-full rounded-lg border border-neutral-800 bg-neutral-900 p-2.5 text-sm font-normal text-neutral-100 placeholder:text-neutral-600 focus:border-rose-500 focus:outline-none"
            />
          </label>

          <button
            type="submit"
            disabled={loading || !copy.trim()}
            className="flex w-fit items-center gap-2 self-start rounded-lg bg-rose-500 px-5 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading && <Spinner />}
            {loading ? "분석 중..." : "전환율 개선 분석하기"}
          </button>
        </form>

        {error && (
          <p className="mt-4 rounded-lg border border-red-900 bg-red-950/40 p-3 text-sm text-red-400">
            {error}
          </p>
        )}

        {result && (
          <ResultPanel title={loading ? "실시간 분석 중..." : "개선 제안"} content={result} />
        )}
      </main>
    </div>
  );
}
