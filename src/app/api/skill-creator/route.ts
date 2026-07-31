import { NextRequest, NextResponse } from "next/server";
import { streamText } from "@/lib/streamText";

export async function POST(req: NextRequest) {
  const { task } = await req.json();

  if (!task || typeof task !== "string" || !task.trim()) {
    return NextResponse.json({ error: "반복하는 작업을 설명해주세요." }, { status: 400 });
  }

  return streamText({
    model: "claude-opus-5",
    max_tokens: 4096,
    system:
      "당신은 Claude Code 스킬 제작 전문가입니다. 사용자가 설명한 반복 작업을 바탕으로 " +
      "재사용 가능한 Claude Code 스킬 파일(SKILL.md)의 전체 내용을 작성하세요.\n\n" +
      "출력은 반드시 아래 형식을 그대로 따르세요 (코드 블록으로 감싸서 출력):\n\n" +
      "```markdown\n" +
      "---\n" +
      "name: {kebab-case-스킬-이름}\n" +
      "description: {한 줄 설명 — 언제 이 스킬을 써야 하는지 트리거 조건 포함}\n" +
      "---\n\n" +
      "# {스킬 제목}\n\n" +
      "{작업 수행 절차를 단계별로, 구체적인 지침으로 작성}\n" +
      "```\n\n" +
      "코드 블록 앞뒤로 다음 안내를 한국어로 덧붙이세요:\n" +
      "- 이 파일을 어느 경로에 저장해야 하는지 (`.claude/skills/{name}/SKILL.md`)\n" +
      "- 이 스킬이 언제 자동으로 호출되는지 간단히",
    messages: [
      {
        role: "user",
        content: `이 작업을 스킬로 만들어줘: ${task}`,
      },
    ],
  });
}
