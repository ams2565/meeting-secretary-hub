"use client";

import { useEffect, useRef } from "react";
import { Markdown } from "@/components/Markdown";
import { Spinner } from "@/components/Spinner";
import { downloadAsWord, downloadAsExcel } from "@/lib/exportFile";
import type { ChatMessage } from "@/lib/chat";

export function ChatPanel({
  messages,
  input,
  onInputChange,
  onSend,
  loading,
  placeholder,
  sendButtonClass,
  assistantRingClass,
  renderAssistant,
  exportFormat,
  exportFilenamePrefix,
}: {
  messages: ChatMessage[];
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  loading: boolean;
  placeholder: string;
  sendButtonClass: string;
  assistantRingClass: string;
  renderAssistant?: (content: string, index: number, loading: boolean) => React.ReactNode;
  exportFormat?: "docx" | "xlsx";
  exportFilenamePrefix?: string;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!loading && input.trim()) onSend();
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 space-y-5 overflow-y-auto pb-4">
        {messages.length === 0 && (
          <p className="rounded-xl border border-dashed border-neutral-800 p-6 text-center text-sm text-neutral-500">
            아래에 요청을 입력하면 대화가 시작됩니다. 처음부터 완벽하게 안 적으셔도, 필요하면 먼저
            질문을 드릴게요.
          </p>
        )}

        {messages.map((m, i) => {
          const isLast = i === messages.length - 1;
          const isStreamingThis = isLast && loading && m.role === "assistant";
          return (
            <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
              {m.role === "user" ? (
                <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-neutral-800 px-4 py-2.5 text-sm text-neutral-100 whitespace-pre-wrap">
                  {m.content}
                </div>
              ) : (
                <div
                  className={`w-full max-w-full rounded-2xl rounded-bl-sm border border-neutral-800 bg-neutral-900/60 px-4 py-3 ring-1 ${assistantRingClass}`}
                >
                  {m.content ? (
                    renderAssistant ? (
                      renderAssistant(m.content, i, isStreamingThis)
                    ) : (
                      <>
                        <Markdown>{m.content}</Markdown>
                        {exportFormat && !isStreamingThis && (
                          <button
                            onClick={() =>
                              (exportFormat === "docx" ? downloadAsWord : downloadAsExcel)(
                                m.content,
                                `${exportFilenamePrefix ?? "결과"}-${i + 1}`,
                              )
                            }
                            className="mt-3 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs font-medium text-neutral-300 hover:border-neutral-700 hover:text-neutral-100"
                          >
                            {exportFormat === "docx" ? "📄 Word 파일로 저장" : "📊 Excel 파일로 저장"}
                          </button>
                        )}
                      </>
                    )
                  ) : (
                    <span className="flex items-center gap-2 text-sm text-neutral-500">
                      <Spinner /> 생각 중...
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="sticky bottom-0 flex flex-col gap-2 border-t border-neutral-800 bg-neutral-950 pt-4">
        <textarea
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={3}
          className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-3.5 text-sm text-neutral-100 placeholder:text-neutral-600 focus:border-neutral-600 focus:outline-none"
        />
        <button
          onClick={onSend}
          disabled={loading || !input.trim()}
          className={`flex w-fit items-center gap-2 self-end rounded-lg px-5 py-2.5 text-sm font-semibold text-neutral-950 transition disabled:cursor-not-allowed disabled:opacity-50 ${sendButtonClass}`}
        >
          {loading && <Spinner />}
          {loading ? "생성 중..." : "보내기"}
        </button>
      </div>
    </div>
  );
}
