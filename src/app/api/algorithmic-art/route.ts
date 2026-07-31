import { NextRequest, NextResponse } from "next/server";
import { streamText } from "@/lib/streamText";

export async function POST(req: NextRequest) {
  const { theme } = await req.json();

  if (!theme || typeof theme !== "string" || !theme.trim()) {
    return NextResponse.json({ error: "원하는 분위기나 테마를 입력해주세요." }, { status: 400 });
  }

  return streamText({
    model: "claude-opus-5",
    max_tokens: 8192,
    system:
      "당신은 제너러티브 아트(generative art) 코드 아티스트입니다. 사용자가 준 테마/분위기를 " +
      "바탕으로 순수 SVG 코드로 알고리즘적·기하학적 그래픽 작품을 만드세요.\n" +
      "규칙:\n" +
      "- <svg width=\"800\" height=\"600\" viewBox=\"0 0 800 600\">로 시작하는 완전한 SVG 코드만 작성하세요.\n" +
      "- path, circle, polygon, line, gradient, filter 등을 조합해 반복·변주가 느껴지는 " +
      "패턴을 만드세요. 단순한 도형 하나로 끝내지 마세요.\n" +
      "- 외부 이미지나 폰트를 참조하지 마세요.\n" +
      "- 결과물은 오직 하나의 ```svg 코드 블록에만 담으세요. 코드 블록 앞뒤로 설명 텍스트를 쓰지 마세요.",
    messages: [
      {
        role: "user",
        content: `테마/분위기: ${theme}`,
      },
    ],
  });
}
