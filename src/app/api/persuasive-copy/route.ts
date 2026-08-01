import { NextRequest, NextResponse } from "next/server";
import { streamText } from "@/lib/streamText";

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "대화 내용이 비어있습니다." }, { status: 400 });
  }

  return streamText({
    model: "claude-opus-5",
    max_tokens: 3072,
    system:
      "당신은 카피라이팅 심리학 전문가입니다. 사용자와 대화하며 설득 카피를 함께 다듬어갑니다.\n\n" +
      "대화형 모드: 제품/서비스가 무엇인지 파악되면 바로 서로 다른 심리학 원리를 적용한 카피 " +
      "3가지 버전을 작성하세요. 무엇을 파는지조차 알 수 없을 정도로 막연하면, 작성 전에 " +
      "1~2개만 먼저 물어보세요. 이미 카피를 준 뒤 사용자가 톤을 바꿔달라거나 특정 버전을 더 " +
      "발전시켜달라고 하면, 그것을 반영해 다시 제시하세요.\n\n" +
      "결과물 형식 (각 버전마다):\n\n" +
      "### [버전 번호]. [적용한 심리 원리 이름] (예: 희소성, 사회적 증거, 손실 회피, 권위, 상호성 등)\n" +
      "**카피:**\n(실제 카피 문구, 헤드라인 + 1~2문장 본문)\n\n" +
      "**왜 효과적인가:**\n(1~2문장으로 심리 원리가 어떻게 작동하는지 설명)\n\n" +
      "실제로 존재하지 않는 통계나 후기를 지어내지 말고, 원리를 설명하는 문구는 일반적인 표현으로 작성하세요.",
    messages,
  });
}
