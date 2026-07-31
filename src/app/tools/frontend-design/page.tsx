"use client";

import Link from "next/link";
import { useState } from "react";
import { Spinner } from "@/components/Spinner";
import { streamFetch } from "@/lib/streamFetch";
import { extractCodeBlock } from "@/lib/extractCode";

export default function FrontendDesignPage() {
  const [description, setDescription] = useState("");
  const [style, setStyle] = useState("");
  const [raw, setRaw] = useState("");
  const [html, setHtml] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setRaw("");
    setHtml("");
    setShowCode(false);

    try {
      const result = await streamFetch("/api/frontend-design", { description, style }, setRaw);
      if (!result.ok) throw new Error(result.error);
      setHtml(extractCodeBlock(result.text));
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
          <h1 className="mt-2 text-2xl font-bold tracking-tight">Frontend Design</h1>
          <p className="mt-1 text-neutral-400">
            만들고 싶은 화면을 설명하면 개성 있는 HTML/CSS 코드를 만들어 바로 렌더링해드립니다.
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-8 sm:px-10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="text-sm font-medium text-neutral-300">
            만들고 싶은 화면
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="예: 가격 플랜 3개를 비교하는 프라이싱 카드 섹션"
              rows={3}
              className="mt-1.5 w-full rounded-xl border border-neutral-800 bg-neutral-900 p-4 text-sm font-normal text-neutral-100 placeholder:text-neutral-600 focus:border-purple-500 focus:outline-none"
            />
          </label>

          <label className="text-sm font-medium text-neutral-300">
            스타일 힌트 (선택)
            <input
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              placeholder="예: 미니멀, 다크모드, 손글씨 느낌의 세리프"
              className="mt-1.5 w-full rounded-lg border border-neutral-800 bg-neutral-900 p-2.5 text-sm font-normal text-neutral-100 placeholder:text-neutral-600 focus:border-purple-500 focus:outline-none"
            />
          </label>

          <button
            type="submit"
            disabled={loading || !description.trim()}
            className="flex w-fit items-center gap-2 self-start rounded-lg bg-purple-500 px-5 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-purple-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading && <Spinner />}
            {loading ? "만드는 중..." : "화면 만들기"}
          </button>
        </form>

        {error && (
          <p className="mt-4 rounded-lg border border-red-900 bg-red-950/40 p-3 text-sm text-red-400">
            {error}
          </p>
        )}

        {(raw || html) && (
          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-neutral-400">
                {loading ? "실시간 생성 중..." : "미리보기"}
              </h2>
              {!loading && html && (
                <button
                  onClick={() => setShowCode((v) => !v)}
                  className="text-xs font-medium text-purple-400 hover:text-purple-300"
                >
                  {showCode ? "미리보기로 전환" : "코드 보기"}
                </button>
              )}
            </div>

            {loading || showCode ? (
              <pre className="max-h-[600px] overflow-auto rounded-xl border border-neutral-800 bg-neutral-900 p-4 text-xs text-neutral-100">
                <code>{loading ? raw : html}</code>
              </pre>
            ) : (
              <iframe
                title="미리보기"
                srcDoc={html}
                sandbox="allow-scripts"
                className="h-[600px] w-full rounded-xl border border-neutral-800 bg-white"
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
