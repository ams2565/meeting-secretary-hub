export const REPO_OWNER = "ams2565";
export const REPO_NAME = "app-builder-outputs";
export const SITE_URL = "https://app-builder-outputs.vercel.app";

export function slugify(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
