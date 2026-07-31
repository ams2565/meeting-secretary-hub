"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { ResultPanel } from "@/components/ResultPanel";
import { Spinner } from "@/components/Spinner";
import { streamFetch } from "@/lib/streamFetch";

function EmailDraftForm() {
  const searchParams = useSearchParams();
  const [summary, setSummary] = useState(searchParams.get("summary") ?? "");
  const [recipient, setRecipient] = useState("");
  const [tone, setTone] = useState<"formal" | "casual">("formal");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setEmail("");

    try {
      const result = await streamFetch("/api/email-draft", { summary, recipient, tone }, setEmail);
      if (!result.ok) throw new Error(result.error);
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="text-sm font-medium text-neutral-300">
          회의 요약 / 내용
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="회의 요약이나 전달할 내용을 입력하세요..."
            rows={8}
            className="mt-1.5 w-full rounded-xl border border-neutral-800 bg-neutral-900 p-4 text-sm font-normal text-neutral-100 placeholder:text-neutral-600 focus:border-lime-500 focus:outline-none"
          />
        </label>

        <div className="flex flex-col gap-4 sm:flex-row">
          <label className="flex-1 text-sm font-medium text-neutral-300">
            수신자 (선택)
            <input
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="예: 마케팅팀 전체"
              className="mt-1.5 w-full rounded-lg border border-neutral-800 bg-neutral-900 p-2.5 text-sm font-normal text-neutral-100 placeholder:text-neutral-600 focus:border-lime-500 focus:outline-none"
            />
          </label>

          <label className="text-sm font-medium text-neutral-300">
            어투
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value as "formal" | "casual")}
              className="mt-1.5 w-full rounded-lg border border-neutral-800 bg-neutral-900 p-2.5 text-sm font-normal text-neutral-100 focus:border-lime-500 focus:outline-none"
            >
              <option value="formal">정중하게</option>
              <option value="casual">편안하게</option>
            </select>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading || !summary.trim()}
          className="flex w-fit items-center gap-2 self-start rounded-lg bg-lime-500 px-5 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-lime-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading && <Spinner />}
          {loading ? "작성 중..." : "이메일 초안 작성하기"}
        </button>
      </form>

      {error && (
        <p className="mt-4 rounded-lg border border-red-900 bg-red-950/40 p-3 text-sm text-red-400">
          {error}
        </p>
      )}

      {email && <ResultPanel title={loading ? "실시간 작성 중..." : "이메일 초안"} content={email} />}
    </>
  );
}

export default function EmailDraftPage() {
  return (
    <div className="flex flex-1 flex-col bg-neutral-950">
      <header className="border-b border-neutral-800 px-6 py-8 sm:px-10">
        <div className="mx-auto max-w-3xl">
          <Link href="/dept/ops" className="text-sm text-neutral-400 hover:text-neutral-200">
            ← 운영
          </Link>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">후속 이메일 초안</h1>
          <p className="mt-1 text-neutral-400">
            회의 요약을 바탕으로 참석자에게 보낼 후속 이메일 초안을 작성합니다.
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-8 sm:px-10">
        <Suspense fallback={null}>
          <EmailDraftForm />
        </Suspense>
      </main>
    </div>
  );
}
