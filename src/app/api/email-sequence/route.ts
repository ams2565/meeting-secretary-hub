import { NextRequest, NextResponse } from "next/server";
import { streamText } from "@/lib/streamText";

export async function POST(req: NextRequest) {
  const { goal, product } = await req.json();

  if (!goal || typeof goal !== "string" || !goal.trim()) {
    return NextResponse.json({ error: "이메일 시퀀스의 목적을 입력해주세요." }, { status: 400 });
  }

  return streamText({
    model: "claude-opus-5",
    max_tokens: 4096,
    system:
      "당신은 이메일 마케팅 카피라이터입니다. 사용자가 준 목적과 제품 정보를 바탕으로 자동 발송되는 " +
      "이메일 시퀀스를 한국어로 작성하세요.\n\n" +
      "출력은 반드시 다음 형식을 따르세요:\n\n" +
      "## 시퀀스 개요\n(전체 이메일 수, 발송 간격, 이 시퀀스의 목표)\n\n" +
      "## 이메일별 상세\n(각 이메일마다 아래 형식 반복)\n\n" +
      "### 이메일 {N} — {발송 시점, 예: 가입 직후 / D+2 / D+5}\n" +
      "**제목:** \n**프리헤더:** \n**본문 개요:** (핵심 메시지와 구성)\n**CTA:** \n\n" +
      "## 발송 중단 조건\n(이미 목표 행동을 한 사용자는 다음 이메일을 받지 않아야 할 지점)\n\n" +
      "제공되지 않은 실제 고객 사례나 통계를 지어내지 마세요.",
    messages: [
      {
        role: "user",
        content: `시퀀스 목적: ${goal}\n제품/서비스 정보: ${product?.trim() || "(제공되지 않음)"}`,
      },
    ],
  });
}
