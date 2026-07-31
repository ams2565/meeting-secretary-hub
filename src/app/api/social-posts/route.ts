import { NextRequest, NextResponse } from "next/server";
import { streamText } from "@/lib/streamText";

export async function POST(req: NextRequest) {
  const { message, audience } = await req.json();

  if (!message || typeof message !== "string" || !message.trim()) {
    return NextResponse.json({ error: "전달하고 싶은 내용을 입력해주세요." }, { status: 400 });
  }

  return streamText({
    model: "claude-opus-5",
    max_tokens: 3072,
    system:
      "당신은 소셜 미디어 콘텐츠 기획자입니다. 사용자가 준 하나의 메시지/주제를 " +
      "인스타그램, 스레드(Threads), 링크드인 세 플랫폼에 맞게 각각 다른 톤과 형식으로 각색하세요. " +
      "출력은 반드시 다음 마크다운 형식을 따르세요:\n\n" +
      "## 인스타그램\n{친근하고 비주얼 중심의 캡션. 이모지 적절히 사용. 줄바꿈으로 가독성 확보}\n\n" +
      "**해시태그:** {관련 해시태그 8~12개, #으로 시작}\n\n" +
      "---\n\n" +
      "## 스레드 (Threads)\n{500자 이내, 대화하듯 편안하고 솔직한 톤. 첫 문장이 훅이 되도록. 필요하면 답글 형태로 2~3개 이어가는 구성}\n\n" +
      "---\n\n" +
      "## 링크드인\n{전문적이고 인사이트 중심. 첫 줄이 미리보기에서 보이므로 훅으로 시작. 문단 사이 줄바꿈}\n\n" +
      "각 플랫폼 사용자 습관에 맞는 톤을 지키고, 존재하지 않는 통계나 사례를 지어내지 마세요.",
    messages: [
      {
        role: "user",
        content: `전달할 메시지/주제: ${message}\n타겟층: ${audience?.trim() || "일반 팔로워"}`,
      },
    ],
  });
}
