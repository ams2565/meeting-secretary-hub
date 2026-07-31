"use client";

import Link from "next/link";
import { useState } from "react";
import { Spinner } from "@/components/Spinner";
import { streamFetch } from "@/lib/streamFetch";
import { extractCodeBlock } from "@/lib/extractCode";

export default function WebArtifactsPage() {
  const [app, setApp] = useState("");
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
      const result = await streamFetch("/api/web-artifacts", { app }, setRaw);
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
          <h1 className="mt-2 text-2xl font-bold tracking-tight">Web Artifacts</h1>
          <p className="mt-1 text-neutral-400">
            여러 화면·기능이 얽힌 웹앱을 설명하면 실제로 화면 전환이 동작하는 인터랙티브 프로토타입을 만들어드립니다.
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-8 sm:px-10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <textarea
            value={app}
            onChange={(e) => setApp(e.target.value)}
            placeholder="예: 할 일 관리 앱 — 목록 화면에서 할 일을 추가하고, 클릭하면 상세 화면으로 전환되어 마감일을 수정할 수 있음"
            rows={5}
            className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-4 text-sm text-neutral-100 placeholder:text-neutral-600 focus:border-purple-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading || !app.trim()}
            className="flex w-fit items-center gap-2 self-start rounded-lg bg-purple-500 px-5 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-purple-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading && <Spinner />}
            {loading ? "만드는 중..." : "프로토타입 만들기"}
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
                className="h-[700px] w-full rounded-xl border border-neutral-800 bg-white"
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
