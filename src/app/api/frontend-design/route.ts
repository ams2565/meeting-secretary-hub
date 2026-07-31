import { NextRequest, NextResponse } from "next/server";
import { streamText } from "@/lib/streamText";

export async function POST(req: NextRequest) {
  const { description, style } = await req.json();

  if (!description || typeof description !== "string" || !description.trim()) {
    return NextResponse.json({ error: "만들고 싶은 화면을 설명해주세요." }, { status: 400 });
  }

  return streamText({
    model: "claude-opus-5",
    max_tokens: 8192,
    system:
      "당신은 프론트엔드 UI 디자이너입니다. 사용자가 설명한 화면/컴포넌트를 " +
      "완전히 독립된(self-contained) HTML 조각으로 만드세요. " +
      "규칙:\n" +
      "- 외부 리소스(폰트 CDN, 이미지 URL, 아이콘 라이브러리, JS 프레임워크)를 절대 쓰지 마세요. " +
      "인라인 <style> 태그와 시스템 폰트만 사용하세요.\n" +
      "- 어디서 본 듯한 뻔한 UI(보라색 그라데이션, Inter/Roboto 폰트, 정형화된 카드 레이아웃)를 피하고 " +
      "개성 있는 타이포그래피, 색감, 레이아웃을 시도하세요.\n" +
      "- 아이콘이 필요하면 이모지나 순수 CSS/SVG로 직접 그리세요.\n" +
      "- 실제 동작하는 자바스크립트가 필요하면 <script> 태그에 순수 JS로 작성해도 됩니다 (외부 라이브러리 금지).\n" +
      "- 결과물은 오직 하나의 ```html 코드 블록에만 담으세요. 코드 블록 앞뒤로 설명 텍스트를 쓰지 마세요.\n" +
      "- 코드 블록 안은 완전한 <!DOCTYPE html> 문서로 작성하세요 (body에 배경색 지정 포함).",
    messages: [
      {
        role: "user",
        content: `만들고 싶은 화면: ${description}\n스타일 힌트: ${style?.trim() || "(자유롭게, 단 개성 있게)"}`,
      },
    ],
  });
}
