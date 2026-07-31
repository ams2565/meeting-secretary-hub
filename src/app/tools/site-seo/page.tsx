"use client";

import Link from "next/link";
import { useState } from "react";
import { ResultPanel } from "@/components/ResultPanel";
import { Spinner } from "@/components/Spinner";
import { streamFetch } from "@/lib/streamFetch";

export default function SiteSeoPage() {
  const [url, setUrl] = useState("");
  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setReport("");

    try {
      const result = await streamFetch("/api/site-seo", { url }, setReport);
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
          <Link href="/dept/marketing" className="text-sm text-neutral-400 hover:text-neutral-200">
            ← 마케팅
          </Link>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">사이트 SEO 진단</h1>
          <p className="mt-1 text-neutral-400">
            URL을 입력하면 실제로 페이지를 불러와 제목·메타 설명·구조·콘텐츠를 점검하고 개선안을 제시합니다.
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-8 sm:px-10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="example.com 또는 https://example.com/page"
            className="flex-1 rounded-xl border border-neutral-800 bg-neutral-900 p-3 text-sm text-neutral-100 placeholder:text-neutral-600 focus:border-rose-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading || !url.trim()}
            className="flex w-fit items-center gap-2 rounded-lg bg-rose-500 px-5 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading && <Spinner />}
            {loading ? "진단 중..." : "SEO 진단하기"}
          </button>
        </form>

        {error && (
          <p className="mt-4 rounded-lg border border-red-900 bg-red-950/40 p-3 text-sm text-red-400">
            {error}
          </p>
        )}

        {report && (
          <ResultPanel title={loading ? "페이지 확인 및 작성 중..." : "진단 결과"} content={report} />
        )}
      </main>
    </div>
  );
}
