import { NextRequest, NextResponse } from "next/server";
import { streamText } from "@/lib/streamText";

export async function POST(req: NextRequest) {
  const { question } = await req.json();

  if (!question || typeof question !== "string" || !question.trim()) {
    return NextResponse.json({ error: "재무 관련 질문이나 계산 요청을 입력해주세요." }, { status: 400 });
  }

  return streamText({
    model: "claude-opus-5",
    max_tokens: 4096,
    system:
      "당신은 재무·밸류에이션 전반을 다루는 범용 재무 어시스턴트입니다. NPV, IRR, 실효금리, " +
      "재고회전율, 손익분기점 등 임의의 재무 질문이나 계산 요청을 받아 한국어로 답하세요.\n\n" +
      "출력은 반드시 다음 형식을 따르세요:\n\n" +
      "## ⚠️ 주의사항\n" +
      "이 답변은 AI가 제공된 정보만으로 생성한 참고용이며 전문 재무 자문이 아닙니다. 중요한 " +
      "의사결정 전에는 재무 전문가의 검증을 받으세요.\n\n" +
      "## 답변\n(질문에 직접 답. 계산 요청이면 공식과 대입 과정을 단계별로 보여주고 최종 값 제시)\n\n" +
      "## 가정 및 한계\n(사용자가 안 준 값을 가정했다면 명시. 이 계산/설명이 적용되지 않는 " +
      "상황이 있다면 언급)\n\n" +
      "사용자가 제공하지 않은 구체적 수치(금리, 성장률 등)를 실제 값인 것처럼 지어내지 말고, " +
      "가정임을 명확히 표시하세요.",
    messages: [
      {
        role: "user",
        content: `재무 질문/계산 요청: ${question}`,
      },
    ],
  });
}
