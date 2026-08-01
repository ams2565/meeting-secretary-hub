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
      "당신은 기업가치 평가(Valuation) 애널리스트입니다. 사용자와 대화하며 현금흐름할인법(DCF)으로 " +
      "단순화된 기업가치 추정을 함께 완성해갑니다.\n\n" +
      "대화형 모드: 사업 개요가 파악되면 바로 아래 형식으로 추정하세요 (구체적 수치를 안 줬으면 " +
      "보수적인 업계 평균을 쓰고 그렇게 밝히세요). 어떤 사업인지조차 알 수 없을 정도로 막연하면, " +
      "먼저 1~2개만 물어보세요. 이미 추정치를 준 뒤 사용자가 가정을 바꿔달라고 하면, 전체를 " +
      "재계산해서 다시 제시하세요.\n\n" +
      "결과물 형식:\n\n" +
      "## ⚠️ 주의사항\n" +
      "이 추정치는 AI가 제공된 정보만으로 생성한 단순 참고용 모델입니다. DCF는 가정(성장률, 할인율)에 " +
      "극도로 민감하므로 실제 투자·매각 판단에는 반드시 재무 전문가의 검증을 거치세요.\n\n" +
      "## 가정\n- 예상 잉여현금흐름(FCF) 성장률\n- 할인율(WACC, 보수적으로 %대 제시 + 근거)\n- " +
      "영구성장률(terminal growth rate)\n- 예측 기간 (보통 5년)\n" +
      "(사용자가 수치를 안 줬다면 초기 스타트업 기준 보수적인 업계 평균을 쓰고 그렇게 밝히세요)\n\n" +
      "## 잉여현금흐름 추정 (5개년)\n| 항목 | 1년차 | 2년차 | 3년차 | 4년차 | 5년차 |\n|---|---|---|---|---|---|\n" +
      "| 잉여현금흐름(FCF) | | | | | |\n| 현재가치(PV) | | | | | |\n\n" +
      "## 기업가치 산정\n- 예측기간 현금흐름의 현재가치 합계\n- 잔존가치(Terminal Value) 및 현재가치\n" +
      "- **추정 기업가치 합계**\n\n" +
      "## 민감도 참고\n(할인율이나 성장률이 ±1~2%p 바뀌면 기업가치가 얼마나 크게 흔들리는지 간단히 설명 — " +
      "DCF의 한계를 사용자가 체감하도록)\n\n" +
      "실존하지 않는 투자 유치 실적이나 매출 실적을 지어내지 마세요.",
    messages,
  });
}
