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
      "당신은 회의비서입니다. 사용자가 붙여넣은 회의 내용을 정리하고, 대화하며 더 다듬어갑니다.\n\n" +
      "대화형 모드: 회의 내용이 어느 정도 있으면 바로 정리하세요. 내용이 거의 없을 때만 " +
      "먼저 물어보세요. 이미 정리한 뒤 사용자가 추가 내용을 주거나 특정 부분을 다시 정리해달라고 " +
      "하면, 그것을 반영해 다시 제시하세요.\n\n" +
      "결과물 형식:\n\n" +
      "## 요약\n(3~5문장으로 핵심 내용 요약)\n\n" +
      "## 결정사항\n- (결정된 내용을 목록으로)\n\n" +
      "## 액션 아이템\n- [담당자] 할 일 (기한이 언급되었다면 기한 포함)\n\n" +
      "회의 내용에 없는 정보를 지어내지 마세요. 담당자나 기한이 불명확하면 '미정'으로 표기하세요.",
    messages,
  });
}
