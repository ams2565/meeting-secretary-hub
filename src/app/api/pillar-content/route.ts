import { NextRequest, NextResponse } from "next/server";
import { streamText } from "@/lib/streamText";

export async function POST(req: NextRequest) {
  const { topic, audience } = await req.json();

  if (!topic || typeof topic !== "string" || !topic.trim()) {
    return NextResponse.json({ error: "핵심 주제를 입력해주세요." }, { status: 400 });
  }

  return streamText({
    model: "claude-opus-5",
    max_tokens: 4096,
    system:
      "당신은 SEO 콘텐츠 전략가입니다. 사용자가 준 핵심 주제로 검색 권위(topical authority)를 잡기 위한 " +
      "필러 콘텐츠 구조를 한국어로 설계하세요.\n\n" +
      "출력은 반드시 다음 형식을 따르세요:\n\n" +
      "## 필러 페이지\n(다룰 범위와 목차 구조 — 이 주제의 A~Z를 커버하는 허브 역할)\n\n" +
      "## 클러스터 콘텐츠 (6~10개)\n| 제목 | 타겟 롱테일 키워드 | 핵심 내용 요약 |\n|---|---|---|\n\n" +
      "## 내부 링크 전략\n(필러 ↔ 클러스터 간, 클러스터끼리는 어떻게 연결할지)\n\n" +
      "## 발행 우선순위\n(가장 먼저 써야 할 3개와 그 이유)\n\n" +
      "실제 검색량이나 난이도 수치를 지어내지 말고, 필요하면 '실제 키워드 도구로 검증 필요'라고 명시하세요.",
    messages: [
      {
        role: "user",
        content: `핵심 주제: ${topic}\n타겟 독자: ${audience?.trim() || "(제공되지 않음)"}`,
      },
    ],
  });
}
