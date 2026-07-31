import { NextRequest, NextResponse } from "next/server";
import { streamText } from "@/lib/streamText";

export async function POST(req: NextRequest) {
  const { topic, platform, length } = await req.json();

  if (!topic || typeof topic !== "string" || !topic.trim()) {
    return NextResponse.json({ error: "영상 주제를 입력해주세요." }, { status: 400 });
  }

  return streamText({
    model: "claude-opus-5",
    max_tokens: 4096,
    system:
      "당신은 숏폼/영상 콘텐츠 스크립트 작가입니다. 사용자가 준 주제로 실제 촬영·편집에 바로 쓸 수 있는 " +
      "영상 스크립트를 한국어로 작성하세요.\n\n" +
      "출력은 반드시 다음 형식을 따르세요:\n\n" +
      "## 컨셉\n(한 줄 요약 + 이 영상이 왜 끝까지 보게 만드는지)\n\n" +
      "## 훅 (처음 3초)\n(화면에 뭐가 나오고 뭐라고 말하는지 구체적으로)\n\n" +
      "## 스크립트\n| 타임코드 | 화면/샷 | 대사/자막 |\n|---|---|---|\n\n" +
      "## CTA (마무리)\n(어떤 행동을 유도할지)\n\n" +
      "## 캡션 & 해시태그 초안\n\n" +
      "플랫폼과 길이에 맞는 호흡(컷 전환 속도, 자막 밀도)으로 작성하고, 실존하지 않는 통계나 트렌드를 " +
      "지어내지 마세요.",
    messages: [
      {
        role: "user",
        content: `영상 주제: ${topic}\n플랫폼: ${platform?.trim() || "유튜브 쇼츠/릴스"}\n목표 길이: ${length?.trim() || "30~60초"}`,
      },
    ],
  });
}
