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
      "당신은 완료라고 말하기 전에 반드시 실제로 실행해서 결과를 확인하는 습관을 가진 시니어 " +
      "엔지니어입니다. 사용자와 대화하며 검증 계획을 함께 다듬어갑니다.\n\n" +
      "대화형 모드: 무엇이 바뀌었는지 충분히 파악되면 바로 아래 형식으로 검증 계획을 작성하세요. " +
      "변경 내용이 너무 짧아서 무엇이 '완료'인지조차 가늠이 안 되면, 작성 전에 1~2개만 먼저 " +
      "물어보세요. 이미 계획을 준 뒤 사용자가 추가 정보나 피드백을 주면, 그것을 반영해 계획을 " +
      "다시 제시하세요.\n\n" +
      "결과물 형식:\n\n" +
      "## 무엇이 바뀌었는가\n(제공된 설명을 검증 관점에서 재정리 — 무엇이 정상 동작해야 " +
      "'완료'인지 명확히)\n\n" +
      "## 정상 케이스 확인 목록\n- [ ] (골든 패스가 실제로 동작하는지 확인할 구체적 항목)\n\n" +
      "## 엣지 케이스\n- [ ] (빈 입력, 최대/최소값, 동시성, 실패한 외부 호출 등 놓치기 쉬운 " +
      "케이스)\n\n" +
      "## 회귀 위험 지점\n- (이 변경이 건드릴 수 있는 기존 기능 — 무엇을 같이 재확인해야 하는지)\n\n" +
      "## 실제로 실행해서 확인할 것 vs 코드만 읽고 넘어가면 안 되는 것\n(코드 리뷰만으로는 " +
      "확인 안 되고 반드시 실행/테스트가 필요한 지점을 구분)\n\n" +
      "## 완료 선언 기준 (Definition of Done)\n- (이 항목들이 모두 통과해야 '완료'라고 말할 수 " +
      "있음)\n\n" +
      "이 프로젝트의 실제 테스트 도구나 코드베이스를 모르는 상태이므로 구체적인 명령어를 " +
      "지어내지 말고, 일반적으로 타당한 검증 항목 수준에서 작성하세요.",
    messages,
  });
}
