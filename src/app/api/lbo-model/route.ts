import { NextRequest, NextResponse } from "next/server";
import { streamText } from "@/lib/streamText";

export async function POST(req: NextRequest) {
  const { business, assumptions } = await req.json();

  if (!business || typeof business !== "string" || !business.trim()) {
    return NextResponse.json({ error: "인수 대상 기업 개요를 입력해주세요." }, { status: 400 });
  }

  return streamText({
    model: "claude-opus-5",
    max_tokens: 4096,
    system:
      "당신은 사모펀드(PE) 인수금융 애널리스트입니다. 사용자가 준 기업 개요를 바탕으로 단순화된 " +
      "차입매수(LBO) 수익률 모델을 한국어로 작성하세요.\n\n" +
      "출력은 반드시 다음 형식을 따르세요:\n\n" +
      "## ⚠️ 주의사항\n" +
      "이 모델은 AI가 제공된 정보만으로 생성한 단순 참고용입니다. LBO는 실사(due diligence), 금융 조달 조건, " +
      "세부 계약 조건에 극도로 민감하므로 실제 거래에는 반드시 인수금융 전문가의 검증을 거치세요.\n\n" +
      "## 가정\n| 항목 | 가정값 | 근거 |\n|---|---|---|\n" +
      "(인수 배수(EV/EBITDA), 레버리지 비율(부채/자기자본), 부채 금리, 5년 후 exit 배수, EBITDA 성장률 — " +
      "사용자가 수치를 안 줬다면 중소 규모 기업 인수 기준 보수적인 업계 통념을 쓰고 그렇게 밝히세요)\n\n" +
      "## 자본 구조 (인수 시점)\n| 항목 | 금액 |\n|---|---|\n| 인수가(EV) | |\n| 부채 조달 | |\n| 자기자본 투입 | |\n\n" +
      "## 5개년 요약\n| 항목 | 1년차 | 2년차 | 3년차 | 4년차 | 5년차(Exit) |\n|---|---|---|---|---|---|\n" +
      "| EBITDA | | | | | |\n| 잔여 부채 | | | | | |\n\n" +
      "## Exit 및 수익률\n- Exit 시점 기업가치\n- Exit 시점 자기자본 가치\n- **추정 IRR**\n- **추정 MOIC(투자배수)**\n\n" +
      "## 민감도 참고\n(레버리지 비율이나 exit 배수가 바뀌면 수익률이 얼마나 크게 흔들리는지 간단히)\n\n" +
      "실존하지 않는 거래 사례나 실적을 지어내지 마세요.",
    messages: [
      {
        role: "user",
        content: `인수 대상 기업 개요: ${business}\n추가 가정/수치: ${assumptions?.trim() || "(제공되지 않음 — 보수적으로 가정)"}`,
      },
    ],
  });
}
