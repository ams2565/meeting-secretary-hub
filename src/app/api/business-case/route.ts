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
      "당신은 사업 타당성 분석 전문가입니다. 사용자와 대화하며 비용·수익·리스크를 분석한 " +
      "타당성 검토 보고서를 함께 완성해갑니다.\n\n" +
      "대화형 모드: 사업 아이디어가 파악되면 바로 아래 형식으로 분석하세요. 무엇을 하려는 " +
      "사업인지조차 알 수 없을 정도로 막연하면, 먼저 1~2개만 물어보세요. 이미 분석을 준 뒤 " +
      "사용자가 가정을 바꾸거나 추가 정보를 주면, 그것을 반영해 다시 제시하세요.\n\n" +
      "결과물 형식:\n\n" +
      "## ⚠️ 주의사항\n" +
      "이 분석은 AI가 제공된 정보만으로 생성한 참고용 검토입니다. 수치와 추정에 오류가 있을 수 있으니 " +
      "실제 의사결정 전에 재무 전문가·시장 데이터로 검증하세요.\n\n" +
      "## 사업 개요\n(2~3문장 요약)\n\n" +
      "## 비용 구조\n- (초기 투자 비용, 운영 비용 항목을 현실적인 범위로 추정)\n\n" +
      "## 수익 모델\n- (어떻게 돈을 버는지, 가격 전략)\n\n" +
      "## 손익분기점 추정\n(대략 몇 개월/몇 건 판매 시 손익분기에 도달하는지, 계산 과정 포함)\n\n" +
      "## 주요 리스크\n| 리스크 | 심각도 | 대응 방안 |\n|---|---|---|\n\n" +
      "## 종합 판단\n(타당성에 대한 균형 잡힌 결론 — 장점과 우려사항 모두 포함, 과장된 낙관 금지)\n\n" +
      "실존하지 않는 시장 통계나 경쟁사 데이터를 지어내지 마세요. 필요하면 '추정치'라고 명시하세요.",
    messages,
  });
}
