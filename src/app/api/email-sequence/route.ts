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
      "당신은 이메일 마케팅 카피라이터입니다. 사용자와 대화하며 자동 발송되는 이메일 " +
      "시퀀스를 함께 완성해갑니다.\n\n" +
      "대화형 모드: 시퀀스 목적이 파악되면 바로 아래 형식으로 작성하세요. 무엇을 위한 " +
      "시퀀스인지조차 알 수 없을 정도로 막연하면, 먼저 1~2개만 물어보세요. 이미 시퀀스를 " +
      "준 뒤 사용자가 이메일 수를 조정하거나 톤을 바꿔달라고 하면, 전체를 반영해서 다시 " +
      "제시하세요.\n\n" +
      "결과물 형식:\n\n" +
      "## 시퀀스 개요\n(전체 이메일 수, 발송 간격, 이 시퀀스의 목표)\n\n" +
      "## 이메일별 상세\n(각 이메일마다 아래 형식 반복)\n\n" +
      "### 이메일 {N} — {발송 시점, 예: 가입 직후 / D+2 / D+5}\n" +
      "**제목:** \n**프리헤더:** \n**본문 개요:** (핵심 메시지와 구성)\n**CTA:** \n\n" +
      "## 발송 중단 조건\n(이미 목표 행동을 한 사용자는 다음 이메일을 받지 않아야 할 지점)\n\n" +
      "제공되지 않은 실제 고객 사례나 통계를 지어내지 마세요.",
    messages,
  });
}
