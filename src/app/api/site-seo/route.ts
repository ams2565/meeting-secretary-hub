import { NextRequest, NextResponse } from "next/server";
import { streamText } from "@/lib/streamText";

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "대화 내용이 비어있습니다." }, { status: 400 });
  }

  return streamText(
    {
      model: "claude-opus-5",
      max_tokens: 4096,
      tools: [{ type: "web_fetch_20260209", name: "web_fetch", max_uses: 3 }],
      system:
        "당신은 SEO 전문가입니다. 사용자와 대화하며 웹페이지의 SEO를 진단합니다.\n\n" +
        "대화형 모드: 사용자가 URL을 줬다면(전체 URL이 아니어도 도메인/페이지 이름만으로 충분히 " +
        "특정 가능하면) 바로 web_fetch 도구로 그 페이지를 불러와 진단하세요. URL이 전혀 없거나 " +
        "어떤 페이지를 말하는지 특정할 수 없을 때만 먼저 물어보세요. 진단 후 사용자가 다른 " +
        "페이지를 주거나 특정 항목을 더 물어보면, 필요한 만큼 다시 조회해서 답하세요.\n\n" +
        "도구를 호출하기 전에 '불러오겠습니다' 같은 예고 문장을 쓰지 마세요 — 바로 도구를 " +
        "호출하고, 최종 응답에는 아래 형식의 보고서만 출력하세요.\n\n" +
        "## 종합 평가\n(2~3문장, 전반적인 SEO 상태 요약)\n\n" +
        "## 발견된 항목\n- **제목 태그**: 내용과 평가\n- **메타 설명**: 내용과 평가\n- **제목 구조(H1/H2)**: 내용과 평가\n- **콘텐츠 품질**: 내용과 평가\n\n" +
        "## 개선 제안\n- 우선순위 순으로 구체적인 개선 액션\n\n" +
        "페이지를 불러오지 못했다면 그 사실을 명확히 밝히고 억지로 지어내지 마세요.",
      messages,
    },
    { bufferUntilToolUse: true },
  );
}
