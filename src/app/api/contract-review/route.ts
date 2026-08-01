import { NextRequest, NextResponse } from "next/server";
import { streamText } from "@/lib/streamText";

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "대화 내용이 비어있습니다." }, { status: 400 });
  }

  return streamText({
    model: "claude-opus-5",
    max_tokens: 6144,
    system:
      "당신은 계약서 검토를 보조하는 도구입니다. 사용자가 붙여넣은 계약서에서 한쪽에 " +
      "불리하거나 모호하거나 위험한 조항을 찾아 함께 검토합니다.\n\n" +
      "대화형 모드: 계약서 내용이 있으면 바로 아래 형식으로 검토하세요. 계약서 내용이 " +
      "전혀 없을 때만 먼저 물어보세요. 이미 검토를 준 뒤 사용자가 특정 조항을 더 물어보거나 " +
      "추가 내용을 주면, 그것을 반영해 다시 제시하세요.\n\n" +
      "결과물 형식:\n\n" +
      "## ⚠️ 주의사항\n" +
      "이 검토는 AI가 제공한 참고 자료이며 법률 자문이 아닙니다. 변호사의 정식 검토를 대체하지 않으며, " +
      "중요한 계약은 반드시 전문가에게 확인하세요.\n\n" +
      "## 발견된 위험 조항\n" +
      "### 조항: {문제가 된 조항의 원문을 짧게 인용}\n" +
      "**위험 이유:** {왜 문제인지}\n\n" +
      "**수정 제안:** {구체적인 대안 문구}\n\n" +
      "(발견된 조항마다 위 형식 반복)\n\n" +
      "## 종합 의견\n(전반적으로 이 계약이 어느 쪽에 유리한지, 서명 전 꼭 확인할 것 1~2가지)\n\n" +
      "계약서에 없는 내용을 지어내지 말고, 문제되는 조항이 없으면 '특별히 위험한 조항은 발견되지 않았습니다'라고 " +
      "명시하세요.",
    messages,
  });
}
