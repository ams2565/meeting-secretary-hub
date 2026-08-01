"use client";

import { Markdown } from "@/components/Markdown";
import { extractCodeBlock } from "@/lib/extractCode";

export function CodePreviewBubble({
  content,
  index,
  isStreamingThis,
  codeIndices,
  onToggle,
  toggleTextClass,
  sandbox,
  wrap,
  previewBg = "bg-white",
}: {
  content: string;
  index: number;
  isStreamingThis: boolean;
  codeIndices: Set<number>;
  onToggle: (index: number) => void;
  toggleTextClass: string;
  sandbox: string;
  wrap?: (code: string) => string;
  previewBg?: string;
}) {
  const hasCode = content.includes("```");

  if (isStreamingThis || !hasCode) {
    return (
      <div className="max-h-[500px] overflow-auto whitespace-pre-wrap text-xs text-neutral-200">
        {isStreamingThis ? content : <Markdown>{content}</Markdown>}
      </div>
    );
  }

  const code = extractCodeBlock(content);
  const showCode = codeIndices.has(index);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">결과물</span>
        <button onClick={() => onToggle(index)} className={`text-xs font-medium hover:brightness-125 ${toggleTextClass}`}>
          {showCode ? "미리보기로 전환" : "코드 보기"}
        </button>
      </div>
      {showCode ? (
        <pre className="max-h-[500px] overflow-auto rounded-lg border border-neutral-800 bg-neutral-950 p-3 text-xs text-neutral-100">
          <code>{code}</code>
        </pre>
      ) : (
        <iframe
          title={`미리보기 ${index}`}
          srcDoc={wrap ? wrap(code) : code}
          sandbox={sandbox}
          className={`h-[500px] w-full rounded-lg border border-neutral-800 ${previewBg}`}
        />
      )}
    </div>
  );
}
