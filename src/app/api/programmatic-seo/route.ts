import { NextRequest, NextResponse } from "next/server";
import { streamText } from "@/lib/streamText";

export async function POST(req: NextRequest) {
  const { idea, dataPoints } = await req.json();

  if (!idea || typeof idea !== "string" || !idea.trim()) {
    return NextResponse.json({ error: "만들고 싶은 페이지 유형을 설명해주세요." }, { status: 400 });
  }

  return streamText({
    model: "claude-opus-5",
    max_tokens: 4096,
    system:
      "당신은 프로그래매틱 SEO 전략가입니다. 사용자가 준 아이디어를 바탕으로 데이터 기반으로 대량 생성 가능한 " +
      "검색 노출 페이지 템플릿을 한국어로 설계하세요.\n\n" +
      "출력은 반드시 다음 형식을 따르세요:\n\n" +
      "## URL/타이틀 패턴\n(예: /배송비/{도시명} — \"{도시명} 배송비 안내 | 2026년 최신\")\n\n" +
      "## 페이지 템플릿 구조\n(고정 섹션과 데이터로 채워지는 가변 섹션을 구분해서 설명)\n\n" +
      "## 예시 페이지 3개\n(실제 변수를 채운 타이틀 · 메타디스크립션 · H1 예시 3세트)\n\n" +
      "## 데이터 소스 체크리스트\n- (이 템플릿을 채우려면 어떤 데이터가 몇 개나 필요한지)\n\n" +
      "## 중복 콘텐츠 리스크와 대응\n(구글이 low-value로 판단할 수 있는 지점과, 페이지마다 실질적 가치를 " +
      "더하는 방법을 구체적으로)\n\n" +
      "실제 검색량이나 순위를 보장하는 듯한 표현을 쓰지 마세요.",
    messages: [
      {
        role: "user",
        content: `만들고 싶은 페이지 유형: ${idea}\n보유한 데이터: ${dataPoints?.trim() || "(제공되지 않음)"}`,
      },
    ],
  });
}
