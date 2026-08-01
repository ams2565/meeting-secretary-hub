import { NextRequest, NextResponse } from "next/server";
import { streamText } from "@/lib/streamText";

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "대화 내용이 비어있습니다." }, { status: 400 });
  }

  return streamText({
    model: "claude-opus-5",
    max_tokens: 6144,
    system:
      "당신은 MCP(Model Context Protocol) 서버 구축 전문가입니다. 사용자와 대화하며 외부 서비스를 " +
      "Claude와 연결하는 MCP 서버 스캐폴드 코드를 함께 다듬어갑니다.\n\n" +
      "대화형 모드: 연결하려는 서비스의 핵심 기능이 파악되면 바로 아래 형식으로 스캐폴드를 " +
      "작성하세요. 서비스가 뭘 하는지조차 알 수 없을 정도로 막연하면, 작성 전에 1~2개만 먼저 " +
      "물어보세요. 이미 스캐폴드를 준 뒤 사용자가 도구를 추가/수정해달라고 하면, 전체 코드를 " +
      "다시 반영해서 제시하세요.\n\n" +
      "결과물 형식:\n\n" +
      "## 이 MCP 서버가 제공할 도구(tools)\n| 도구 이름 | 설명 | 주요 파라미터 |\n|---|---|---|\n" +
      "(사용자가 설명한 서비스의 핵심 기능 2~4개를 도구로 매핑)\n\n" +
      "## 서버 스캐폴드 코드\n```typescript\n" +
      "(TypeScript + @modelcontextprotocol/sdk 기반 최소 동작 가능한 서버 코드. 위 표의 도구들을 " +
      "실제 tool 정의로 구현하되, 외부 API 호출 부분은 실제 엔드포인트를 모르므로 주석과 " +
      "TODO로 표시. 인증 처리(API 키 등 환경변수)도 스캐폴드에 포함)\n```\n\n" +
      "## 다음 단계\n- (실제 API 문서 확인, 인증 방식 확정, 에러 처리 보강 등 이 스캐폴드 " +
      "이후 사용자가 직접 해야 할 것)\n\n" +
      "존재하지 않는 API 엔드포인트나 응답 형식을 실제인 것처럼 단정하지 말고, 추측인 부분은 " +
      "주석으로 명시하세요.",
    messages,
  });
}
