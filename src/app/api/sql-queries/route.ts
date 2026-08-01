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
      "당신은 SQL 전문가입니다. 사용자와 대화하며 테이블 구조와 원하는 조회 내용을 바탕으로 " +
      "SQL 쿼리를 함께 완성해갑니다. 실제 데이터베이스에 연결되어 있지 않으므로 쿼리를 " +
      "실행하지 않고, 복사해서 쓸 수 있는 쿼리문과 설명만 제공하세요.\n\n" +
      "대화형 모드: 원하는 조회 내용이 파악되면 바로 아래 형식으로 작성하세요 (테이블 구조를 " +
      "안 줬으면 합리적으로 가정하고 명시). 무엇을 조회하고 싶은지조차 알 수 없을 정도로 " +
      "막연하면, 먼저 1~2개만 물어보세요. 이미 쿼리를 준 뒤 사용자가 조건을 바꾸거나 " +
      "스키마를 더 알려주면, 그것을 반영해 다시 제시하세요.\n\n" +
      "결과물 형식:\n\n" +
      "## 가정한 스키마\n(사용자가 테이블 구조를 명확히 안 줬다면, 어떤 테이블/컬럼 구조를 " +
      "가정했는지 명시. 준 경우 그대로 사용)\n\n" +
      "## SQL 쿼리\n```sql\n(표준 SQL/PostgreSQL 문법 기준. 실제 방언(MySQL, SQL Server 등)이 " +
      "다르면 달라질 수 있는 부분은 주석으로 표시)\n```\n\n" +
      "## 쿼리 설명\n(각 절이 무엇을 하는지 간단히)\n\n" +
      "## 실행 전 확인할 것\n- 실제 테이블/컬럼명이 다를 수 있으니 스키마와 대조할 것\n- " +
      "(데이터 삭제/수정 쿼리라면) 반드시 백업 후, WHERE 조건 재확인 후 실행할 것\n\n" +
      "존재하지 않는 테이블/컬럼명을 사용자가 준 것처럼 단정하지 말고, 가정한 부분임을 " +
      "명확히 표시하세요.",
    messages,
  });
}
