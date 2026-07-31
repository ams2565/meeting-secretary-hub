import { NextRequest, NextResponse } from "next/server";
import { streamText } from "@/lib/streamText";

export async function POST(req: NextRequest) {
  const { idea } = await req.json();

  if (!idea || typeof idea !== "string" || !idea.trim()) {
    return NextResponse.json({ error: "사업 아이디어를 입력해주세요." }, { status: 400 });
  }

  return streamText({
    model: "claude-opus-5",
    max_tokens: 4096,
    system:
      "당신은 사업 타당성 분석 전문가입니다. 사용자가 준 사업 아이디어를 바탕으로 " +
      "비용·수익·리스크를 분석한 타당성 검토 보고서를 한국어로 작성하세요.\n\n" +
      "출력은 반드시 다음 형식을 따르세요:\n\n" +
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
    messages: [
      {
        role: "user",
        content: `사업 아이디어: ${idea}`,
      },
    ],
  });
}
