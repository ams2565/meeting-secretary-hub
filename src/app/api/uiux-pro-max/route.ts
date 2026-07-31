import { NextRequest, NextResponse } from "next/server";
import { streamText } from "@/lib/streamText";

export async function POST(req: NextRequest) {
  const { page, style } = await req.json();

  if (!page || typeof page !== "string" || !page.trim()) {
    return NextResponse.json({ error: "만들고 싶은 페이지를 설명해주세요." }, { status: 400 });
  }

  return streamText({
    model: "claude-opus-5",
    max_tokens: 16000,
    system:
      "당신은 UI/UX 디자인 전문가입니다. 사용자가 설명한 전체 페이지(랜딩페이지, 대시보드, 앱 화면 등)를 " +
      "지정된 디자인 스타일로 완성도 높은 self-contained HTML 문서로 제작하세요. " +
      "컴포넌트 하나가 아니라 헤더/내비게이션/본문 섹션들/푸터가 갖춰진 완전한 한 페이지를 만드세요.\n\n" +
      "규칙:\n" +
      "- 외부 리소스(폰트 CDN, 이미지 URL, 아이콘 라이브러리, JS 프레임워크)를 절대 쓰지 마세요. " +
      "인라인 <style> 태그와 시스템 폰트만 사용하세요.\n" +
      "- 지정된 스타일 정체성을 색감·타이포그래피·여백·모서리 곡률·그림자 등 디테일까지 일관되게 반영하세요.\n" +
      "- 아이콘이 필요하면 이모지나 순수 CSS/SVG로 직접 그리세요.\n" +
      "- 실제 동작하는 인터랙션이 필요하면 <script> 태그에 순수 JS로 작성해도 됩니다 (외부 라이브러리 금지).\n" +
      "- 결과물은 오직 하나의 ```html 코드 블록에만 담으세요. 코드 블록 앞뒤로 설명 텍스트를 쓰지 마세요.\n" +
      "- 코드 블록 안은 완전한 <!DOCTYPE html> 문서로 작성하세요 (body에 배경색 지정 포함).\n" +
      "- 토큰 예산이 한정되어 있습니다. <style>은 필요한 만큼만 간결하게 작성하고, 반드시 </html>까지 " +
      "완결된 문서로 끝맺으세요. CSS를 정교하게 다듬느라 본문(header/hero/섹션/footer)을 못 쓰고 " +
      "잘리는 일이 없도록, 스타일 디테일보다 완결된 전체 페이지 구조를 우선하세요.",
    messages: [
      {
        role: "user",
        content: `만들고 싶은 페이지: ${page}\n디자인 스타일: ${style?.trim() || "(가장 어울리는 스타일을 자유롭게 선택)"}`,
      },
    ],
  });
}
