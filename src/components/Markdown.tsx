"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function Markdown({ children }: { children: string }) {
  return (
    <div className="text-sm leading-relaxed text-neutral-200">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="mb-3 mt-6 text-xl font-bold text-neutral-50 first:mt-0">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="mb-2 mt-6 border-b border-neutral-800 pb-2 text-lg font-bold text-neutral-50 first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mb-1 mt-4 text-base font-semibold text-neutral-100">{children}</h3>
          ),
          p: ({ children }) => <p className="mb-3 text-neutral-200 last:mb-0">{children}</p>,
          strong: ({ children }) => <strong className="font-semibold text-neutral-50">{children}</strong>,
          em: ({ children }) => <em className="text-neutral-300">{children}</em>,
          ul: ({ children }) => <ul className="mb-3 list-disc space-y-1 pl-5 text-neutral-200">{children}</ul>,
          ol: ({ children }) => <ol className="mb-3 list-decimal space-y-1 pl-5 text-neutral-200">{children}</ol>,
          li: ({ children }) => <li className="pl-1">{children}</li>,
          hr: () => <hr className="my-5 border-neutral-800" />,
          code: ({ children }) => (
            <code className="rounded bg-neutral-800 px-1.5 py-0.5 font-mono text-xs text-neutral-100">
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="mb-3 overflow-x-auto rounded-lg border border-neutral-800 bg-neutral-950 p-3 text-xs">
              {children}
            </pre>
          ),
          table: ({ children }) => (
            <div className="mb-3 overflow-x-auto rounded-lg border border-neutral-800">
              <table className="w-full border-collapse text-left text-xs">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-neutral-900">{children}</thead>,
          th: ({ children }) => (
            <th className="border-b border-neutral-700 px-3 py-2 font-semibold text-neutral-300">{children}</th>
          ),
          td: ({ children }) => (
            <td className="border-t border-neutral-800 px-3 py-2 align-top text-neutral-200">{children}</td>
          ),
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="text-indigo-400 underline underline-offset-2 hover:text-indigo-300"
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="mb-3 border-l-2 border-neutral-700 pl-3 text-neutral-400 italic">
              {children}
            </blockquote>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
