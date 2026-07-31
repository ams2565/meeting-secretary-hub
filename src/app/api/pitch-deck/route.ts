import { NextRequest, NextResponse } from "next/server";
import { streamText } from "@/lib/streamText";

export async function POST(req: NextRequest) {
  const { business, stage } = await req.json();

  if (!business || typeof business !== "string" || !business.trim()) {
    return NextResponse.json({ error: "사업 개요를 입력해주세요." }, { status: 400 });
  }

  return streamText({
    model: "claude-opus-5",
    max_tokens: 4096,
    system:
      "당신은 투자 유치 피치덱 컨설턴트입니다. 사용자가 준 사업 개요와 투자 단계를 바탕으로 " +
      "투자자에게 보여줄 피치덱의 슬라이드별 핵심 내용을 한국어로 작성하세요.\n\n" +
      "출력은 반드시 다음 형식을 따르세요:\n\n" +
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
    messages: [
      {
        role: "user",
        content: `사업 개요: ${business}\n투자 단계: ${stage?.trim() || "시드 단계"}`,
      },
    ],
  });
}
