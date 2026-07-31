"use client";

import Link from "next/link";
import { useState } from "react";
import { ResultPanel } from "@/components/ResultPanel";
import { Spinner } from "@/components/Spinner";
import { streamFetch } from "@/lib/streamFetch";

export default function LaunchRunbookPage() {
  const [launch, setLaunch] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult("");

    try {
      const res = await streamFetch("/api/launch-runbook", { launch }, setResult);
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
          <h1 className="mt-2 text-2xl font-bold tracking-tight">Launch Runbook</h1>
          <p className="mt-1 text-neutral-400">
            출시할 제품/기능을 설명하면 체크리스트와 롤백 기준까지 담은 출시 런북을 작성합니다.
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-8 sm:px-10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <textarea
            value={launch}
            onChange={(e) => setLaunch(e.target.value)}
            placeholder="예: 회의비서팀 신규 기능 '이메일 초안 자동 발송' 출시. 기존 사용자 전체 대상, 다음 주 화요일 오전 배포 예정"
            rows={6}
            className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-4 text-sm text-neutral-100 placeholder:text-neutral-600 focus:border-lime-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading || !launch.trim()}
            className="flex w-fit items-center gap-2 self-start rounded-lg bg-lime-500 px-5 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-lime-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading && <Spinner />}
            {loading ? "작성 중..." : "런북 작성하기"}
          </button>
        </form>

        {error && (
          <p className="mt-4 rounded-lg border border-red-900 bg-red-950/40 p-3 text-sm text-red-400">
            {error}
          </p>
        )}

        {result && (
          <ResultPanel title={loading ? "실시간 작성 중..." : "출시 런북"} content={result} />
        )}
      </main>
    </div>
  );
}
