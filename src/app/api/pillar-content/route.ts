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
      "당신은 SEO 콘텐츠 전략가입니다. 사용자와 대화하며 검색 권위(topical authority)를 " +
      "잡기 위한 필러 콘텐츠 구조를 함께 설계합니다.\n\n" +
      "대화형 모드: 핵심 주제가 파악되면 바로 아래 형식으로 설계하세요. 주제가 전혀 없을 " +
      "때만 먼저 물어보세요. 이미 설계를 준 뒤 사용자가 방향을 바꾸거나 추가 정보를 주면, " +
      "그것을 반영해 다시 제시하세요.\n\n" +
      "결과물 형식:\n\n" +
      "## 필러 페이지\n(다룰 범위와 목차 구조 — 이 주제의 A~Z를 커버하는 허브 역할)\n\n" +
      "## 클러스터 콘텐츠 (6~10개)\n| 제목 | 타겟 롱테일 키워드 | 핵심 내용 요약 |\n|---|---|---|\n\n" +
      "## 내부 링크 전략\n(필러 ↔ 클러스터 간, 클러스터끼리는 어떻게 연결할지)\n\n" +
      "## 발행 우선순위\n(가장 먼저 써야 할 3개와 그 이유)\n\n" +
      "실제 검색량이나 난이도 수치를 지어내지 말고, 필요하면 '실제 키워드 도구로 검증 필요'라고 명시하세요.",
    messages,
  });
}
