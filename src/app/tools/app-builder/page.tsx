"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChatPanel } from "@/components/ChatPanel";
import { CodePreviewBubble } from "@/components/CodePreviewBubble";
import { Markdown } from "@/components/Markdown";
import { streamFetch } from "@/lib/streamFetch";
import { extractCodeBlock, textBeforeCodeBlock } from "@/lib/extractCode";
import type { ChatMessage } from "@/lib/chat";

type DeployState = { status: "idle" } | { status: "naming" } | { status: "deploying" } | { status: "done"; url: string } | { status: "error"; message: string };
type DeployedApp = { slug: string; url: string };

const DRAFT_KEY = "app-builder-draft";

function loadDraft(): { messages: ChatMessage[]; deployNames: Record<number, string> } {
  if (typeof window === "undefined") return { messages: [], deployNames: {} };
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) return { messages: [], deployNames: {} };
    const parsed = JSON.parse(raw);
    return { messages: parsed.messages ?? [], deployNames: parsed.deployNames ?? {} };
  } catch {
    return { messages: [], deployNames: {} };
  }
}

export default function AppBuilderPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => loadDraft().messages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [codeIndices, setCodeIndices] = useState<Set<number>>(new Set());
  const [deployStates, setDeployStates] = useState<Record<number, DeployState>>({});
  const [deployNames, setDeployNames] = useState<Record<number, string>>(() => loadDraft().deployNames);
  const [apps, setApps] = useState<DeployedApp[]>([]);
  const [appsError, setAppsError] = useState("");
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/app-builder/list")
      .then((res) => res.json())
      .then((data) => {
        if (data.apps) setApps(data.apps);
        else setAppsError(data.error ?? "목록을 불러오지 못했습니다.");
      })
      .catch(() => setAppsError("목록을 불러오지 못했습니다."));
  }, []);

  useEffect(() => {
    if (messages.length === 0) {
      window.localStorage.removeItem(DRAFT_KEY);
      return;
    }
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify({ messages, deployNames }));
  }, [messages, deployNames]);

  function handleStartOver() {
    setMessages([]);
    setInput("");
    setError("");
    setCodeIndices(new Set());
    setDeployStates({});
    setDeployNames({});
    window.localStorage.removeItem(DRAFT_KEY);
  }

  async function handleLoadApp(slug: string) {
    setLoadingSlug(slug);
    setError("");
    try {
      const res = await fetch(`/api/app-builder/load?slug=${encodeURIComponent(slug)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "앱을 불러오지 못했습니다.");

      setMessages([
        { role: "user", content: `기존에 배포한 "${slug}" 앱을 불러왔습니다. 이어서 수정하고 싶어요.` },
        { role: "assistant", content: "```html\n" + data.html + "\n```" },
      ]);
      setCodeIndices(new Set());
      setDeployStates({});
      setDeployNames({ 1: slug });
    } catch (err) {
      setError(err instanceof Error ? err.message : "앱을 불러오지 못했습니다.");
    } finally {
      setLoadingSlug(null);
    }
  }

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages([...nextMessages, { role: "assistant", content: "" }]);
    setInput("");
    setLoading(true);
    setError("");

    try {
      const result = await streamFetch("/api/app-builder", { messages: nextMessages }, (acc) => {
        setMessages([...nextMessages, { role: "assistant", content: acc }]);
      });
      if (!result.ok) throw new Error(result.error);
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
      setMessages(nextMessages);
    } finally {
      setLoading(false);
    }
  }

  function toggleCode(index: number) {
    setCodeIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  async function handleDeploy(index: number, content: string) {
    const name = (deployNames[index] ?? "").trim();
    if (!name) return;

    setDeployStates((prev) => ({ ...prev, [index]: { status: "deploying" } }));
    try {
      const res = await fetch("/api/app-builder/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, html: extractCodeBlock(content) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "배포에 실패했습니다.");
      setDeployStates((prev) => ({ ...prev, [index]: { status: "done", url: data.url } }));
      const slug = (data.url as string).replace(/\/$/, "").split("/").pop();
      if (slug) {
        setApps((prev) => [...prev.filter((a) => a.slug !== slug), { slug, url: data.url }]);
      }
    } catch (err) {
      setDeployStates((prev) => ({
        ...prev,
        [index]: { status: "error", message: err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다." },
      }));
    }
  }

  return (
    <div className="flex flex-1 flex-col bg-neutral-950">
      <header className="border-b border-neutral-800 px-6 py-8 sm:px-10">
        <div className="mx-auto max-w-3xl">
          <Link href="/dept/dev" className="text-sm text-neutral-400 hover:text-neutral-200">
            ← 개발
          </Link>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">App Builder</h1>
          <p className="mt-1 text-neutral-400">
            만들고 싶은 작은 웹 도구를 이야기해주세요. 대화하면서 함께 완성하고, 마음에 들면 실제 주소로 바로 배포할 수 있습니다.
          </p>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-8 sm:px-10">
        {apps.length > 0 && (
          <div className="mb-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">지금까지 만든 앱</p>
            <div className="flex flex-wrap gap-2">
              {apps.map((app) => (
                <div
                  key={app.slug}
                  className="flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-900/60 py-1 pl-3 pr-1.5 text-xs"
                >
                  <a href={app.url} target="_blank" rel="noopener noreferrer" className="text-neutral-300 hover:text-neutral-100">
                    {app.slug}
                  </a>
                  <button
                    onClick={() => handleLoadApp(app.slug)}
                    disabled={loadingSlug === app.slug}
                    className="rounded-full bg-orange-500/10 px-2 py-0.5 font-medium text-orange-400 hover:bg-orange-500/20 disabled:opacity-50"
                  >
                    {loadingSlug === app.slug ? "불러오는 중..." : "이어서 수정"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        {appsError && <p className="mb-4 text-xs text-neutral-600">{appsError}</p>}
        {messages.length > 0 && (
          <div className="mb-4 flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-900/40 px-3 py-2">
            <p className="text-xs text-neutral-500">진행 중이던 대화는 브라우저에 자동 저장됩니다.</p>
            <button onClick={handleStartOver} className="text-xs font-medium text-neutral-400 hover:text-neutral-200">
              새로 시작
            </button>
          </div>
        )}
        {error && (
          <p className="mb-4 rounded-lg border border-red-900 bg-red-950/40 p-3 text-sm text-red-400">
            {error}
          </p>
        )}
        <ChatPanel
          messages={messages}
          input={input}
          onInputChange={setInput}
          onSend={handleSend}
          loading={loading}
          placeholder="예: 오늘 할 일을 적으면 우선순위대로 정렬해주는 투두리스트"
          sendButtonClass="bg-orange-500 hover:bg-orange-400"
          assistantRingClass="ring-orange-500/20"
          renderAssistant={(content, index, isStreamingThis) => {
            const hasCode = content.includes("```");
            const deployState = deployStates[index] ?? { status: "idle" };

            const preText = !isStreamingThis ? textBeforeCodeBlock(content) : "";

            return (
              <div>
                {preText && (
                  <div className="mb-3 border-b border-neutral-800 pb-3">
                    <Markdown>{preText}</Markdown>
                  </div>
                )}
                <CodePreviewBubble
                  content={content}
                  index={index}
                  isStreamingThis={isStreamingThis}
                  codeIndices={codeIndices}
                  onToggle={toggleCode}
                  toggleTextClass="text-orange-400"
                  sandbox="allow-scripts"
                />

                {hasCode && !isStreamingThis && (
                  <div className="mt-3 border-t border-neutral-800 pt-3">
                    {deployState.status === "idle" && (
                      <button
                        onClick={() => setDeployStates((prev) => ({ ...prev, [index]: { status: "naming" } }))}
                        className="rounded-lg bg-orange-500/10 px-3 py-1.5 text-xs font-semibold text-orange-400 ring-1 ring-orange-500/30 hover:bg-orange-500/20"
                      >
                        🚀 배포하기
                      </button>
                    )}

                    {deployState.status === "naming" && (
                      <div className="flex flex-wrap items-center gap-2">
                        <input
                          value={deployNames[index] ?? ""}
                          onChange={(e) => setDeployNames((prev) => ({ ...prev, [index]: e.target.value }))}
                          placeholder="앱 이름 (예: todo-list)"
                          className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs text-neutral-100 placeholder:text-neutral-600 focus:border-neutral-600 focus:outline-none"
                        />
                        <button
                          onClick={() => handleDeploy(index, content)}
                          disabled={!(deployNames[index] ?? "").trim()}
                          className="rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-semibold text-neutral-950 hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          이 이름으로 배포 확인
                        </button>
                        <button
                          onClick={() => setDeployStates((prev) => ({ ...prev, [index]: { status: "idle" } }))}
                          className="text-xs text-neutral-500 hover:text-neutral-300"
                        >
                          취소
                        </button>
                      </div>
                    )}

                    {deployState.status === "deploying" && (
                      <p className="text-xs text-neutral-500">배포 중...</p>
                    )}

                    {deployState.status === "done" && (
                      <p className="text-xs text-emerald-400">
                        배포 완료:{" "}
                        <a href={deployState.url} target="_blank" rel="noopener noreferrer" className="underline">
                          {deployState.url}
                        </a>
                      </p>
                    )}

                    {deployState.status === "error" && (
                      <p className="text-xs text-red-400">{deployState.message}</p>
                    )}
                  </div>
                )}
              </div>
            );
          }}
        />
      </main>
    </div>
  );
}
