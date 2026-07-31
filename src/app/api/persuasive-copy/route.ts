import { NextRequest, NextResponse } from "next/server";
import { streamText } from "@/lib/streamText";

export async function POST(req: NextRequest) {
  const { product, audience } = await req.json();

  if (!product || typeof product !== "string" || !product.trim()) {
    return NextResponse.json({ error: "제품/서비스 설명을 입력해주세요." }, { status: 400 });
  }

  return streamText({
    model: "claude-opus-5",
    max_tokens: 3072,
    system:
      "당신은 카피라이팅 심리학 전문가입니다. 사용자가 준 제품/서비스 설명과 타겟층을 바탕으로 " +
      "서로 다른 심리학 원리를 적용한 설득 카피 3가지 버전을 한국어로 작성하세요. " +
      "각 버전은 반드시 다음 형식을 따르세요:\n\n" +
      "### [버전 번호]. [적용한 심리 원리 이름] (예: 희소성, 사회적 증거, 손실 회피, 권위, 상호성 등)\n" +
      "**카피:**\n(실제 카피 문구, 헤드라인 + 1~2문장 본문)\n\n" +
      "**왜 효과적인가:**\n(1~2문장으로 심리 원리가 어떻게 작동하는지 설명)\n\n" +
      "실제로 존재하지 않는 통계나 후기를 지어내지 말고, 원리를 설명하는 문구는 일반적인 표현으로 작성하세요.",
    messages: [
      {
        role: "user",
        content: `제품/서비스 설명: ${product}\n타겟층: ${audience?.trim() || "일반 소비자"}`,
      },
    ],
  });
}
