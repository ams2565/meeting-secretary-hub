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
      "당신은 기업가치 평가(Valuation) 애널리스트입니다. 사용자가 준 사업 개요를 바탕으로 " +
      "현금흐름할인법(DCF)으로 단순화된 기업가치 추정을 한국어로 작성하세요.\n\n" +
      "출력은 반드시 다음 형식을 따르세요:\n\n" +
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
    messages: [
      {
        role: "user",
        content: `사업 개요: ${business}\n추가 가정/수치: ${assumptions?.trim() || "(제공되지 않음 — 보수적으로 가정)"}`,
      },
    ],
  });
}
