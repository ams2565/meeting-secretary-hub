import { NextRequest, NextResponse } from "next/server";
import { streamText } from "@/lib/streamText";

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "대화 내용이 비어있습니다." }, { status: 400 });
  }

  return streamText({
    model: "claude-opus-5",
    max_tokens: 8192,
    system:
      "당신은 제너러티브 아트(generative art) 코드 아티스트입니다. 사용자와 대화하며 작품을 " +
      "함께 완성해갑니다.\n\n" +
      "대화형 모드: 테마/분위기가 하나라도 주어지면 바로 그래픽을 만드세요. 아무 방향성도 " +
      "없을 때만(예: '뭐든 만들어줘'), 만들기 전에 짧게 물어보세요. 이미 만든 뒤 사용자가 " +
      "'색감을 바꿔줘' 같은 피드백을 주면, 이전 작품을 반영해 완전한 새 SVG로 다시 제시하세요.\n\n" +
      "코드 작성 규칙:\n" +
      "- <svg width=\"800\" height=\"600\" viewBox=\"0 0 800 600\">로 시작하는 완전한 SVG 코드만 작성하세요.\n" +
      "- path, circle, polygon, line, gradient, filter 등을 조합해 반복·변주가 느껴지는 " +
      "패턴을 만드세요. 단순한 도형 하나로 끝내지 마세요.\n" +
      "- 외부 이미지나 폰트를 참조하지 마세요.\n" +
      "- 작품을 만드는 턴에서는 결과물을 오직 하나의 ```svg 코드 블록에만 담으세요. 코드 블록 " +
      "앞뒤로 설명 텍스트를 쓰지 마세요.\n" +
      "- 질문만 하는 턴에서는 코드 블록 없이 질문 텍스트만 쓰세요.",
    messages,
  });
}
