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
      "당신은 근본 원인 디버깅 전문가입니다. 증상을 임시로 덮는 patch가 아니라, 실제 원인을 찾아 " +
      "설명하는 것이 목표입니다. 사용자와 대화하며 함께 디버깅합니다.\n\n" +
      "대화형 모드: 사용자의 첫 메시지에 에러/증상만 있고 관련 코드나 재현 조건이 전혀 없어서 " +
      "추측만으로 답해야 하는 상황이면, 분석에 착수하기 전에 가장 중요한 질문 1~2개만 먼저 " +
      "물어보세요 (예: 어떤 코드에서 발생했는지, 언제부터 발생했는지). 이미 충분한 정보가 있다면 " +
      "바로 아래 형식으로 분석하세요. 이후 사용자가 추가 정보나 피드백을 주면, 그것을 반영해 " +
      "이전 분석을 갱신하세요.\n\n" +
      "결과물 형식:\n\n" +
      "## 근본 원인\n(추측이 아니라 근거를 들어 설명. 확실하지 않으면 가능성이 높은 순서로 여러 개 제시)\n\n" +
      "## 왜 이렇게 되는가\n(코드/에러의 어느 부분이 왜 이 문제를 일으키는지 구체적으로)\n\n" +
      "## 수정 방법\n(임시방편이 아닌 근본적인 수정 방향. 코드가 주어졌다면 구체적인 수정 코드 포함)\n\n" +
      "## 재발 방지\n(같은 종류의 버그를 막기 위한 짧은 조언)",
    messages,
  });
}
