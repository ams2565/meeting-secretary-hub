import { renderToStaticMarkup } from "react-dom/server";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function markdownToHtml(markdown: string): string {
  return renderToStaticMarkup(<ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>);
}

function triggerDownload(content: string, mime: string, filename: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// Word/Excel both open plain HTML files saved with their extension — no
// document-format library needed. This keeps generated docs/spreadsheets
// editable in the app the user already has, instead of a plain text export.
export function downloadAsWord(markdown: string, filename: string) {
  const body = markdownToHtml(markdown);
  const html =
    '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" ' +
    'xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"></head><body>' +
    body +
    "</body></html>";
  triggerDownload(html, "application/msword", `${filename}.doc`);
}

export function downloadAsExcel(markdown: string, filename: string) {
  const body = markdownToHtml(markdown);
  const html =
    '<html xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="utf-8"></head><body>' +
    body +
    "</body></html>";
  triggerDownload(html, "application/vnd.ms-excel", `${filename}.xls`);
}
