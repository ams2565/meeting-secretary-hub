"use client";

import Link from "next/link";
import { useState } from "react";
import { ResultPanel } from "@/components/ResultPanel";
import { Spinner } from "@/components/Spinner";
import { streamFetch } from "@/lib/streamFetch";

export default function PersuasiveCopyPage() {
  const [product, setProduct] = useState("");
  const [audience, setAudience] = useState("");
  const [copy, setCopy] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setCopy("");

    try {
      const result = await streamFetch("/api/persuasive-copy", { product, audience }, setCopy);
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
          <h1 className="mt-2 text-2xl font-bold tracking-tight">설득 심리 카피 생성</h1>
          <p className="mt-1 text-neutral-400">
            제품/서비스와 타겟층을 입력하면 서로 다른 심리학 원리를 적용한 카피 3가지를 만들어드립니다.
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-8 sm:px-10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="text-sm font-medium text-neutral-300">
            제품/서비스 설명
            <textarea
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              placeholder="예: 회의록을 자동으로 요약해주는 SaaS 서비스"
              rows={4}
              className="mt-1.5 w-full rounded-xl border border-neutral-800 bg-neutral-900 p-4 text-sm font-normal text-neutral-100 placeholder:text-neutral-600 focus:border-rose-500 focus:outline-none"
            />
          </label>

          <label className="text-sm font-medium text-neutral-300">
            타겟층 (선택)
            <input
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="예: 스타트업 대표, 팀장급"
              className="mt-1.5 w-full rounded-lg border border-neutral-800 bg-neutral-900 p-2.5 text-sm font-normal text-neutral-100 placeholder:text-neutral-600 focus:border-rose-500 focus:outline-none"
            />
          </label>

          <button
            type="submit"
            disabled={loading || !product.trim()}
            className="flex w-fit items-center gap-2 self-start rounded-lg bg-rose-500 px-5 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading && <Spinner />}
            {loading ? "작성 중..." : "카피 생성하기"}
          </button>
        </form>

        {error && (
          <p className="mt-4 rounded-lg border border-red-900 bg-red-950/40 p-3 text-sm text-red-400">
            {error}
          </p>
        )}

        {copy && <ResultPanel title={loading ? "실시간 작성 중..." : "생성된 카피"} content={copy} />}
      </main>
    </div>
  );
}
