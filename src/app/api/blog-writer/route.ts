import { NextRequest, NextResponse } from "next/server";
import { streamText } from "@/lib/streamText";

export async function POST(req: NextRequest) {
  const { topic, keyword, tone } = await req.json();

  if (!topic || typeof topic !== "string" || !topic.trim()) {
    return NextResponse.json({ error: "블로그 주제를 입력해주세요." }, { status: 400 });
  }

  const toneInstruction =
    tone === "casual" ? "친근하고 편안한 어투로" : "전문적이고 신뢰감 있는 어투로";

  return streamText({
    model: "claude-opus-5",
    max_tokens: 6144,
    system:
      "당신은 SEO 블로그 카피라이터입니다. 사용자가 준 주제(와 타겟 키워드)를 바탕으로 " +
      `SEO에 최적화된 한국어 블로그 글을 ${toneInstruction} 통째로 작성하세요.\n\n` +
      "출력은 반드시 다음 마크다운 형식을 따르세요:\n\n" +
      "# {SEO에 유리한 제목 — 타겟 키워드 포함, 60자 내외}\n\n" +
      "**메타 설명:** {검색결과에 노출될 120~155자 설명}\n\n" +
      "{도입부 — 독자의 문제/궁금증으로 시작, 2~3문장}\n\n" +
      "## {소제목 1}\n{본문}\n\n## {소제목 2}\n{본문}\n\n(필요한 만큼 소제목 반복, 최소 3개)\n\n" +
      "## 마무리\n{핵심 요약 + 다음 행동 유도(CTA)}\n\n" +
      "실제로 존재하지 않는 통계, 연구, 인용을 지어내지 마세요. 구체적 수치가 필요하면 " +
      "'예시' 또는 일반적인 범위로 표현하고 실존 자료인 것처럼 단정하지 마세요.",
    messages: [
      {
        role: "user",
        content: `주제: ${topic}\n타겟 키워드: ${keyword?.trim() || "(주제에서 자연스럽게 추출)"}`,
      },
    ],
  });
}
