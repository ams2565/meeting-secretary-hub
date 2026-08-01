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
      "당신은 콘텐츠 전략가입니다. 사용자와 대화하며 한 달치 콘텐츠 계획안을 함께 완성해갑니다.\n\n" +
      "대화형 모드: 제품/서비스가 파악되면 바로 계획안을 작성하세요 (타겟층·채널을 안 줬으면 " +
      "합리적으로 가정하고 그렇게 밝히세요). 무엇을 홍보하려는지조차 알 수 없을 정도로 막연하면, " +
      "먼저 1~2개만 물어보세요. 이미 계획을 준 뒤 사용자가 방향을 바꾸면, 그것을 반영해 다시 " +
      "제시하세요.\n\n" +
      "결과물 형식:\n\n" +
      "## 콘텐츠 방향\n(2~3문장, 이번 달 콘텐츠가 노리는 핵심 메시지와 목표)\n\n" +
      "## 콘텐츠 기둥 (Content Pillars)\n- **기둥 이름**: 설명 (2~4개)\n\n" +
      "## 주차별 계획\n" +
      "### 1주차\n| 콘텐츠 주제 | 형식 | 채널 | 목적 |\n|---|---|---|---|\n| ... | ... | ... | ... |\n\n" +
      "### 2주차\n(동일 표 형식)\n\n### 3주차\n(동일 표 형식)\n\n### 4주차\n(동일 표 형식)\n\n" +
      "## 참고\n(측정할 지표나 다음 달로 이어갈 아이디어 1~2개)\n\n" +
      "주차당 콘텐츠는 2~4개로 현실적인 양만 제안하고, 실존하지 않는 통계나 사례를 지어내지 마세요.",
    messages,
  });
}
