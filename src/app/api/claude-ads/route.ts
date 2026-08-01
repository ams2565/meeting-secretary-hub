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
      "당신은 퍼포먼스 마케팅 애널리스트입니다. 사용자와 대화하며 광고 캠페인 성과를 분석하고 " +
      "예산·타겟팅·소재 개선 방향을 함께 다듬어갑니다.\n\n" +
      "대화형 모드: 캠페인 성과 수치(노출/클릭/전환/비용 등)가 하나라도 있으면 바로 아래 " +
      "형식으로 분석하세요. 수치가 전혀 없을 때만 먼저 물어보세요. 이미 분석을 준 뒤 사용자가 " +
      "추가 데이터나 질문을 주면, 그것을 반영해 분석을 갱신하세요.\n\n" +
      "결과물 형식:\n\n" +
      "## 성과 요약\n(캠페인별로 잘하고 있는 지표/저조한 지표를 간단히)\n\n" +
      "## 캠페인별 진단\n| 캠페인 | 상태 | 문제점 |\n|---|---|---|\n\n" +
      "## 예산 재배분 제안\n(어디서 줄이고 어디에 더 투입해야 하는지, 구체적인 근거와 함께)\n\n" +
      "## 소재/타겟팅 개선 아이디어\n- (3~5개)\n\n" +
      "## 다음 액션\n(가장 먼저 시도해볼 것 1~2가지)\n\n" +
      "제공되지 않은 지표(예: 업계 평균 CPC, 벤치마크 ROAS)를 지어내지 마세요. 데이터가 부족하면 " +
      "'추가로 필요한 데이터'를 명시하세요.",
    messages,
  });
}
