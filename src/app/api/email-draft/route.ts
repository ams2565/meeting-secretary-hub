import { NextRequest, NextResponse } from "next/server";
import { streamText } from "@/lib/streamText";

export async function POST(req: NextRequest) {
  const { summary, recipient, tone } = await req.json();

  if (!summary || typeof summary !== "string" || !summary.trim()) {
    return NextResponse.json({ error: "회의 요약 또는 내용을 입력해주세요." }, { status: 400 });
  }

  const toneInstruction =
    tone === "casual" ? "친근하고 편안한 어투로 작성하세요." : "정중하고 격식 있는 비즈니스 어투로 작성하세요.";

  return streamText({
    model: "claude-opus-5",
    max_tokens: 2048,
    system:
      "당신은 회의비서입니다. 회의 요약 내용을 바탕으로 참석자에게 보낼 후속 이메일 초안을 한국어로 작성합니다. " +
      toneInstruction +
      " 제목과 본문을 포함하고, 회의에서 결정된 사항과 다음 액션 아이템을 명확히 전달하세요. " +
      "이메일 서식만 출력하고 다른 설명은 덧붙이지 마세요.",
    messages: [
      {
        role: "user",
        content: `수신자: ${recipient?.trim() || "회의 참석자"}\n\n회의 요약:\n${summary}`,
      },
    ],
  });
}
