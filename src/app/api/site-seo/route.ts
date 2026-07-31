import { NextRequest, NextResponse } from "next/server";
import { streamText } from "@/lib/streamText";

function normalizeUrl(raw: string): string | null {
  try {
    const url = raw.trim().match(/^https?:\/\//) ? raw.trim() : `https://${raw.trim()}`;
    const parsed = new URL(url);
    return parsed.toString();
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const { url } = await req.json();

  if (!url || typeof url !== "string" || !url.trim()) {
    return NextResponse.json({ error: "분석할 URL을 입력해주세요." }, { status: 400 });
  }

  const normalized = normalizeUrl(url);
  if (!normalized) {
    return NextResponse.json({ error: "올바른 URL 형식이 아닙니다." }, { status: 400 });
  }

  return streamText(
    {
      model: "claude-opus-5",
      max_tokens: 4096,
      tools: [{ type: "web_fetch_20260209", name: "web_fetch", max_uses: 3 }],
      system:
        "당신은 SEO 전문가입니다. 사용자가 준 URL 페이지를 web_fetch 도구로 직접 불러온 뒤, " +
        "실제로 확인한 내용을 바탕으로 한국어 SEO 진단 보고서를 작성하세요. " +
        "도구를 호출하기 전에 '불러오겠습니다' 같은 예고 문장을 쓰지 마세요 — 바로 도구를 호출하고, " +
        "최종 응답에는 아래 형식의 보고서만 출력하세요. " +
        "출력은 반드시 다음 마크다운 형식을 따르세요:\n\n" +
        "## 종합 평가\n(2~3문장, 전반적인 SEO 상태 요약)\n\n" +
        "## 발견된 항목\n- **제목 태그**: 내용과 평가\n- **메타 설명**: 내용과 평가\n- **제목 구조(H1/H2)**: 내용과 평가\n- **콘텐츠 품질**: 내용과 평가\n\n" +
        "## 개선 제안\n- 우선순위 순으로 구체적인 개선 액션\n\n" +
        "페이지를 불러오지 못했다면 그 사실을 명확히 밝히고 억지로 지어내지 마세요.",
      messages: [
        {
          role: "user",
          content: `다음 페이지를 분석해줘: ${normalized}`,
        },
      ],
    },
    { bufferUntilToolUse: true },
  );
}
