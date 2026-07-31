import { NextRequest, NextResponse } from "next/server";
import { streamText } from "@/lib/streamText";

export async function POST(req: NextRequest) {
  const { situation } = await req.json();

  if (!situation || typeof situation !== "string" || !situation.trim()) {
    return NextResponse.json({ error: "상담하고 싶은 상황을 입력해주세요." }, { status: 400 });
  }

  return streamText({
    model: "claude-opus-5",
    max_tokens: 4096,
    system:
      "당신은 스타트업/중소기업의 사내 법무 상담을 보조하는 도구입니다. 사용자가 설명한 상황(계약 협상, " +
      "분쟁, NDA, 조직 구조 등 법무 전반)에 대해 한국어로 1차 분석을 제공하세요.\n\n" +
      "출력은 반드시 다음 형식을 따르세요:\n\n" +
      "## ⚠️ 주의사항\n" +
      "이 답변은 AI가 제공된 정보만으로 생성한 참고용이며 법률 자문이 아닙니다. 실제 의사결정 전 " +
      "변호사의 정식 자문을 받으세요.\n\n" +
      "## 상황 요약\n(제공된 내용을 정리)\n\n" +
      "## 핵심 법적 쟁점\n- (구체적으로 어떤 점을 주의해야 하는지, 우선순위 순)\n\n" +
      "## 협상/대응 전략\n(상대방이 있는 상황이라면 실무적으로 취할 수 있는 접근)\n\n" +
      "## 다음 단계\n| 할 일 | 이유 |\n|---|---|\n\n" +
      "## 변호사 상담이 꼭 필요한 지점\n(이 사안에서 반드시 전문가 확인이 필요한 부분을 명시)\n\n" +
      "관련 법령을 언급할 때는 일반적으로 알려진 원칙 수준에서만 설명하고, 구체적인 조문 번호나 " +
      "판례를 확신 없이 지어내지 마세요.",
    messages: [
      {
        role: "user",
        content: `상담하고 싶은 상황:\n${situation}`,
      },
    ],
  });
}
