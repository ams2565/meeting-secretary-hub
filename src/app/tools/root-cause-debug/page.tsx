"use client";

import Link from "next/link";
import { useState } from "react";
import { ResultPanel } from "@/components/ResultPanel";
import { Spinner } from "@/components/Spinner";
import { streamFetch } from "@/lib/streamFetch";

export default function RootCauseDebugPage() {
  const [error, setError] = useState("");
  const [code, setCode] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setFormError("");
    setAnalysis("");

    try {
      const result = await streamFetch("/api/root-cause-debug", { error, code }, setAnalysis);
      if (!result.ok) throw new Error(result.error);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
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
          <h1 className="mt-2 text-2xl font-bold tracking-tight">Systematic Debug</h1>
          <p className="mt-1 text-neutral-400">
            에러 메시지와 관련 코드를 붙여넣으면 임시방편이 아닌 근본 원인을 찾아드립니다.
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-8 sm:px-10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="text-sm font-medium text-neutral-300">
            에러 메시지 / 증상
            <textarea
              value={error}
              onChange={(e) => setError(e.target.value)}
              placeholder="예: TypeError: Cannot read properties of undefined (reading 'map')"
              rows={4}
              className="mt-1.5 w-full rounded-xl border border-neutral-800 bg-neutral-900 p-4 text-sm font-normal text-neutral-100 placeholder:text-neutral-600 focus:border-orange-500 focus:outline-none"
            />
          </label>

          <label className="text-sm font-medium text-neutral-300">
            관련 코드 (선택)
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="에러가 발생하는 부분의 코드를 붙여넣으세요"
              rows={8}
              className="mt-1.5 w-full rounded-xl border border-neutral-800 bg-neutral-900 p-4 font-mono text-xs font-normal text-neutral-100 placeholder:text-neutral-600 focus:border-orange-500 focus:outline-none"
            />
          </label>

          <button
            type="submit"
            disabled={loading || !error.trim()}
            className="flex w-fit items-center gap-2 self-start rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading && <Spinner />}
            {loading ? "분석 중..." : "근본 원인 분석하기"}
          </button>
        </form>

        {formError && (
          <p className="mt-4 rounded-lg border border-red-900 bg-red-950/40 p-3 text-sm text-red-400">
            {formError}
          </p>
        )}

        {analysis && (
          <ResultPanel title={loading ? "실시간 분석 중..." : "분석 결과"} content={analysis} />
        )}
      </main>
    </div>
  );
}
