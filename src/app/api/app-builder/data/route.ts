import { NextRequest, NextResponse } from "next/server";
import { REPO_OWNER, REPO_NAME, slugify } from "@/lib/appBuilderRepo";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const MAX_BODY_BYTES = 200_000;

function jsonWithCors(body: unknown, init?: ResponseInit) {
  return NextResponse.json(body, { ...init, headers: { ...CORS_HEADERS, ...init?.headers } });
}

function resolveSlug(req: NextRequest): string | null {
  const raw = req.nextUrl.searchParams.get("slug") ?? "";
  const slug = slugify(raw);
  return slug && slug === raw ? slug : null;
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(req: NextRequest) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return jsonWithCors({ error: "GITHUB_TOKEN이 설정되어 있지 않습니다." }, { status: 500 });
  }

  const slug = resolveSlug(req);
  if (!slug) {
    return jsonWithCors({ error: "유효하지 않은 slug입니다." }, { status: 400 });
  }

  const res = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${slug}/data.json`, {
    headers: { Authorization: `token ${token}`, Accept: "application/vnd.github+json" },
  });

  if (res.status === 404) {
    return jsonWithCors({});
  }
  if (!res.ok) {
    return jsonWithCors({ error: "데이터를 불러오지 못했습니다." }, { status: 502 });
  }

  const data = await res.json();
  const decoded = Buffer.from(data.content, "base64").toString("utf-8");
  try {
    return jsonWithCors(JSON.parse(decoded));
  } catch {
    return jsonWithCors({});
  }
}

async function putData(slug: string, token: string, content: string, retried = false): Promise<Response> {
  const apiUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${slug}/data.json`;

  const existing = await fetch(apiUrl, {
    headers: { Authorization: `token ${token}`, Accept: "application/vnd.github+json" },
  });
  const existingData = existing.ok ? await existing.json() : null;

  const put = await fetch(apiUrl, {
    method: "PUT",
    headers: { Authorization: `token ${token}`, Accept: "application/vnd.github+json" },
    body: JSON.stringify({
      message: existingData ? `Update ${slug} data` : `Add ${slug} data`,
      content: Buffer.from(content, "utf-8").toString("base64"),
      ...(existingData ? { sha: existingData.sha } : {}),
    }),
  });

  if (put.status === 409 && !retried) {
    return putData(slug, token, content, true);
  }
  return put;
}

export async function PUT(req: NextRequest) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return jsonWithCors({ error: "GITHUB_TOKEN이 설정되어 있지 않습니다." }, { status: 500 });
  }

  const slug = resolveSlug(req);
  if (!slug) {
    return jsonWithCors({ error: "유효하지 않은 slug입니다." }, { status: 400 });
  }

  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) {
    return jsonWithCors({ error: "저장할 데이터가 너무 큽니다." }, { status: 413 });
  }
  try {
    JSON.parse(raw);
  } catch {
    return jsonWithCors({ error: "JSON 형식이 올바르지 않습니다." }, { status: 400 });
  }

  const put = await putData(slug, token, raw);
  if (!put.ok) {
    const err = await put.json().catch(() => ({}));
    return jsonWithCors({ error: err.message ?? "저장에 실패했습니다." }, { status: 502 });
  }

  return jsonWithCors({ ok: true });
}
