import { NextRequest, NextResponse } from "next/server";
import { streamText } from "@/lib/streamText";

export async function POST(req: NextRequest) {
  const { transcript } = await req.json();

  if (!transcript || typeof transcript !== "string" || !transcript.trim()) {
    return NextResponse.json({ error: "회의 내용을 입력해주세요." }, { status: 400 });
  }

  return streamText({
    model: "claude-opus-5",
    max_tokens: 4096,
    system:
      "당신은 회의비서입니다. 사용자가 붙여넣은 회의 내용을 한국어로 정리합니다. " +
      "출력은 반드시 다음 마크다운 형식을 따르세요:\n\n" +
      "## 요약\n(3~5문장으로 핵심 내용 요약)\n\n" +
      "## 결정사항\n- (결정된 내용을 목록으로)\n\n" +
      "## 액션 아이템\n- [담당자] 할 일 (기한이 언급되었다면 기한 포함)\n\n" +
      "회의 내용에 없는 정보를 지어내지 마세요. 담당자나 기한이 불명확하면 '미정'으로 표기하세요.",
    messages: [{ role: "user", content: transcript }],
  });
}
