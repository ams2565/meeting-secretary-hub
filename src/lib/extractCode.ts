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

// Returns any text before the first fenced code block (e.g. a research
// summary written ahead of the generated code). Empty if the fence starts
// at (or before) the beginning of the text.
export function textBeforeCodeBlock(text: string): string {
  const index = text.indexOf("```");
  if (index <= 0) return "";
  return text.slice(0, index).trim();
}
