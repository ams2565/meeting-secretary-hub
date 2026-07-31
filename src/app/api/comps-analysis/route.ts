import { NextRequest, NextResponse } from "next/server";
import { streamText } from "@/lib/streamText";

export async function POST(req: NextRequest) {
  const { business, comps } = await req.json();

  if (!business || typeof business !== "string" || !business.trim()) {
    return NextResponse.json({ error: "가치를 산정할 기업 개요를 입력해주세요." }, { status: 400 });
  }

  return streamText({
    model: "claude-opus-5",
    max_tokens: 4096,
    system:
      "당신은 비교기업 분석(Comparable Company Analysis) 애널리스트입니다. 사용자가 준 기업 개요와 " +
      "비교 기업 정보를 바탕으로 상대가치평가를 한국어로 작성하세요.\n\n" +
      "가장 중요한 규칙: 실제 상장기업의 현재 주가·배수(P/E, EV/EBITDA 등)는 실시간 시장 데이터가 " +
      "있어야만 정확합니다. 당신은 그 데이터에 접근할 수 없으므로, 사용자가 비교기업의 배수를 " +
      "직접 제공하지 않았다면 특정 회사명에 구체적인 배수 숫자를 절대 지어내 붙이지 마세요. " +
      "이 경우 '일반적인 업종 평균 범위(참고용, 실제 아님)'라고 명확히 표시한 뒤 진행하세요.\n\n" +
      "출력은 반드시 다음 형식을 따르세요:\n\n" +
      "## ⚠️ 주의사항\n" +
      "이 분석은 AI가 제공된 정보만으로 생성한 참고용이며, 실시간 시장 데이터를 반영하지 않습니다. " +
      "실제 배수는 반드시 최신 시장 데이터로 재확인하세요.\n\n" +
      "## 비교 기업 요약\n| 기업 | 사업 유사성 | 제공된 배수 |\n|---|---|---|\n" +
      "(사용자가 배수를 안 줬으면 '제공되지 않음 — 아래는 일반 업종 평균 범위' 명시)\n\n" +
      "## 적용 배수 산정\n(비교기업 배수 중 어떤 걸 기준으로 삼을지, 대상 기업이 비교기업 대비 " +
      "저평가/고평가 요인이 있는지 — 규모, 성장률, 수익성 차이로 조정 근거 설명)\n\n" +
      "## 가치 산정\n| 지표 | 대상 기업 수치 | 적용 배수 | 산정 가치 |\n|---|---|---|---|\n\n" +
      "## 밸류에이션 범위\n(보수적/중간/낙관적 3가지 시나리오)\n\n" +
      "## 한계\n(comps 방식이 이 케이스에서 특히 주의해야 할 점 — 비교기업 표본이 작거나 " +
      "사업모델 차이가 클 때의 왜곡 가능성)",
    messages: [
      {
        role: "user",
        content: `가치를 산정할 기업 개요: ${business}\n비교 기업 정보(있다면 회사명·배수 포함): ${comps?.trim() || "(제공되지 않음)"}`,
      },
    ],
  });
}
