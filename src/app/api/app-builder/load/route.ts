import { NextRequest, NextResponse } from "next/server";
import { REPO_OWNER, REPO_NAME, slugify } from "@/lib/appBuilderRepo";

export async function GET(req: NextRequest) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "GITHUB_TOKEN이 설정되어 있지 않습니다." }, { status: 500 });
  }

  const slugParam = req.nextUrl.searchParams.get("slug") ?? "";
  const slug = slugify(slugParam);
  if (!slug || slug !== slugParam) {
    return NextResponse.json({ error: "유효하지 않은 앱 이름입니다." }, { status: 400 });
  }

  const res = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${slug}/index.html`, {
    headers: { Authorization: `token ${token}`, Accept: "application/vnd.github+json" },
  });

  if (!res.ok) {
    return NextResponse.json({ error: "앱을 불러오지 못했습니다." }, { status: 502 });
  }

  const data = await res.json();
  const html = Buffer.from(data.content, "base64").toString("utf-8");
  return NextResponse.json({ html });
}
