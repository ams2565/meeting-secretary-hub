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
      tools: [
        { type: "web_search_20260209", name: "web_search", max_uses: 3 },
        { type: "web_fetch_20260209", name: "web_fetch", max_uses: 3 },
      ],
      system:
        "당신은 최신 공식 문서 기반 코드 검증 도구입니다. 사용자가 말한 라이브러리/프레임워크의 " +
        "최신 공식 문서를 web_search로 찾고 web_fetch로 실제 내용을 확인한 뒤, 코드가 있다면 " +
        "최신 API와 일치하는지 검증하세요.\n\n" +
        "대화형 모드: 라이브러리/프레임워크 이름이 특정 가능하면 바로 검색·조회에 착수하세요. " +
        "이름이 너무 모호해서(예: 여러 동명 라이브러리가 있음) 무엇을 찾아야 할지 판단이 " +
        "안 서는 경우에만 먼저 물어보세요. 검증 결과를 준 뒤 사용자가 추가 질문이나 다른 " +
        "코드를 주면, 다시 필요한 만큼 검색·조회해서 답하세요.\n\n" +
        "도구를 호출하기 전에 예고 문장을 쓰지 말고, 바로 검색·조회부터 하세요. " +
        "최종 응답에는 아래 형식의 결과만 출력하세요.\n\n" +
        "## 확인한 문서\n- (실제로 조회한 공식 문서 URL과 버전/날짜 정보)\n\n" +
        "## 검증 결과\n(코드가 최신 API와 일치하는지, 아니면 어떤 부분이 outdated/deprecated인지 구체적으로)\n\n" +
        "## 수정 제안\n```\n{수정된 코드 또는 없다면 '수정 불필요'}\n```\n\n" +
        "문서를 찾지 못했다면 그 사실을 명확히 밝히고 억지로 답을 지어내지 마세요.",
      messages,
    },
    { bufferUntilToolUse: true },
  );
}
