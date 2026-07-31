"use client";

import Link from "next/link";
import { useState } from "react";
import { ResultPanel } from "@/components/ResultPanel";
import { Spinner } from "@/components/Spinner";
import { streamFetch } from "@/lib/streamFetch";

export default function LegalConsultPage() {
  const [situation, setSituation] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult("");

    try {
      const res = await streamFetch("/api/legal-consult", { situation }, setResult);
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
          <Link href="/dept/legal" className="text-sm text-neutral-400 hover:text-neutral-200">
            ← 법무
          </Link>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">AI Legal Claude</h1>
          <p className="mt-1 text-neutral-400">
            계약 협상, NDA, 분쟁 등 법무 관련 상황을 설명하면 쟁점과 대응 전략을 상담해드립니다. (법률 자문 아님)
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-8 sm:px-10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <textarea
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            placeholder="예: 외주 개발사와 NDA 체결 전인데, 상대방이 준 초안에 지식재산권이 전부 자기들 소유로 되어 있음. 어떻게 협상해야 할지 궁금함"
            rows={8}
            className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-4 text-sm text-neutral-100 placeholder:text-neutral-600 focus:border-slate-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading || !situation.trim()}
            className="flex w-fit items-center gap-2 self-start rounded-lg bg-slate-500 px-5 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading && <Spinner />}
            {loading ? "상담 중..." : "법무 상담 받기"}
          </button>
        </form>

        {error && (
          <p className="mt-4 rounded-lg border border-red-900 bg-red-950/40 p-3 text-sm text-red-400">
            {error}
          </p>
        )}

        {result && (
          <ResultPanel title={loading ? "실시간 상담 중..." : "법무 상담 결과"} content={result} />
        )}
      </main>
    </div>
  );
}
