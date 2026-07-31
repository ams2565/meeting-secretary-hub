"use client";

import Link from "next/link";
import { useState } from "react";
import { ResultPanel } from "@/components/ResultPanel";
import { Spinner } from "@/components/Spinner";
import { streamFetch } from "@/lib/streamFetch";

export default function CompsAnalysisPage() {
  const [business, setBusiness] = useState("");
  const [comps, setComps] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult("");

    try {
      const res = await streamFetch("/api/comps-analysis", { business, comps }, setResult);
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
          <Link href="/dept/finance" className="text-sm text-neutral-400 hover:text-neutral-200">
            ← 재무
          </Link>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">Comps Analysis</h1>
          <p className="mt-1 text-neutral-400">
            비교 가능한 기업 정보를 입력하면 상대가치평가(Comps)로 기업가치 범위를 산정합니다.
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-8 sm:px-10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="text-sm font-medium text-neutral-300">
            가치를 산정할 기업 개요
            <textarea
              value={business}
              onChange={(e) => setBusiness(e.target.value)}
              placeholder="예: 연매출 30억원, EBITDA 5억원인 B2B SaaS 기업"
              rows={4}
              className="mt-1.5 w-full rounded-xl border border-neutral-800 bg-neutral-900 p-4 text-sm font-normal text-neutral-100 placeholder:text-neutral-600 focus:border-emerald-500 focus:outline-none"
            />
          </label>

          <label className="text-sm font-medium text-neutral-300">
            비교 기업 정보 (선택 — 있으면 정확도가 크게 올라갑니다)
            <textarea
              value={comps}
              onChange={(e) => setComps(e.target.value)}
              placeholder="예: 유사 상장사 A사 EV/EBITDA 12x, B사 10x"
              rows={3}
              className="mt-1.5 w-full rounded-xl border border-neutral-800 bg-neutral-900 p-4 text-sm font-normal text-neutral-100 placeholder:text-neutral-600 focus:border-emerald-500 focus:outline-none"
            />
          </label>

          <button
            type="submit"
            disabled={loading || !business.trim()}
            className="flex w-fit items-center gap-2 self-start rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading && <Spinner />}
            {loading ? "산정 중..." : "비교기업 가치 산정하기"}
          </button>
        </form>

        {error && (
          <p className="mt-4 rounded-lg border border-red-900 bg-red-950/40 p-3 text-sm text-red-400">
            {error}
          </p>
        )}

        {result && (
          <ResultPanel title={loading ? "실시간 산정 중..." : "비교기업 가치평가"} content={result} />
        )}
      </main>
    </div>
  );
}
