"use client";

import Link from "next/link";
import { useState } from "react";
import { Spinner } from "@/components/Spinner";
import { streamFetch } from "@/lib/streamFetch";
import { extractCodeBlock } from "@/lib/extractCode";

function wrapSvg(svg: string): string {
  return `<!DOCTYPE html><html><head><style>
    html,body{margin:0;height:100%;display:flex;align-items:center;justify-content:center;background:#171717;}
    svg{max-height:100%;box-shadow:0 20px 60px rgba(0,0,0,0.5);}
  </style></head><body>${svg}</body></html>`;
}

export default function CanvasDesignPage() {
  const [text, setText] = useState("");
  const [mood, setMood] = useState("");
  const [raw, setRaw] = useState("");
  const [svg, setSvg] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setRaw("");
    setSvg("");
    setShowCode(false);

    try {
      const result = await streamFetch("/api/canvas-design", { text, mood }, setRaw);
      if (!result.ok) throw new Error(result.error);
      setSvg(extractCodeBlock(result.text));
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
          <h1 className="mt-2 text-2xl font-bold tracking-tight">Canvas Design</h1>
          <p className="mt-1 text-neutral-400">
            포스터에 들어갈 문구를 입력하면 실제 텍스트가 담긴 포스터 디자인을 만들어드립니다.
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-8 sm:px-10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="text-sm font-medium text-neutral-300">
            포스터 문구
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={"예: 회의비서팀 런칭 파티\\n2026.08.15 금요일 저녁 7시\\n성수동 라운지"}
              rows={4}
              className="mt-1.5 w-full rounded-xl border border-neutral-800 bg-neutral-900 p-4 text-sm font-normal text-neutral-100 placeholder:text-neutral-600 focus:border-purple-500 focus:outline-none"
            />
          </label>

          <label className="text-sm font-medium text-neutral-300">
            분위기 (선택)
            <input
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              placeholder="예: 미니멀한 흑백, 화려한 네온, 따뜻한 파스텔"
              className="mt-1.5 w-full rounded-lg border border-neutral-800 bg-neutral-900 p-2.5 text-sm font-normal text-neutral-100 placeholder:text-neutral-600 focus:border-purple-500 focus:outline-none"
            />
          </label>

          <button
            type="submit"
            disabled={loading || !text.trim()}
            className="flex w-fit items-center gap-2 self-start rounded-lg bg-purple-500 px-5 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-purple-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading && <Spinner />}
            {loading ? "만드는 중..." : "포스터 만들기"}
          </button>
        </form>

        {error && (
          <p className="mt-4 rounded-lg border border-red-900 bg-red-950/40 p-3 text-sm text-red-400">
            {error}
          </p>
        )}

        {(raw || svg) && (
          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-neutral-400">
                {loading ? "실시간 생성 중..." : "결과"}
              </h2>
              {!loading && svg && (
                <button
                  onClick={() => setShowCode((v) => !v)}
                  className="text-xs font-medium text-purple-400 hover:text-purple-300"
                >
                  {showCode ? "포스터로 전환" : "코드 보기"}
                </button>
              )}
            </div>

            {loading || showCode ? (
              <pre className="max-h-[600px] overflow-auto rounded-xl border border-neutral-800 bg-neutral-900 p-4 text-xs text-neutral-100">
                <code>{loading ? raw : svg}</code>
              </pre>
            ) : (
              <iframe
                title="결과"
                srcDoc={wrapSvg(svg)}
                sandbox=""
                className="h-[700px] w-full rounded-xl border border-neutral-800 bg-neutral-900"
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
