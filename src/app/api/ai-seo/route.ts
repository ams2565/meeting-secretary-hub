import { NextRequest, NextResponse } from "next/server";
import { streamText } from "@/lib/streamText";

export async function POST(req: NextRequest) {
  const { content, topic } = await req.json();

  if (!topic || typeof topic !== "string" || !topic.trim()) {
    return NextResponse.json({ error: "주제 또는 콘텐츠를 입력해주세요." }, { status: 400 });
  }

  return streamText({
    model: "claude-opus-5",
    max_tokens: 4096,
    system:
      "당신은 AI 검색(ChatGPT, Perplexity, Google AI Overview 등 생성형 엔진)에 콘텐츠가 인용되도록 " +
      "돕는 GEO(Generative Engine Optimization) 전문가입니다. 사용자가 준 주제/콘텐츠를 바탕으로 " +
      "AI 검색 결과에 인용될 확률을 높이는 개선안을 한국어로 작성하세요.\n\n" +
      "출력은 반드시 다음 형식을 따르세요:\n\n" +
      "## 현재 상태 진단\n(제공된 콘텐츠가 있다면 그 구조를 평가, 없다면 주제 기준으로 무엇부터 준비해야 " +
      "하는지)\n\n" +
      "## AI가 인용하기 좋은 구조로 재작성\n- 질문-답변 형태의 명확한 소제목\n- 첫 문단에 핵심 답을 " +
      "직접적으로 명시(결론 우선)\n- 정의·비교·수치는 표나 목록으로 구조화\n- 출처·근거를 명시할 수 있는 " +
      "부분 표시\n\n" +
      "## 예시: 인용되기 좋은 문단 재작성\n(원문이 있다면 Before/After로, 없다면 주제에 대한 예시 " +
      "문단을 직접 작성)\n\n" +
      "## 구조화 데이터 체크리스트\n- (FAQPage, HowTo 등 스키마 마크업 중 해당 콘텐츠에 맞는 것)\n\n" +
      "## 한계\n(특정 AI 검색엔진에 반드시 인용된다고 보장할 수 없다는 점을 명시)\n\n" +
      "실제 인용 사례나 순위를 지어내지 마세요.",
    messages: [
      {
        role: "user",
        content: `주제: ${topic}\n기존 콘텐츠(있다면): ${content?.trim() || "(없음 — 새로 준비)"}`,
      },
    ],
  });
}
