"use client";

import Link from "next/link";
import { useState } from "react";
import { ResultPanel } from "@/components/ResultPanel";
import { Spinner } from "@/components/Spinner";
import { streamFetch } from "@/lib/streamFetch";

export default function MeetingSummaryPage() {
  const [transcript, setTranscript] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSummary("");

    try {
      const result = await streamFetch("/api/meeting-summary", { transcript }, setSummary);
      if (!result.ok) throw new Error(result.error);
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
          <h1 className="mt-2 text-2xl font-bold tracking-tight">회의록 자동 요약</h1>
          <p className="mt-1 text-neutral-400">
            회의 녹취록이나 메모를 붙여넣으면 요약, 결정사항, 액션 아이템으로 정리해드립니다.
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-8 sm:px-10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="회의 내용을 붙여넣으세요..."
            rows={12}
            className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-4 text-sm text-neutral-100 placeholder:text-neutral-600 focus:border-lime-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading || !transcript.trim()}
            className="flex w-fit items-center gap-2 self-start rounded-lg bg-lime-500 px-5 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-lime-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading && <Spinner />}
            {loading ? "정리 중..." : "회의록 정리하기"}
          </button>
        </form>

        {error && (
          <p className="mt-4 rounded-lg border border-red-900 bg-red-950/40 p-3 text-sm text-red-400">
            {error}
          </p>
        )}

        {summary && (
          <ResultPanel
            title={loading ? "실시간 정리 중..." : "정리 결과"}
            content={summary}
            footer={
              !loading && (
                <Link
                  href={{
                    pathname: "/tools/email-draft",
                    query: { summary },
                  }}
                  className="mt-5 inline-block rounded-lg border border-neutral-700 px-4 py-2 text-sm font-medium text-neutral-200 hover:border-neutral-500"
                >
                  이 요약으로 후속 이메일 초안 작성 →
                </Link>
              )
            }
          />
        )}
      </main>
    </div>
  );
}
