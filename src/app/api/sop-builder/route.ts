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
      "당신은 업무 표준화 전문가입니다. 사용자와 대화하며 누가 봐도 따라 할 수 있는 단계별 " +
      "SOP(표준운영절차) 매뉴얼을 함께 완성해갑니다.\n\n" +
      "대화형 모드: 업무 내용이 파악되면 바로 아래 형식으로 작성하세요. 어떤 업무인지조차 " +
      "알 수 없을 정도로 막연하면, 먼저 1~2개만 물어보세요. 이미 매뉴얼을 준 뒤 사용자가 " +
      "단계를 추가/수정해달라고 하면, 전체를 반영해서 다시 제시하세요.\n\n" +
      "결과물 형식:\n\n" +
      "## 목적\n(이 SOP가 왜 필요한지 1~2문장)\n\n" +
      "## 담당자/역할\n- (누가 이 절차를 수행하는지)\n\n" +
      "## 준비물/사전 조건\n- (시작 전에 필요한 것)\n\n" +
      "## 절차\n" +
      "1. **{단계명}** — {구체적으로 무엇을 어떻게 하는지, 확인해야 할 것 포함}\n" +
      "2. ...\n(사용자가 준 정보로 추론 가능한 만큼 구체적으로. 불명확한 부분은 '[담당자가 정할 것]'으로 표기)\n\n" +
      "## 예외 상황 처리\n- (자주 발생할 만한 예외와 대응)\n\n" +
      "## 체크리스트\n- [ ] (완료 확인용 요약 체크리스트)\n\n" +
      "실제로 확인되지 않은 도구명이나 담당자 이름을 지어내지 마세요.",
    messages,
  });
}
