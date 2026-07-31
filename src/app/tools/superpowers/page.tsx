"use client";

import Link from "next/link";
import { useState } from "react";
import { ResultPanel } from "@/components/ResultPanel";
import { Spinner } from "@/components/Spinner";
import { streamFetch } from "@/lib/streamFetch";

export default function SuperpowersPage() {
  const [feature, setFeature] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult("");

    try {
      const res = await streamFetch("/api/superpowers", { feature }, setResult);
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
          <h1 className="mt-2 text-2xl font-bold tracking-tight">Superpowers</h1>
          <p className="mt-1 text-neutral-400">
            만들고 싶은 기능을 설명하면 코드 작성 전에 필요한 요구사항·아키텍처·작업 분해까지 담은 기술 기획서를 작성합니다.
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-8 sm:px-10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <textarea
            value={feature}
            onChange={(e) => setFeature(e.target.value)}
            placeholder="예: 사용자가 여러 명의 회의 참석자를 지정하면, 회의 후 참석자별로 맞춤 요약을 자동 발송하는 기능"
            rows={6}
            className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-4 text-sm text-neutral-100 placeholder:text-neutral-600 focus:border-orange-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading || !feature.trim()}
            className="flex w-fit items-center gap-2 self-start rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading && <Spinner />}
            {loading ? "작성 중..." : "기술 기획서 작성하기"}
          </button>
        </form>

        {error && (
          <p className="mt-4 rounded-lg border border-red-900 bg-red-950/40 p-3 text-sm text-red-400">
            {error}
          </p>
        )}

        {result && (
          <ResultPanel title={loading ? "실시간 작성 중..." : "기술 기획서"} content={result} />
        )}
      </main>
    </div>
  );
}
