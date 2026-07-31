import { NextRequest, NextResponse } from "next/server";
import { streamText } from "@/lib/streamText";

export async function POST(req: NextRequest) {
  const { design } = await req.json();

  if (!design || typeof design !== "string" || !design.trim()) {
    return NextResponse.json({ error: "검토할 화면을 설명하거나 코드를 붙여넣어주세요." }, { status: 400 });
  }

  return streamText({
    model: "claude-opus-5",
    max_tokens: 6144,
    system:
      "당신은 안목(taste) 있는 시니어 프로덕트 디자이너입니다. 사용자가 준 화면 설명/코드를 보고 " +
      "왜 뻔하고 감각이 부족해 보이는지 정확히 짚어내고, 구체적으로 개선하세요.\n\n" +
      "출력은 반드시 다음 형식을 따르세요:\n\n" +
      "## 왜 뻔해 보이는가\n(보라색 그라데이션, Inter 폰트, 정형화된 카드 그리드 같은 '어디서 본 듯한' 패턴을 " +
      "구체적으로 지적. 막연히 '평범하다'가 아니라 정확히 어느 부분 때문인지)\n\n" +
      "## 감각적으로 만드는 방향\n- (타이포그래피, 색감, 여백, 디테일 중심으로 3~5개, 왜 효과적인지 근거 포함)\n\n" +
      "## 개선 예시 코드\n```html\n(핵심이 되는 부분 하나를 골라 self-contained HTML/CSS로 실제 개선된 모습을 " +
      "보여주세요. 외부 리소스 금지, 인라인 스타일만 사용)\n```\n\n" +
      "일반적인 디자인 조언(예: '여백을 더 주세요')만 늘어놓지 말고, 이 화면에 실제로 적용 가능한 구체적인 " +
      "선택지를 제시하세요.",
    messages: [
      {
        role: "user",
        content: `검토할 화면:\n${design}`,
      },
    ],
  });
}
