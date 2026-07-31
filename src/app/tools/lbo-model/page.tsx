"use client";

import Link from "next/link";
import { useState } from "react";
import { ResultPanel } from "@/components/ResultPanel";
import { Spinner } from "@/components/Spinner";
import { streamFetch } from "@/lib/streamFetch";

export default function LboModelPage() {
  const [business, setBusiness] = useState("");
  const [assumptions, setAssumptions] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult("");

    try {
      const res = await streamFetch("/api/lbo-model", { business, assumptions }, setResult);
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
          <h1 className="mt-2 text-2xl font-bold tracking-tight">LBO Model</h1>
          <p className="mt-1 text-neutral-400">
            인수 대상 기업 개요를 입력하면 차입매수(LBO) 구조와 예상 수익률(IRR/MOIC)을 추정합니다.
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-8 sm:px-10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="text-sm font-medium text-neutral-300">
            인수 대상 기업 개요
            <textarea
              value={business}
              onChange={(e) => setBusiness(e.target.value)}
              placeholder="예: 연매출 50억원, EBITDA 8억원인 B2B SaaS 기업 인수 검토"
              rows={4}
              className="mt-1.5 w-full rounded-xl border border-neutral-800 bg-neutral-900 p-4 text-sm font-normal text-neutral-100 placeholder:text-neutral-600 focus:border-emerald-500 focus:outline-none"
            />
          </label>

          <label className="text-sm font-medium text-neutral-300">
            추가 가정/수치 (선택)
            <textarea
              value={assumptions}
              onChange={(e) => setAssumptions(e.target.value)}
              placeholder="예: 인수배수 EV/EBITDA 7x, 레버리지 60%, exit 배수 7x"
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
            {loading ? "계산 중..." : "LBO 수익률 계산하기"}
          </button>
        </form>

        {error && (
          <p className="mt-4 rounded-lg border border-red-900 bg-red-950/40 p-3 text-sm text-red-400">
            {error}
          </p>
        )}

        {result && (
          <ResultPanel title={loading ? "실시간 계산 중..." : "LBO 수익률 모델"} content={result} />
        )}
      </main>
    </div>
  );
}
