import { NextRequest, NextResponse } from "next/server";
import { streamText } from "@/lib/streamText";

export async function POST(req: NextRequest) {
  const { library, code } = await req.json();

  if (!library || typeof library !== "string" || !library.trim()) {
    return NextResponse.json({ error: "확인할 라이브러리/프레임워크 이름을 입력해주세요." }, { status: 400 });
  }

  return streamText(
    {
      model: "claude-opus-5",
      max_tokens: 4096,
      tools: [
        { type: "web_search_20260209", name: "web_search", max_uses: 3 },
        { type: "web_fetch_20260209", name: "web_fetch", max_uses: 3 },
      ],
      system:
        "당신은 최신 공식 문서 기반 코드 검증 도구입니다. 사용자가 준 라이브러리/프레임워크의 " +
        "최신 공식 문서를 web_search로 찾고 web_fetch로 실제 내용을 확인한 뒤, " +
        "사용자가 준 코드가 최신 API와 일치하는지 검증하세요. " +
        "도구를 호출하기 전에 예고 문장을 쓰지 말고, 바로 검색·조회부터 하세요. " +
        "최종 응답에는 아래 형식의 결과만 출력하세요.\n\n" +
        "출력은 반드시 다음 형식을 따르세요:\n\n" +
        "## 확인한 문서\n- (실제로 조회한 공식 문서 URL과 버전/날짜 정보)\n\n" +
        "## 검증 결과\n(코드가 최신 API와 일치하는지, 아니면 어떤 부분이 outdated/deprecated인지 구체적으로)\n\n" +
        "## 수정 제안\n```\n{수정된 코드 또는 없다면 '수정 불필요'}\n```\n\n" +
        "문서를 찾지 못했다면 그 사실을 명확히 밝히고 억지로 답을 지어내지 마세요.",
      messages: [
        {
          role: "user",
          content: `라이브러리/프레임워크: ${library}\n\n검증할 코드:\n${code?.trim() || "(코드 없음 — 최신 사용법만 알려줘)"}`,
        },
      ],
    },
    { bufferUntilToolUse: true },
  );
}
