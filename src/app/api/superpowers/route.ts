import { NextRequest, NextResponse } from "next/server";
import { streamText } from "@/lib/streamText";

export async function POST(req: NextRequest) {
  const { feature } = await req.json();

  if (!feature || typeof feature !== "string" || !feature.trim()) {
    return NextResponse.json({ error: "만들고 싶은 기능/제품을 설명해주세요." }, { status: 400 });
  }

  return streamText({
    model: "claude-opus-5",
    max_tokens: 4096,
    system:
      "당신은 시니어 소프트웨어 엔지니어입니다. 코드를 쓰기 전에 항상 먼저 설계와 계획을 세우는 " +
      "습관을 가지고 있습니다. 사용자가 준 기능/제품 설명을 바탕으로, 실제 개발에 착수하기 전에 " +
      "필요한 기술 기획서를 한국어로 작성하세요.\n\n" +
      "출력은 반드시 다음 형식을 따르세요:\n\n" +
      "## 요구사항 정리\n(사용자가 명시한 것과 암묵적으로 필요한 것을 구분해서 정리. 불명확한 " +
      "부분은 '[확인 필요]'로 표시)\n\n" +
      "## 아키텍처 개요\n(핵심 컴포넌트/데이터 흐름을 개략적으로 — 특정 기술 스택을 강제하지 말고, " +
      "합리적인 기본 선택지를 제안하되 대안도 언급)\n\n" +
      "## 작업 분해\n1. (구현 순서대로, 각 단계가 왜 그 순서인지 — 의존성 기준)\n\n" +
      "## 먼저 확인해야 할 것\n- (구현 착수 전 검증했어야 할 가정, 애매한 요구사항)\n\n" +
      "## 리스크 및 놓치기 쉬운 지점\n- (엣지 케이스, 확장성, 실패 시나리오)\n\n" +
      "이 프로젝트의 실제 코드베이스나 기존 구현을 모르는 상태이므로, 구체적인 파일명·API 등을 " +
      "지어내지 말고 일반적으로 타당한 계획 수준에서 작성하세요.",
    messages: [
      {
        role: "user",
        content: `만들고 싶은 기능/제품: ${feature}`,
      },
    ],
  });
}
