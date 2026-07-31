"use client";

import Link from "next/link";
import { useState } from "react";
import { ResultPanel } from "@/components/ResultPanel";
import { Spinner } from "@/components/Spinner";
import { streamFetch } from "@/lib/streamFetch";

export default function BlogWriterPage() {
  const [topic, setTopic] = useState("");
  const [keyword, setKeyword] = useState("");
  const [tone, setTone] = useState<"professional" | "casual">("professional");
  const [post, setPost] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setPost("");

    try {
      const result = await streamFetch("/api/blog-writer", { topic, keyword, tone }, setPost);
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
          <Link href="/dept/social" className="text-sm text-neutral-400 hover:text-neutral-200">
            ← 소셜·콘텐츠
          </Link>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">Claude Blog</h1>
          <p className="mt-1 text-neutral-400">
            주제와 타겟 키워드를 입력하면 SEO 최적화된 블로그 글을 통째로 작성해드립니다.
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-8 sm:px-10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="text-sm font-medium text-neutral-300">
            블로그 주제
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="예: 재택근무 팀의 회의 생산성을 높이는 방법"
              rows={3}
              className="mt-1.5 w-full rounded-xl border border-neutral-800 bg-neutral-900 p-4 text-sm font-normal text-neutral-100 placeholder:text-neutral-600 focus:border-indigo-500 focus:outline-none"
            />
          </label>

          <div className="flex flex-col gap-4 sm:flex-row">
            <label className="flex-1 text-sm font-medium text-neutral-300">
              타겟 키워드 (선택)
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="예: 회의 생산성, 원격근무 팁"
                className="mt-1.5 w-full rounded-lg border border-neutral-800 bg-neutral-900 p-2.5 text-sm font-normal text-neutral-100 placeholder:text-neutral-600 focus:border-indigo-500 focus:outline-none"
              />
            </label>

            <label className="text-sm font-medium text-neutral-300">
              어투
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as "professional" | "casual")}
                className="mt-1.5 w-full rounded-lg border border-neutral-800 bg-neutral-900 p-2.5 text-sm font-normal text-neutral-100 focus:border-indigo-500 focus:outline-none"
              >
                <option value="professional">전문적으로</option>
                <option value="casual">편안하게</option>
              </select>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || !topic.trim()}
            className="flex w-fit items-center gap-2 self-start rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading && <Spinner />}
            {loading ? "작성 중..." : "블로그 글 작성하기"}
          </button>
        </form>

        {error && (
          <p className="mt-4 rounded-lg border border-red-900 bg-red-950/40 p-3 text-sm text-red-400">
            {error}
          </p>
        )}

        {post && <ResultPanel title={loading ? "실시간 작성 중..." : "생성된 글"} content={post} />}
      </main>
    </div>
  );
}
