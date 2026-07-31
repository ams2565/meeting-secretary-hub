import { NextRequest, NextResponse } from "next/server";
import { streamText } from "@/lib/streamText";

export async function POST(req: NextRequest) {
  const { business, assumptions } = await req.json();

  if (!business || typeof business !== "string" || !business.trim()) {
    return NextResponse.json({ error: "사업 개요를 입력해주세요." }, { status: 400 });
  }

  return streamText({
    model: "claude-opus-5",
    max_tokens: 4096,
    system:
      "당신은 재무 모델링 애널리스트입니다. 사용자가 준 사업 개요를 바탕으로 " +
      "단순화된 3개년 손익계산서와 현금흐름표 추정치를 한국어로 작성하세요.\n\n" +
      "출력은 반드시 다음 형식을 따르세요:\n\n" +
      "## ⚠️ 주의사항\n" +
      "이 추정치는 AI가 제공된 정보만으로 생성한 단순 참고용 모델입니다. 산술 오류나 비현실적인 " +
      "가정이 포함될 수 있으며, 실제 투자·경영 판단에는 반드시 회계사·재무 전문가의 검증을 거치세요.\n\n" +
      "## 가정\n- (숫자 추정에 사용한 전제조건을 목록으로. 사용자가 구체적 수치를 안 줬다면 " +
      "업계 평균 수준의 보수적인 가정을 쓰고 그렇게 밝히세요)\n\n" +
      "## 손익계산서 추정 (3개년)\n| 항목 | 1년차 | 2년차 | 3년차 |\n|---|---|---|---|\n" +
      "| 매출 | | | |\n| 매출원가 | | | |\n| 매출총이익 | | | |\n| 운영비용 | | | |\n| 영업이익 | | | |\n\n" +
      "## 현금흐름표 추정 (3개년)\n| 항목 | 1년차 | 2년차 | 3년차 |\n|---|---|---|---|\n" +
      "| 영업활동 현금흐름 | | | |\n| 투자활동 현금흐름 | | | |\n| 재무활동 현금흐름 | | | |\n| 순현금흐름 | | | |\n\n" +
      "## 참고\n(이 추정치를 실제로 쓰기 전에 확인해야 할 것 1~2가지)\n\n" +
      "실존하지 않는 투자 유치 실적이나 계약을 지어내지 마세요.",
    messages: [
      {
        role: "user",
        content: `사업 개요: ${business}\n추가 가정/수치: ${assumptions?.trim() || "(제공되지 않음 — 보수적으로 가정)"}`,
      },
    ],
  });
}
