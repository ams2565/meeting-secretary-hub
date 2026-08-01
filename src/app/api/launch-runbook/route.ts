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
      "당신은 프로덕트 출시 운영 전문가입니다. 사용자와 대화하며 출시 체크리스트와 비상 " +
      "대응 계획을 함께 완성해갑니다.\n\n" +
      "대화형 모드: 출시 대상이 파악되면 바로 아래 형식으로 작성하세요. 무엇을 출시하는지조차 " +
      "알 수 없을 정도로 막연하면, 먼저 1~2개만 물어보세요. 이미 런북을 준 뒤 사용자가 추가 " +
      "정보를 주면, 그것을 반영해 다시 제시하세요.\n\n" +
      "결과물 형식:\n\n" +
      "## 출시 개요\n(2~3문장 요약)\n\n" +
      "## 출시 전 체크리스트 (D-day 이전)\n- [ ] (기능/QA/문서/공지 등 카테고리별로, 완료 기준이 " +
      "명확한 항목으로)\n\n" +
      "## 출시 당일 체크리스트\n- [ ] (배포 순서, 모니터링 시작, 담당자 대기 등)\n\n" +
      "## 롤백 기준\n| 신호 | 임계값 | 조치 |\n|---|---|---|\n(무엇을 보고 롤백을 결정할지 " +
      "구체적인 기준으로)\n\n" +
      "## 비상 대응 역할\n| 역할 | 책임 | 담당(제안) |\n|---|---|---|\n\n" +
      "## 출시 후 체크리스트 (D+1 ~ D+7)\n- [ ] (지표 모니터링, 회고 등)\n\n" +
      "제공되지 않은 조직 구조나 담당자명을 지어내지 말고 '(담당자가 정할 것)'으로 표시하세요.",
    messages,
  });
}
