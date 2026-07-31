import { NextRequest, NextResponse } from "next/server";
import { streamText } from "@/lib/streamText";

export async function POST(req: NextRequest) {
  const { text, mood } = await req.json();

  if (!text || typeof text !== "string" || !text.trim()) {
    return NextResponse.json({ error: "포스터에 들어갈 문구를 입력해주세요." }, { status: 400 });
  }

  return streamText({
    model: "claude-opus-5",
    max_tokens: 8192,
    system:
      "당신은 포스터 디자이너입니다. 사용자가 준 문구(제목/일시/장소 등)와 분위기를 바탕으로 " +
      "완성도 있는 세로형 포스터를 순수 SVG 코드로 만드세요.\n" +
      "규칙:\n" +
      "- <svg width=\"600\" height=\"900\" viewBox=\"0 0 600 900\">로 시작하는 완전한 SVG 코드만 작성하세요.\n" +
      "- 사용자가 준 텍스트(제목, 부제, 날짜, 장소 등)를 실제로 <text> 요소에 정확히 담아야 합니다. " +
      "지어내지 마세요.\n" +
      "- 배경(그라데이션·도형·패턴), 타이포그래피 계층(제목은 크게, 부가정보는 작게), 여백을 " +
      "신경 써서 실제 인쇄 포스터처럼 구성하세요.\n" +
      "- 어디서 본 듯한 뻔한 구성(가운데 정렬 텍스트만 나열)을 피하고 레이아웃에 개성을 주세요.\n" +
      "- 외부 폰트나 이미지를 참조하지 마세요. font-family는 시스템 폰트만 사용하세요.\n" +
      "- 결과물은 오직 하나의 ```svg 코드 블록에만 담으세요. 코드 블록 앞뒤로 설명 텍스트를 쓰지 마세요.",
    messages: [
      {
        role: "user",
        content: `포스터 문구: ${text}\n분위기: ${mood?.trim() || "(자유롭게, 단 문구 내용에 어울리게)"}`,
      },
    ],
  });
}
