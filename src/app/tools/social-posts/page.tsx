"use client";

import Link from "next/link";
import { useState } from "react";
import { ResultPanel } from "@/components/ResultPanel";
import { Spinner } from "@/components/Spinner";
import { streamFetch } from "@/lib/streamFetch";

export default function SocialPostsPage() {
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState("");
  const [posts, setPosts] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setPosts("");

    try {
      const result = await streamFetch("/api/social-posts", { message, audience }, setPosts);
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
          <h1 className="mt-2 text-2xl font-bold tracking-tight">Social</h1>
          <p className="mt-1 text-neutral-400">
            전달하고 싶은 내용 하나를 입력하면 인스타그램·스레드(Threads)·링크드인용 게시물을 각각 다른 톤으로 만들어드립니다.
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-8 sm:px-10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="text-sm font-medium text-neutral-300">
            전달할 메시지/주제
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="예: 회의록 자동 요약 서비스 신규 기능 출시 — 회의 후 이메일 초안까지 자동 생성"
              rows={4}
              className="mt-1.5 w-full rounded-xl border border-neutral-800 bg-neutral-900 p-4 text-sm font-normal text-neutral-100 placeholder:text-neutral-600 focus:border-indigo-500 focus:outline-none"
            />
          </label>

          <label className="text-sm font-medium text-neutral-300">
            타겟층 (선택)
            <input
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="예: 스타트업 팀장급"
              className="mt-1.5 w-full rounded-lg border border-neutral-800 bg-neutral-900 p-2.5 text-sm font-normal text-neutral-100 placeholder:text-neutral-600 focus:border-indigo-500 focus:outline-none"
            />
          </label>

          <button
            type="submit"
            disabled={loading || !message.trim()}
            className="flex w-fit items-center gap-2 self-start rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading && <Spinner />}
            {loading ? "생성 중..." : "3개 플랫폼 게시물 만들기"}
          </button>
        </form>

        {error && (
          <p className="mt-4 rounded-lg border border-red-900 bg-red-950/40 p-3 text-sm text-red-400">
            {error}
          </p>
        )}

        {posts && <ResultPanel title={loading ? "실시간 생성 중..." : "생성된 게시물"} content={posts} />}
      </main>
    </div>
  );
}
