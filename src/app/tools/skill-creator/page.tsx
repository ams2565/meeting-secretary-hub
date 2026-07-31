"use client";

import Link from "next/link";
import { useState } from "react";
import { ResultPanel } from "@/components/ResultPanel";
import { Spinner } from "@/components/Spinner";
import { streamFetch } from "@/lib/streamFetch";

export default function SkillCreatorPage() {
  const [task, setTask] = useState("");
  const [skill, setSkill] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSkill("");

    try {
      const result = await streamFetch("/api/skill-creator", { task }, setSkill);
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
          <Link href="/dept/dev" className="text-sm text-neutral-400 hover:text-neutral-200">
            ← 개발
          </Link>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">Skill Creator</h1>
          <p className="mt-1 text-neutral-400">
            반복하는 작업을 설명하면 재사용 가능한 Claude Code 스킬(SKILL.md) 파일을 만들어드립니다.
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-8 sm:px-10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <textarea
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="예: PR을 만들 때마다 커밋 로그를 보고 변경 요약, 테스트 계획을 한국어로 정리해서 PR 설명에 넣는 작업을 매번 반복해"
            rows={6}
            className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-4 text-sm text-neutral-100 placeholder:text-neutral-600 focus:border-orange-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading || !task.trim()}
            className="flex w-fit items-center gap-2 self-start rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading && <Spinner />}
            {loading ? "생성 중..." : "스킬 파일 생성하기"}
          </button>
        </form>

        {error && (
          <p className="mt-4 rounded-lg border border-red-900 bg-red-950/40 p-3 text-sm text-red-400">
            {error}
          </p>
        )}

        {skill && <ResultPanel title={loading ? "실시간 생성 중..." : "생성된 스킬"} content={skill} />}
      </main>
    </div>
  );
}
