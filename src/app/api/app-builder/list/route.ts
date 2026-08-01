import { NextResponse } from "next/server";
import { REPO_OWNER, REPO_NAME, SITE_URL } from "@/lib/appBuilderRepo";

export async function GET() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "GITHUB_TOKEN이 설정되어 있지 않습니다." }, { status: 500 });
  }

  const res = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/`, {
    headers: { Authorization: `token ${token}`, Accept: "application/vnd.github+json" },
  });

  if (!res.ok) {
    return NextResponse.json({ error: "목록을 불러오지 못했습니다." }, { status: 502 });
  }

  const data = await res.json();
  const apps = (Array.isArray(data) ? data : [])
    .filter((item: { type: string }) => item.type === "dir")
    .map((item: { name: string }) => ({ slug: item.name, url: `${SITE_URL}/${item.name}/` }));

  return NextResponse.json({ apps });
}
