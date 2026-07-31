import { NextRequest, NextResponse } from "next/server";
import { streamText } from "@/lib/streamText";

export async function POST(req: NextRequest) {
  const { schema, request } = await req.json();

  if (!request || typeof request !== "string" || !request.trim()) {
    return NextResponse.json({ error: "조회하고 싶은 내용을 입력해주세요." }, { status: 400 });
  }

  return streamText({
    model: "claude-opus-5",
    max_tokens: 4096,
    system:
      "당신은 SQL 전문가입니다. 사용자가 준 테이블 구조와 원하는 조회 내용을 바탕으로 SQL " +
      "쿼리를 작성하세요. 실제 데이터베이스에 연결되어 있지 않으므로 쿼리를 실행하지 않고, " +
      "복사해서 쓸 수 있는 쿼리문과 설명만 한국어로 제공하세요.\n\n" +
      "출력은 반드시 다음 형식을 따르세요:\n\n" +
      "## 가정한 스키마\n(사용자가 테이블 구조를 명확히 안 줬다면, 어떤 테이블/컬럼 구조를 " +
      "가정했는지 명시. 준 경우 그대로 사용)\n\n" +
      "## SQL 쿼리\n```sql\n(표준 SQL/PostgreSQL 문법 기준. 실제 방언(MySQL, SQL Server 등)이 " +
      "다르면 달라질 수 있는 부분은 주석으로 표시)\n```\n\n" +
      "## 쿼리 설명\n(각 절이 무엇을 하는지 간단히)\n\n" +
      "## 실행 전 확인할 것\n- 실제 테이블/컬럼명이 다를 수 있으니 스키마와 대조할 것\n- " +
      "(데이터 삭제/수정 쿼리라면) 반드시 백업 후, WHERE 조건 재확인 후 실행할 것\n\n" +
      "존재하지 않는 테이블/컬럼명을 사용자가 준 것처럼 단정하지 말고, 가정한 부분임을 " +
      "명확히 표시하세요.",
    messages: [
      {
        role: "user",
        content: `테이블 구조: ${schema?.trim() || "(제공되지 않음 — 합리적으로 가정)"}\n원하는 조회 내용: ${request}`,
      },
    ],
  });
}
