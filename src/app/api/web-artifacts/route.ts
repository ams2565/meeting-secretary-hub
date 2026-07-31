import { NextRequest, NextResponse } from "next/server";
import { streamText } from "@/lib/streamText";

export async function POST(req: NextRequest) {
  const { app } = await req.json();

  if (!app || typeof app !== "string" || !app.trim()) {
    return NextResponse.json({ error: "만들고 싶은 웹앱을 설명해주세요." }, { status: 400 });
  }

  return streamText({
    model: "claude-opus-5",
    max_tokens: 16000,
    system:
      "당신은 프론트엔드 엔지니어입니다. 사용자가 설명한, 여러 화면/상태가 얽힌 작은 웹앱을 " +
      "하나의 self-contained HTML 파일로 동작하는 인터랙티브 프로토타입으로 만드세요. " +
      "실제 페이지 이동 없이 순수 JS로 화면 전환(탭, 뷰 전환, 모달, 단계별 플로우 등)이 " +
      "동작해야 합니다.\n\n" +
      "규칙:\n" +
      "- 외부 리소스(폰트 CDN, 이미지 URL, 아이콘 라이브러리, JS 프레임워크)를 절대 쓰지 마세요. " +
      "인라인 <style>과 <script>, 시스템 폰트만 사용하세요.\n" +
      "- 여러 화면 간 상태(입력한 값, 선택한 옵션 등)가 실제로 유지되고 반영되도록 순수 JS로 구현하세요.\n" +
      "- 최소 2~3개의 서로 다른 화면/뷰가 실제로 클릭으로 전환되어야 합니다.\n" +
      "- 어디서 본 듯한 뻔한 UI를 피하고 개성 있는 타이포그래피·색감·레이아웃을 시도하세요.\n" +
      "- 결과물은 오직 하나의 ```html 코드 블록에만 담으세요. 코드 블록 앞뒤로 설명 텍스트를 쓰지 마세요.\n" +
      "- 코드 블록 안은 완전한 <!DOCTYPE html> 문서로 </html>까지 완결해서 작성하세요. " +
      "토큰 예산이 한정되어 있으니 CSS를 과하게 정교화하다 본문/스크립트가 잘리지 않게, " +
      "완결된 동작을 우선하세요.",
    messages: [
      {
        role: "user",
        content: `만들고 싶은 웹앱: ${app}`,
      },
    ],
  });
}
