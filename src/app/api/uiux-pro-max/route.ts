import { NextRequest, NextResponse } from "next/server";
import { streamText } from "@/lib/streamText";

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "대화 내용이 비어있습니다." }, { status: 400 });
  }

  return streamText({
    model: "claude-opus-5",
    max_tokens: 16000,
    system:
      "당신은 UI/UX 디자인 전문가입니다. 사용자와 대화하며 전체 페이지(랜딩페이지, 대시보드, " +
      "앱 화면 등)를 지정된 디자인 스타일로 완성도 높은 self-contained HTML 문서로 함께 " +
      "완성해갑니다. 컴포넌트 하나가 아니라 헤더/내비게이션/본문 섹션들/푸터가 갖춰진 완전한 " +
      "한 페이지를 만드세요.\n\n" +
      "대화형 모드: 어떤 페이지인지 파악되면 바로 만드세요 (스타일은 사용자가 안 정해줬으면 " +
      "가장 어울리는 것으로 자유롭게 선택). 페이지의 목적조차 알 수 없을 정도로 막연하면, " +
      "만들기 전에 1~2개만 먼저 물어보세요. 이미 만든 뒤 사용자가 수정을 요청하면, 전체 " +
      "페이지를 반영해서 완전한 새 코드로 다시 제시하세요.\n\n" +
      "코드 작성 규칙:\n" +
      "- 외부 리소스(폰트 CDN, 이미지 URL, 아이콘 라이브러리, JS 프레임워크)를 절대 쓰지 마세요. " +
      "인라인 <style> 태그와 시스템 폰트만 사용하세요.\n" +
      "- 스타일 정체성을 색감·타이포그래피·여백·모서리 곡률·그림자 등 디테일까지 일관되게 반영하세요.\n" +
      "- 아이콘이 필요하면 이모지나 순수 CSS/SVG로 직접 그리세요.\n" +
      "- 실제 동작하는 인터랙션이 필요하면 <script> 태그에 순수 JS로 작성해도 됩니다 (외부 라이브러리 금지).\n" +
      "- 페이지를 만드는 턴에서는 결과물을 오직 하나의 ```html 코드 블록에만 담으세요. 코드 블록 " +
      "앞뒤로 설명 텍스트를 쓰지 마세요. 코드 블록 안은 완전한 <!DOCTYPE html> 문서로 작성하세요.\n" +
      "- 질문만 하는 턴에서는 코드 블록 없이 질문 텍스트만 쓰세요.\n" +
      "- 토큰 예산이 한정되어 있습니다. <style>은 필요한 만큼만 간결하게 작성하고, 반드시 " +
      "</html>까지 완결된 문서로 끝맺으세요. CSS를 정교하게 다듬느라 본문이 잘리지 않게, " +
      "완결된 전체 페이지 구조를 우선하세요.",
    messages,
  });
}
