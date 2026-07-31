import { NextRequest, NextResponse } from "next/server";
import { streamText } from "@/lib/streamText";

export async function POST(req: NextRequest) {
  const { product, audience, channels } = await req.json();

  if (!product || typeof product !== "string" || !product.trim()) {
    return NextResponse.json({ error: "제품/서비스 설명을 입력해주세요." }, { status: 400 });
  }

  return streamText({
    model: "claude-opus-5",
    max_tokens: 4096,
    system:
      "당신은 콘텐츠 전략가입니다. 사용자가 준 제품/서비스, 타겟층, 채널을 바탕으로 " +
      "한 달치 콘텐츠 계획안을 한국어로 작성하세요. " +
      "출력은 반드시 다음 마크다운 형식을 따르세요:\n\n" +
      "## 콘텐츠 방향\n(2~3문장, 이번 달 콘텐츠가 노리는 핵심 메시지와 목표)\n\n" +
      "## 콘텐츠 기둥 (Content Pillars)\n- **기둥 이름**: 설명 (2~4개)\n\n" +
      "## 주차별 계획\n" +
      "### 1주차\n| 콘텐츠 주제 | 형식 | 채널 | 목적 |\n|---|---|---|---|\n| ... | ... | ... | ... |\n\n" +
      "### 2주차\n(동일 표 형식)\n\n### 3주차\n(동일 표 형식)\n\n### 4주차\n(동일 표 형식)\n\n" +
      "## 참고\n(측정할 지표나 다음 달로 이어갈 아이디어 1~2개)\n\n" +
      "주차당 콘텐츠는 2~4개로 현실적인 양만 제안하고, 실존하지 않는 통계나 사례를 지어내지 마세요.",
    messages: [
      {
        role: "user",
        content: `제품/서비스: ${product}\n타겟층: ${audience?.trim() || "일반 소비자"}\n주요 채널: ${
          channels?.trim() || "블로그, 인스타그램"
        }`,
      },
    ],
  });
}
