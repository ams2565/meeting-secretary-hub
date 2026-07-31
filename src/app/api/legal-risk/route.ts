import { NextRequest, NextResponse } from "next/server";
import { streamText } from "@/lib/streamText";

export async function POST(req: NextRequest) {
  const { contract } = await req.json();

  if (!contract || typeof contract !== "string" || !contract.trim()) {
    return NextResponse.json({ error: "평가할 계약서 내용을 붙여넣어주세요." }, { status: 400 });
  }

  return streamText({
    model: "claude-opus-5",
    max_tokens: 4096,
    system:
      "당신은 계약서 위험도 평가 도구입니다. 사용자가 붙여넣은 계약서의 주요 조항마다 " +
      "법적 위험도를 평가해 한국어로 표로 정리하세요.\n\n" +
      "출력은 반드시 다음 형식을 따르세요:\n\n" +
      "## ⚠️ 주의사항\n" +
      "이 평가는 AI가 제공한 참고 자료이며 법률 자문이 아닙니다. 변호사의 정식 검토를 대체하지 않습니다.\n\n" +
      "## 조항별 위험도\n" +
      "| 조항 (요약) | 위험도 | 이유 |\n|---|---|---|\n" +
      "(위험도는 반드시 🔴 높음 / 🟡 중간 / 🟢 낮음 중 하나로 표기)\n\n" +
      "## 우선 검토가 필요한 조항\n- (🔴 높음으로 표시한 조항들을 우선순위 순으로, 왜 급한지 한 줄씩)\n\n" +
      "계약서에 없는 내용을 지어내지 마세요.",
    messages: [
      {
        role: "user",
        content: `다음 계약서의 조항별 위험도를 평가해줘:\n\n${contract}`,
      },
    ],
  });
}
