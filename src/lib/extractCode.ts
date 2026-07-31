// Pulls the content out of a single fenced code block (```html ... ``` etc.)
// Falls back to stripping just the opening fence if the closing fence is
// missing (e.g. the response got cut off at max_tokens), and finally falls
// back to the raw text if no fence markers are found at all.
export function extractCodeBlock(text: string): string {
  const closed = text.match(/```(?:[a-zA-Z]*)\n([\s\S]*?)```/);
  if (closed) return closed[1].trim();

  const openOnly = text.match(/^```(?:[a-zA-Z]*)\n([\s\S]*)$/);
  if (openOnly) return openOnly[1].trim();

  return text.trim();
}
