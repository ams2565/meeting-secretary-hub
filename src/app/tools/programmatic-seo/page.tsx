"use client";

import Link from "next/link";
import { useState } from "react";
import { ResultPanel } from "@/components/ResultPanel";
import { Spinner } from "@/components/Spinner";
import { streamFetch } from "@/lib/streamFetch";

export default function ProgrammaticSeoPage() {
  const [idea, setIdea] = useState("");
  const [dataPoints, setDataPoints] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult("");

    try {
      const res = await streamFetch("/api/programmatic-seo", { idea, dataPoints }, setResult);
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
          <h1 className="mt-2 text-2xl font-bold tracking-tight">Programmatic SEO</h1>
          <p className="mt-1 text-neutral-400">
            보유한 데이터로 대량 생성 가능한 검색 노출 페이지의 템플릿과 구조를 설계합니다.
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-8 sm:px-10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="text-sm font-medium text-neutral-300">
            만들고 싶은 페이지 유형
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="예: 도시별 배송비 안내 페이지"
              rows={3}
              className="mt-1.5 w-full rounded-xl border border-neutral-800 bg-neutral-900 p-4 text-sm font-normal text-neutral-100 placeholder:text-neutral-600 focus:border-rose-500 focus:outline-none"
            />
          </label>

          <label className="text-sm font-medium text-neutral-300">
            보유한 데이터 (선택)
            <input
              value={dataPoints}
              onChange={(e) => setDataPoints(e.target.value)}
              placeholder="예: 전국 250개 시군구별 배송비·소요일 데이터"
              className="mt-1.5 w-full rounded-lg border border-neutral-800 bg-neutral-900 p-2.5 text-sm font-normal text-neutral-100 placeholder:text-neutral-600 focus:border-rose-500 focus:outline-none"
            />
          </label>

          <button
            type="submit"
            disabled={loading || !idea.trim()}
            className="flex w-fit items-center gap-2 self-start rounded-lg bg-rose-500 px-5 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading && <Spinner />}
            {loading ? "설계 중..." : "페이지 템플릿 설계하기"}
          </button>
        </form>

        {error && (
          <p className="mt-4 rounded-lg border border-red-900 bg-red-950/40 p-3 text-sm text-red-400">
            {error}
          </p>
        )}

        {result && (
          <ResultPanel title={loading ? "실시간 설계 중..." : "프로그래매틱 SEO 템플릿"} content={result} />
        )}
      </main>
    </div>
  );
}
