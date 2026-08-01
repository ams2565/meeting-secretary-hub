import { NextRequest, NextResponse } from "next/server";

const REPO_OWNER = "ams2565";
const REPO_NAME = "app-builder-outputs";
const SITE_URL = "https://app-builder-outputs.vercel.app";

function slugify(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function POST(req: NextRequest) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "GITHUB_TOKEN이 설정되어 있지 않습니다." }, { status: 500 });
  }

  const { name, html } = await req.json();
  if (typeof name !== "string" || !name.trim() || typeof html !== "string" || !html.trim()) {
    return NextResponse.json({ error: "앱 이름과 코드가 모두 필요합니다." }, { status: 400 });
  }

  const slug = slugify(name);
  if (!slug) {
    return NextResponse.json({ error: "이름에서 유효한 slug를 만들 수 없습니다. 영문/숫자를 포함해주세요." }, { status: 400 });
  }

  const path = `${slug}/index.html`;
  const apiUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`;

  const existing = await fetch(apiUrl, {
    headers: { Authorization: `token ${token}`, Accept: "application/vnd.github+json" },
  });
  const existingData = existing.ok ? await existing.json() : null;

  const put = await fetch(apiUrl, {
    method: "PUT",
    headers: { Authorization: `token ${token}`, Accept: "application/vnd.github+json" },
    body: JSON.stringify({
      message: existingData ? `Update ${slug}` : `Add ${slug}`,
      content: Buffer.from(html, "utf-8").toString("base64"),
      ...(existingData ? { sha: existingData.sha } : {}),
    }),
  });

  if (!put.ok) {
    const err = await put.json().catch(() => ({}));
    return NextResponse.json({ error: err.message ?? "GitHub 업로드에 실패했습니다." }, { status: 502 });
  }

  return NextResponse.json({ url: `${SITE_URL}/${slug}/` });
}
