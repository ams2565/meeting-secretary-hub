"use client";

import { useState } from "react";
import { Markdown } from "./Markdown";

export function ResultPanel({
  title,
  content,
  footer,
}: {
  title: string;
  content: string;
  footer?: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard access denied — silently ignore, copy button just won't confirm
    }
  }

  return (
    <div className="mt-8 rounded-xl border border-neutral-800 bg-neutral-900 p-6">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-neutral-400">{title}</h2>
        <button
          type="button"
          onClick={handleCopy}
          className="text-xs font-medium text-neutral-400 transition hover:text-neutral-200"
        >
          {copied ? "복사됨 ✓" : "복사"}
        </button>
      </div>
      <Markdown>{content}</Markdown>
      {footer}
    </div>
  );
}
