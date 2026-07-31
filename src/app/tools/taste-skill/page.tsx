"use client";

import Link from "next/link";
import { useState } from "react";
import { ResultPanel } from "@/components/ResultPanel";
import { Spinner } from "@/components/Spinner";
import { streamFetch } from "@/lib/streamFetch";

export default function TasteSkillPage() {
  const [design, setDesign] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult("");

    try {
      const res = await streamFetch("/api/taste-skill", { design }, setResult);
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
          <Link href="/dept/design" className="text-sm text-neutral-400 hover:text-neutral-200">
            ← 디자인
          </Link>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">Taste Skill</h1>
          <p className="mt-1 text-neutral-400">
            지금 있는 화면 설명이나 코드를 붙여넣으면 왜 뻔해 보이는지 짚어주고 감각적으로 개선해드립니다.
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-8 sm:px-10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <textarea
            value={design}
            onChange={(e) => setDesign(e.target.value)}
            placeholder="예: 보라색-파란색 그라데이션 배경에 흰색 카드 3개가 나란히 있고, Inter 폰트로 제목/설명/버튼이 들어간 가격 섹션. 어디서 본 것 같은 느낌이 듦"
            rows={8}
            className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-4 text-sm text-neutral-100 placeholder:text-neutral-600 focus:border-purple-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading || !design.trim()}
            className="flex w-fit items-center gap-2 self-start rounded-lg bg-purple-500 px-5 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-purple-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading && <Spinner />}
            {loading ? "분석 중..." : "감각적으로 개선하기"}
          </button>
        </form>

        {error && (
          <p className="mt-4 rounded-lg border border-red-900 bg-red-950/40 p-3 text-sm text-red-400">
            {error}
          </p>
        )}

        {result && (
          <ResultPanel title={loading ? "실시간 분석 중..." : "감각 진단 및 개선안"} content={result} />
        )}
      </main>
    </div>
  );
}
