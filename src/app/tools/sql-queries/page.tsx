"use client";

import Link from "next/link";
import { useState } from "react";
import { ResultPanel } from "@/components/ResultPanel";
import { Spinner } from "@/components/Spinner";
import { streamFetch } from "@/lib/streamFetch";

export default function SqlQueriesPage() {
  const [schema, setSchema] = useState("");
  const [request, setRequest] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult("");

    try {
      const res = await streamFetch("/api/sql-queries", { schema, request }, setResult);
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
          <h1 className="mt-2 text-2xl font-bold tracking-tight">SQL Queries</h1>
          <p className="mt-1 text-neutral-400">
            테이블 구조와 원하는 조회 내용을 설명하면 SQL 쿼리를 생성합니다. (실행은 직접 하셔야 합니다)
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-8 sm:px-10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="text-sm font-medium text-neutral-300">
            테이블 구조 (선택 — 있으면 정확도가 크게 올라갑니다)
            <textarea
              value={schema}
              onChange={(e) => setSchema(e.target.value)}
              placeholder="예: users(id, name, email, created_at), orders(id, user_id, amount, status, created_at)"
              rows={4}
              className="mt-1.5 w-full rounded-xl border border-neutral-800 bg-neutral-900 p-4 text-sm font-normal text-neutral-100 placeholder:text-neutral-600 focus:border-slate-500 focus:outline-none"
            />
          </label>

          <label className="text-sm font-medium text-neutral-300">
            원하는 조회 내용
            <textarea
              value={request}
              onChange={(e) => setRequest(e.target.value)}
              placeholder="예: 최근 30일간 10만원 이상 주문한 사용자의 이름과 이메일, 총 주문금액을 많은 순으로"
              rows={3}
              className="mt-1.5 w-full rounded-xl border border-neutral-800 bg-neutral-900 p-4 text-sm font-normal text-neutral-100 placeholder:text-neutral-600 focus:border-slate-500 focus:outline-none"
            />
          </label>

          <button
            type="submit"
            disabled={loading || !request.trim()}
            className="flex w-fit items-center gap-2 self-start rounded-lg bg-slate-500 px-5 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading && <Spinner />}
            {loading ? "생성 중..." : "SQL 쿼리 생성하기"}
          </button>
        </form>

        {error && (
          <p className="mt-4 rounded-lg border border-red-900 bg-red-950/40 p-3 text-sm text-red-400">
            {error}
          </p>
        )}

        {result && (
          <ResultPanel title={loading ? "실시간 생성 중..." : "SQL 쿼리"} content={result} />
        )}
      </main>
    </div>
  );
}
