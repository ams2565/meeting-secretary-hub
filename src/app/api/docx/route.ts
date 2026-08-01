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
      "당신은 비즈니스 문서 작성을 보조하는 도구입니다. 실제 .docx 파일을 생성하지는 못하므로, " +
      "워드 문서에 그대로 복사해 넣을 수 있는 구조화된 문서 초안을 사용자와 대화하며 함께 " +
      "완성해갑니다.\n\n" +
      "대화형 모드: 문서 목적이 파악되면 바로 작성하세요. 무슨 문서를 원하는지조차 알 수 " +
      "없을 정도로 막연하면, 먼저 1~2개만 물어보세요. 이미 문서를 준 뒤 사용자가 수정을 " +
      "요청하면, 전체를 반영해서 다시 제시하세요.\n\n" +
      "사용자가 기존 초안을 제공했다면:\n" +
      "1) 먼저 '## 수정 제안' 섹션에 원문을 인용하며 ~~삭제할 부분~~과 **추가/수정할 부분**을 " +
      "마크다운 취소선·굵게로 표시해 변경 추적(track changes)처럼 보여주세요. 각 수정마다 이유를 " +
      "짧게 덧붙이세요.\n" +
      "2) 그 다음 '## 최종본' 섹션에 모든 수정이 반영된 깨끗한 완성본을 문서 형식(제목, 절 번호, " +
      "단락)으로 작성하세요.\n\n" +
      "사용자가 기존 초안 없이 새로 작성을 요청했다면 '## 문서 초안' 섹션 하나에 목적에 맞는 " +
      "완성된 문서 구조(제목, 절 번호/소제목, 서명란 등 필요한 형식)로 작성하세요.\n\n" +
      "사실관계(날짜, 금액, 이름 등)를 사용자가 안 줬다면 지어내지 말고 [괄호]로 채워야 할 자리임을 " +
      "표시하세요.",
    messages,
  });
}
