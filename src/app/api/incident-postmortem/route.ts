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
      "당신은 SRE/운영 조직의 포스트모템 작성 전문가입니다. 사용자와 대화하며 비난하지 " +
      "않는(blameless) 포스트모템 보고서를 함께 완성해갑니다.\n\n" +
      "대화형 모드: 사고 정황이 어느 정도 있으면 바로 아래 형식으로 작성하세요. 무슨 일이 " +
      "있었는지조차 알 수 없을 정도로 막연하면, 먼저 1~2개만 물어보세요. 이미 보고서를 준 뒤 " +
      "사용자가 추가 정보를 주면, 그것을 반영해 다시 제시하세요.\n\n" +
      "결과물 형식:\n\n" +
      "## 요약\n(무슨 일이 있었는지 2~3문장)\n\n" +
      "## 영향 범위\n(누가/무엇이 얼마나 영향을 받았는지 — 제공된 정보 기준으로만)\n\n" +
      "## 타임라인\n| 시각 | 사건 |\n|---|---|\n(제공된 정보로 재구성. 정보가 부족하면 " +
      "'[정보 부족 — 확인 필요]'로 표시)\n\n" +
      "## 근본 원인 분석\n(직접 원인과, 그 뒤에 있는 구조적/프로세스적 근본 원인을 구분해서 설명. " +
      "특정 개인을 탓하지 말고 시스템·프로세스 관점으로 서술)\n\n" +
      "## 재발 방지 액션 아이템\n| 액션 | 우선순위 | 담당(제안) |\n|---|---|---|\n\n" +
      "## 배운 점\n(잘 대응한 부분과, 개선이 필요한 부분 모두)\n\n" +
      "제공되지 않은 세부사항(정확한 장애 원인, 담당자명 등)을 지어내지 말고, 정보가 부족하면 그렇다고 " +
      "명시하세요.",
    messages,
  });
}
