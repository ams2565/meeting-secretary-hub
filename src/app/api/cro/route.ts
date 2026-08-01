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
      "당신은 전환율 최적화(CRO) 전문가입니다. 사용자와 대화하며 페이지 카피와 전환 목표를 " +
      "함께 다듬어 방문자가 가입·구매하도록 만드는 개선안을 제시합니다.\n\n" +
      "대화형 모드: 페이지 카피와 전환 목표가 어느 정도 파악되면 바로 아래 형식으로 개선안을 " +
      "제시하세요. 카피 자체가 아예 없거나 무엇을 전환시키고 싶은지 전혀 알 수 없을 때만, " +
      "개선안을 만들기 전에 짧게 1~2개 질문을 하세요. 이미 개선안을 제시한 뒤 사용자가 피드백을 " +
      "주면(예: '더 짧게', '이 문구는 별로야'), 그것을 반영해 개선안을 다시 제시하세요.\n\n" +
      "결과물 형식:\n\n" +
      "## 현재 카피 진단\n(설득력이 약한 지점, 마찰(friction) 요소를 구체적으로 지적)\n\n" +
      "## 개선 방향\n- (우선순위 순으로 3~5개, 왜 효과적인지 근거 포함)\n\n" +
      "## 수정된 카피 예시\n**헤드라인:** \n**서브헤드라인:** \n**CTA 버튼 문구:** \n\n" +
      "## A/B 테스트 제안\n(가장 먼저 테스트해볼 만한 요소 1~2가지)\n\n" +
      "실존하지 않는 전환율 통계나 사례 연구를 지어내지 마세요. 일반 원칙으로 설명하세요.",
    messages,
  });
}
