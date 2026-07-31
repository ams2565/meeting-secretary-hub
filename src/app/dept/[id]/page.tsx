import Link from "next/link";
import { notFound } from "next/navigation";
import { departments } from "@/lib/departments";

export function generateStaticParams() {
  return departments.map((dept) => ({ id: dept.id }));
}

export default async function DepartmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const dept = departments.find((d) => d.id === id);
  if (!dept) notFound();

  return (
    <div className="flex flex-1 flex-col bg-neutral-950">
      <header className="border-b border-neutral-800 px-6 py-10 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <Link href="/" className="text-sm text-neutral-400 hover:text-neutral-200">
            ← 전체 부서
          </Link>
          <div className="mt-3 flex items-center gap-3">
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg ${dept.accent.bg} ring-1 ${dept.accent.ring}`}
              aria-hidden="true"
            >
              {dept.icon}
            </span>
            <span className={`text-xs font-semibold uppercase tracking-wide ${dept.accent.text}`}>
              {dept.subtitle}
            </span>
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{dept.name}</h1>
          <p className="mt-2 max-w-2xl text-neutral-400">{dept.tagline}</p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10 sm:px-10">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {dept.skills.map((skill) => {
            const isLive = skill.status === "live";
            const content = (
              <div
                className={`h-full rounded-2xl border p-5 transition ${
                  isLive
                    ? "border-neutral-700 bg-neutral-900 hover:-translate-y-0.5 hover:border-neutral-500 hover:shadow-lg hover:shadow-black/20"
                    : "border-neutral-800 bg-neutral-900/40"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-bold">{skill.name}</h2>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                      isLive
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-neutral-800 text-neutral-500"
                    }`}
                  >
                    {isLive ? "실행 가능" : "준비중"}
                  </span>
                </div>
                <p className="mt-2 text-sm text-neutral-400">{skill.description}</p>
              </div>
            );

            return isLive ? (
              <Link key={skill.slug} href={skill.href ?? "#"}>
                {content}
              </Link>
            ) : (
              <div key={skill.slug}>{content}</div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
