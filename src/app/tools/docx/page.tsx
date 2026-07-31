"use client";

import Link from "next/link";
import { useState } from "react";
import { ResultPanel } from "@/components/ResultPanel";
import { Spinner } from "@/components/Spinner";
import { streamFetch } from "@/lib/streamFetch";

export default function DocxPage() {
  const [purpose, setPurpose] = useState("");
  const [draft, setDraft] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult("");

    try {
      const res = await streamFetch("/api/docx", { purpose, draft }, setResult);
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
          <h1 className="mt-2 text-2xl font-bold tracking-tight">DOCX</h1>
          <p className="mt-1 text-neutral-400">
            문서 목적을 입력하면 초안을 작성하고, 기존 초안이 있으면 변경 추적 형태로 수정을 제안합니다.
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-8 sm:px-10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="text-sm font-medium text-neutral-300">
            문서 목적
            <textarea
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="예: 외주 개발 계약 해지 통보서"
              rows={3}
              className="mt-1.5 w-full rounded-xl border border-neutral-800 bg-neutral-900 p-4 text-sm font-normal text-neutral-100 placeholder:text-neutral-600 focus:border-slate-500 focus:outline-none"
            />
          </label>

          <label className="text-sm font-medium text-neutral-300">
            기존 초안 (선택 — 있으면 수정 제안을 함께 드립니다)
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="기존에 작성한 문서 내용을 붙여넣으세요"
              rows={8}
              className="mt-1.5 w-full rounded-xl border border-neutral-800 bg-neutral-900 p-4 text-sm font-normal text-neutral-100 placeholder:text-neutral-600 focus:border-slate-500 focus:outline-none"
            />
          </label>

          <button
            type="submit"
            disabled={loading || !purpose.trim()}
            className="flex w-fit items-center gap-2 self-start rounded-lg bg-slate-500 px-5 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading && <Spinner />}
            {loading ? "작성 중..." : "문서 작성하기"}
          </button>
        </form>

        {error && (
          <p className="mt-4 rounded-lg border border-red-900 bg-red-950/40 p-3 text-sm text-red-400">
            {error}
          </p>
        )}

        {result && (
          <ResultPanel title={loading ? "실시간 작성 중..." : "문서 결과"} content={result} />
        )}
      </main>
    </div>
  );
}
