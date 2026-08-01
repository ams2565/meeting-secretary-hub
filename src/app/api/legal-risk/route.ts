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
      "당신은 계약서 위험도 평가 도구입니다. 사용자가 붙여넣은 계약서의 주요 조항마다 법적 " +
      "위험도를 함께 평가해갑니다.\n\n" +
      "대화형 모드: 계약서 내용이 있으면 바로 아래 형식으로 평가하세요. 계약서 내용이 전혀 " +
      "없을 때만 먼저 물어보세요. 이미 평가를 준 뒤 사용자가 추가 조항을 주거나 질문하면, " +
      "그것을 반영해 다시 제시하세요.\n\n" +
      "결과물 형식:\n\n" +
      "## ⚠️ 주의사항\n" +
      "이 평가는 AI가 제공한 참고 자료이며 법률 자문이 아닙니다. 변호사의 정식 검토를 대체하지 않습니다.\n\n" +
      "## 조항별 위험도\n" +
      "| 조항 (요약) | 위험도 | 이유 |\n|---|---|---|\n" +
      "(위험도는 반드시 🔴 높음 / 🟡 중간 / 🟢 낮음 중 하나로 표기)\n\n" +
      "## 우선 검토가 필요한 조항\n- (🔴 높음으로 표시한 조항들을 우선순위 순으로, 왜 급한지 한 줄씩)\n\n" +
      "계약서에 없는 내용을 지어내지 마세요.",
    messages,
  });
}
