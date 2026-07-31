"use client";

import Link from "next/link";
import { useState } from "react";
import { ResultPanel } from "@/components/ResultPanel";
import { Spinner } from "@/components/Spinner";
import { streamFetch } from "@/lib/streamFetch";

export default function Context7Page() {
  const [library, setLibrary] = useState("");
  const [code, setCode] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult("");

    try {
      const res = await streamFetch("/api/context7", { library, code }, setResult);
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
          <h1 className="mt-2 text-2xl font-bold tracking-tight">Context7</h1>
          <p className="mt-1 text-neutral-400">
            라이브러리 이름과 코드를 입력하면 실제 최신 공식 문서를 찾아 대조 검증합니다.
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-8 sm:px-10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="text-sm font-medium text-neutral-300">
            라이브러리/프레임워크
            <input
              value={library}
              onChange={(e) => setLibrary(e.target.value)}
              placeholder="예: Next.js 16, React Query v5"
              className="mt-1.5 w-full rounded-lg border border-neutral-800 bg-neutral-900 p-2.5 text-sm font-normal text-neutral-100 placeholder:text-neutral-600 focus:border-orange-500 focus:outline-none"
            />
          </label>

          <label className="text-sm font-medium text-neutral-300">
            검증할 코드 (선택)
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="최신 API와 맞는지 확인하고 싶은 코드를 붙여넣으세요"
              rows={8}
              className="mt-1.5 w-full rounded-xl border border-neutral-800 bg-neutral-900 p-4 font-mono text-xs font-normal text-neutral-100 placeholder:text-neutral-600 focus:border-orange-500 focus:outline-none"
            />
          </label>

          <button
            type="submit"
            disabled={loading || !library.trim()}
            className="flex w-fit items-center gap-2 self-start rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading && <Spinner />}
            {loading ? "문서 확인 중..." : "최신 문서로 검증하기"}
          </button>
        </form>

        {error && (
          <p className="mt-4 rounded-lg border border-red-900 bg-red-950/40 p-3 text-sm text-red-400">
            {error}
          </p>
        )}

        {result && (
          <ResultPanel title={loading ? "문서 확인 및 검증 중..." : "검증 결과"} content={result} />
        )}
      </main>
    </div>
  );
}
