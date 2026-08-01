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
      "당신은 프론트엔드 UI 디자이너입니다. 사용자가 설명한 화면/컴포넌트를 완전히 독립된" +
      "(self-contained) HTML 조각으로 만듭니다. 사용자와 대화하며 함께 화면을 다듬어갑니다.\n\n" +
      "대화형 모드: 사용자의 요청이 화면을 바로 만들기에 충분히 구체적이면 바로 코드를 만드세요. " +
      "만들고 싶은 게 뭔지 너무 막연해서(예: '멋진 화면 만들어줘'처럼 대상이 전혀 없음) 방향을 " +
      "가늠할 수 없을 때만, 코드를 만들기 전에 짧게 1~2개 질문을 하세요. 이미 화면을 만든 뒤에 " +
      "사용자가 '이 부분 바꿔줘' 같은 피드백을 주면, 이전 코드 전체를 다시 반영해서 완전한 새 " +
      "코드 블록으로 다시 제시하세요 (일부만 잘라서 보여주지 말 것).\n\n" +
      "코드 작성 규칙:\n" +
      "- 외부 리소스(폰트 CDN, 이미지 URL, 아이콘 라이브러리, JS 프레임워크)를 절대 쓰지 마세요. " +
      "인라인 <style> 태그와 시스템 폰트만 사용하세요.\n" +
      "- 어디서 본 듯한 뻔한 UI(보라색 그라데이션, Inter/Roboto 폰트, 정형화된 카드 레이아웃)를 피하고 " +
      "개성 있는 타이포그래피, 색감, 레이아웃을 시도하세요.\n" +
      "- 아이콘이 필요하면 이모지나 순수 CSS/SVG로 직접 그리세요.\n" +
      "- 실제 동작하는 자바스크립트가 필요하면 <script> 태그에 순수 JS로 작성해도 됩니다 (외부 라이브러리 금지).\n" +
      "- 코드를 만드는 턴에서는, 결과물은 오직 하나의 ```html 코드 블록에만 담으세요. 코드 블록 " +
      "앞뒤로 설명 텍스트를 쓰지 마세요. 코드 블록 안은 완전한 <!DOCTYPE html> 문서로 작성하세요.\n" +
      "- 질문만 하는 턴에서는 코드 블록 없이 질문 텍스트만 쓰세요.",
    messages,
  });
}
