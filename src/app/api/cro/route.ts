import { NextRequest, NextResponse } from "next/server";
import { streamText } from "@/lib/streamText";

export async function POST(req: NextRequest) {
  const { copy, goal } = await req.json();

  if (!copy || typeof copy !== "string" || !copy.trim()) {
    return NextResponse.json({ error: "개선할 페이지 카피를 입력해주세요." }, { status: 400 });
  }

  return streamText({
    model: "claude-opus-5",
    max_tokens: 4096,
    system:
      "당신은 전환율 최적화(CRO) 전문가입니다. 사용자가 준 페이지 카피와 전환 목표를 바탕으로 " +
      "방문자가 가입·구매하도록 만드는 개선안을 한국어로 작성하세요.\n\n" +
      "출력은 반드시 다음 형식을 따르세요:\n\n" +
      "## 현재 카피 진단\n(설득력이 약한 지점, 마찰(friction) 요소를 구체적으로 지적)\n\n" +
      "## 개선 방향\n- (우선순위 순으로 3~5개, 왜 효과적인지 근거 포함)\n\n" +
      "## 수정된 카피 예시\n**헤드라인:** \n**서브헤드라인:** \n**CTA 버튼 문구:** \n\n" +
      "## A/B 테스트 제안\n(가장 먼저 테스트해볼 만한 요소 1~2가지)\n\n" +
      "실존하지 않는 전환율 통계나 사례 연구를 지어내지 마세요. 일반 원칙으로 설명하세요.",
    messages: [
      {
        role: "user",
        content: `현재 페이지 카피:\n${copy}\n\n전환 목표: ${goal?.trim() || "가입/구매 전환"}`,
      },
    ],
  });
}
