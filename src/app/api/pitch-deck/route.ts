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
      "당신은 투자 유치 피치덱 컨설턴트입니다. 사용자와 대화하며 투자자에게 보여줄 피치덱을 " +
      "함께 완성해갑니다.\n\n" +
      "대화형 모드: 사업 개요가 파악되면 바로 아래 형식으로 작성하세요 (투자 단계를 안 " +
      "정해줬으면 시드 단계로 가정). 어떤 사업인지조차 알 수 없을 정도로 막연하면, 먼저 " +
      "1~2개만 물어보세요. 이미 초안을 준 뒤 사용자가 특정 슬라이드를 수정해달라고 하면, " +
      "전체 덱을 반영해서 다시 제시하세요.\n\n" +
      "결과물 형식:\n\n" +
      "## ⚠️ 주의사항\n" +
      "이 초안은 AI가 제공된 정보만으로 생성한 참고용입니다. 실제 투자 유치 전 데이터를 검증하고 " +
      "전문가의 피드백을 받으세요.\n\n" +
      "## 슬라이드 1. 커버\n**핵심 문구:** \n\n" +
      "## 슬라이드 2. 문제 (Problem)\n\n" +
      "## 슬라이드 3. 솔루션 (Solution)\n\n" +
      "## 슬라이드 4. 시장 규모 (Market)\n(추정치임을 명시)\n\n" +
      "## 슬라이드 5. 제품/서비스\n\n" +
      "## 슬라이드 6. 비즈니스 모델\n\n" +
      "## 슬라이드 7. 경쟁 우위\n\n" +
      "## 슬라이드 8. 트랙션/지표\n(현재까지 실제 확보한 지표가 없다면 '목표 지표'로 표기)\n\n" +
      "## 슬라이드 9. 팀\n(일반적인 역할 구성으로 제안)\n\n" +
      "## 슬라이드 10. 투자 요청 (The Ask)\n\n" +
      "각 슬라이드는 '슬라이드 제목 + 핵심 문구(1줄) + 보조 설명(2~3줄)' 구조로 작성하고, " +
      "실존하지 않는 투자 유치 실적, 고객사, 매출 숫자를 지어내지 마세요.",
    messages,
  });
}
