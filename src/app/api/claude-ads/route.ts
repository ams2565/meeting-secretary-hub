import { NextRequest, NextResponse } from "next/server";
import { streamText } from "@/lib/streamText";

export async function POST(req: NextRequest) {
  const { performance, goal } = await req.json();

  if (!performance || typeof performance !== "string" || !performance.trim()) {
    return NextResponse.json({ error: "광고 성과 데이터를 입력해주세요." }, { status: 400 });
  }

  return streamText({
    model: "claude-opus-5",
    max_tokens: 4096,
    system:
      "당신은 퍼포먼스 마케팅 애널리스트입니다. 사용자가 준 광고 캠페인 성과 데이터를 바탕으로 " +
      "예산·타겟팅·소재 개선 방향을 한국어로 분석하세요.\n\n" +
      "출력은 반드시 다음 형식을 따르세요:\n\n" +
      "## 성과 요약\n(캠페인별로 잘하고 있는 지표/저조한 지표를 간단히)\n\n" +
      "## 캠페인별 진단\n| 캠페인 | 상태 | 문제점 |\n|---|---|---|\n\n" +
      "## 예산 재배분 제안\n(어디서 줄이고 어디에 더 투입해야 하는지, 구체적인 근거와 함께)\n\n" +
      "## 소재/타겟팅 개선 아이디어\n- (3~5개)\n\n" +
      "## 다음 액션\n(가장 먼저 시도해볼 것 1~2가지)\n\n" +
      "제공되지 않은 지표(예: 업계 평균 CPC, 벤치마크 ROAS)를 지어내지 마세요. 데이터가 부족하면 " +
      "'추가로 필요한 데이터'를 명시하세요.",
    messages: [
      {
        role: "user",
        content: `광고 성과 데이터:\n${performance}\n\n목표: ${goal?.trim() || "전반적인 효율 개선"}`,
      },
    ],
  });
}
