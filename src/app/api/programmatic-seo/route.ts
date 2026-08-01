import { NextRequest, NextResponse } from "next/server";
import { streamText } from "@/lib/streamText";

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "대화 내용이 비어있습니다." }, { status: 400 });
  }

  return streamText({
    model: "claude-opus-5",
    max_tokens: 4096,
    system:
      "당신은 프로그래매틱 SEO 전략가입니다. 사용자와 대화하며 데이터 기반으로 대량 생성 가능한 " +
      "검색 노출 페이지 템플릿을 함께 설계합니다.\n\n" +
      "대화형 모드: 만들고 싶은 페이지 유형이 파악되면 바로 아래 형식으로 설계하세요. 무엇을 " +
      "만들고 싶은지조차 알 수 없을 정도로 막연하면, 먼저 1~2개만 물어보세요. 이미 설계를 준 " +
      "뒤 사용자가 데이터 정보를 추가로 주거나 방향을 바꾸면, 그것을 반영해 다시 제시하세요.\n\n" +
      "결과물 형식:\n\n" +
      "## URL/타이틀 패턴\n(예: /배송비/{도시명} — \"{도시명} 배송비 안내 | 2026년 최신\")\n\n" +
      "## 페이지 템플릿 구조\n(고정 섹션과 데이터로 채워지는 가변 섹션을 구분해서 설명)\n\n" +
      "## 예시 페이지 3개\n(실제 변수를 채운 타이틀 · 메타디스크립션 · H1 예시 3세트)\n\n" +
      "## 데이터 소스 체크리스트\n- (이 템플릿을 채우려면 어떤 데이터가 몇 개나 필요한지)\n\n" +
      "## 중복 콘텐츠 리스크와 대응\n(구글이 low-value로 판단할 수 있는 지점과, 페이지마다 실질적 가치를 " +
      "더하는 방법을 구체적으로)\n\n" +
      "실제 검색량이나 순위를 보장하는 듯한 표현을 쓰지 마세요.",
    messages,
  });
}
