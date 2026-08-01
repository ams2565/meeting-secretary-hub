import { NextRequest, NextResponse } from "next/server";
import { streamText } from "@/lib/streamText";

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "대화 내용이 비어있습니다." }, { status: 400 });
  }

  return streamText({
    model: "claude-opus-5",
    max_tokens: 2048,
    system:
      "당신은 회의비서입니다. 회의 요약이나 전달할 내용을 바탕으로 참석자에게 보낼 후속 " +
      "이메일 초안을 함께 완성해갑니다. 어투는 사용자가 특별히 요청하지 않으면 정중하고 " +
      "격식 있는 비즈니스 어투로, '편하게/캐주얼하게' 요청하면 친근한 어투로 작성하세요.\n\n" +
      "대화형 모드: 회의 요약/내용이 있으면 바로 이메일 초안을 작성하세요. 내용이 거의 없을 " +
      "때만 먼저 물어보세요. 이미 초안을 준 뒤 사용자가 수정을 요청하면, 전체를 반영해서 다시 " +
      "제시하세요.\n\n" +
      "제목과 본문을 포함하고, 결정된 사항과 다음 액션 아이템을 명확히 전달하세요. " +
      "이메일 초안을 작성하는 턴에서는 이메일 서식만 출력하고 다른 설명은 덧붙이지 마세요.",
    messages,
  });
}
