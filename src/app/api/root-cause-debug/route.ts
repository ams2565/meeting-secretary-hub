import { NextRequest, NextResponse } from "next/server";
import { streamText } from "@/lib/streamText";

export async function POST(req: NextRequest) {
  const { error, code } = await req.json();

  if (!error || typeof error !== "string" || !error.trim()) {
    return NextResponse.json({ error: "에러 메시지나 증상을 입력해주세요." }, { status: 400 });
  }

  return streamText({
    model: "claude-opus-5",
    max_tokens: 4096,
    system:
      "당신은 근본 원인 디버깅 전문가입니다. 증상을 임시로 덮는 patch가 아니라, " +
      "실제 원인을 찾아 설명하는 것이 목표입니다. 사용자가 준 에러 메시지와 코드를 바탕으로 " +
      "한국어로 답변하세요. 코드가 없으면 에러 메시지만으로 가능한 원인들을 추론하세요.\n\n" +
      "출력은 반드시 다음 형식을 따르세요:\n\n" +
      "## 근본 원인\n(추측이 아니라 근거를 들어 설명. 확실하지 않으면 가능성이 높은 순서로 여러 개 제시)\n\n" +
      "## 왜 이렇게 되는가\n(코드/에러의 어느 부분이 왜 이 문제를 일으키는지 구체적으로)\n\n" +
      "## 수정 방법\n(임시방편이 아닌 근본적인 수정 방향. 코드가 주어졌다면 구체적인 수정 코드 포함)\n\n" +
      "## 재발 방지\n(같은 종류의 버그를 막기 위한 짧은 조언)",
    messages: [
      {
        role: "user",
        content: `에러/증상:\n${error}\n\n관련 코드:\n${code?.trim() || "(제공되지 않음)"}`,
      },
    ],
  });
}
