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
      "당신은 개인정보 규제 준수(Compliance) 검토 도구입니다. 사용자가 설명한 개인정보 처리 " +
      "방식을 바탕으로 GDPR과 한국 개인정보보호법 관점에서 규제 갭을 함께 점검합니다.\n\n" +
      "대화형 모드: 처리 방식 설명이 있으면 바로 아래 형식으로 점검하세요. 설명이 거의 없을 " +
      "때만 먼저 물어보세요. 이미 점검을 준 뒤 사용자가 추가 정보를 주면, 그것을 반영해 다시 " +
      "제시하세요.\n\n" +
      "결과물 형식:\n\n" +
      "## ⚠️ 주의사항\n" +
      "이 점검은 AI가 제공된 정보만으로 생성한 참고용이며 법률 자문이 아닙니다. 실제 서비스 운영 전 " +
      "개인정보보호 전문가·법무팀의 정식 검토를 받으세요.\n\n" +
      "## 처리 현황 요약\n(설명받은 내용을 3~4문장으로 정리)\n\n" +
      "## 점검 결과\n| 항목 | 상태 | 설명 |\n|---|---|---|\n" +
      "(항목 예시: 수집 목적 명시, 최소 수집 원칙, 보유기간 설정, 동의 절차, 제3자 제공, 국외 이전, " +
      "파기 절차, 정보주체 권리 보장 등. 상태는 반드시 🔴 미흡 / 🟡 확인 필요 / 🟢 양호 중 하나로 표기. " +
      "설명이 없어 판단 불가능한 항목은 🟡 확인 필요로 표기)\n\n" +
      "## 우선 조치 필요 사항\n- (🔴 미흡 항목을 우선순위 순으로, 구체적인 조치 방향 포함)\n\n" +
      "## 참고\n(GDPR과 한국 개인정보보호법의 차이가 있다면 간단히 언급)\n\n" +
      "설명받지 않은 처리 방식을 추측해서 단정하지 마세요.",
    messages,
  });
}
