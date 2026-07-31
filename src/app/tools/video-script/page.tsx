"use client";

import Link from "next/link";
import { useState } from "react";
import { ResultPanel } from "@/components/ResultPanel";
import { Spinner } from "@/components/Spinner";
import { streamFetch } from "@/lib/streamFetch";

export default function VideoScriptPage() {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("유튜브 쇼츠/릴스");
  const [length, setLength] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult("");

    try {
      const res = await streamFetch("/api/video-script", { topic, platform, length }, setResult);
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
          <Link href="/dept/social" className="text-sm text-neutral-400 hover:text-neutral-200">
            ← 소셜·콘텐츠
          </Link>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">Video</h1>
          <p className="mt-1 text-neutral-400">
            영상 주제를 입력하면 촬영·편집에 바로 쓸 수 있는 스크립트를 타임코드별로 만들어드립니다.
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-8 sm:px-10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="text-sm font-medium text-neutral-300">
            영상 주제
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="예: 회의록 자동 요약 서비스를 3초 만에 소개하는 훅 영상"
              rows={3}
              className="mt-1.5 w-full rounded-xl border border-neutral-800 bg-neutral-900 p-4 text-sm font-normal text-neutral-100 placeholder:text-neutral-600 focus:border-indigo-500 focus:outline-none"
            />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="text-sm font-medium text-neutral-300">
              플랫폼
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-neutral-800 bg-neutral-900 p-2.5 text-sm font-normal text-neutral-100 focus:border-indigo-500 focus:outline-none"
              >
                <option>유튜브 쇼츠/릴스</option>
                <option>인스타그램 릴스</option>
                <option>틱톡</option>
                <option>유튜브 롱폼</option>
              </select>
            </label>

            <label className="text-sm font-medium text-neutral-300">
              목표 길이 (선택)
              <input
                value={length}
                onChange={(e) => setLength(e.target.value)}
                placeholder="예: 30~60초"
                className="mt-1.5 w-full rounded-lg border border-neutral-800 bg-neutral-900 p-2.5 text-sm font-normal text-neutral-100 placeholder:text-neutral-600 focus:border-indigo-500 focus:outline-none"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || !topic.trim()}
            className="flex w-fit items-center gap-2 self-start rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading && <Spinner />}
            {loading ? "작성 중..." : "스크립트 만들기"}
          </button>
        </form>

        {error && (
          <p className="mt-4 rounded-lg border border-red-900 bg-red-950/40 p-3 text-sm text-red-400">
            {error}
          </p>
        )}

        {result && (
          <ResultPanel title={loading ? "실시간 작성 중..." : "영상 스크립트"} content={result} />
        )}
      </main>
    </div>
  );
}
