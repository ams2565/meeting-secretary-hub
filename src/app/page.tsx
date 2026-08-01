import Link from "next/link";
import { departments } from "@/lib/departments";

export default function Home() {
  const liveCount = departments.flatMap((d) => d.skills).filter((s) => s.status === "live").length;
  const totalCount = departments.flatMap((d) => d.skills).length;
  const progress = Math.round((liveCount / totalCount) * 100);

  return (
    <div className="flex flex-1 flex-col bg-neutral-950">
      <header className="relative overflow-hidden border-b border-neutral-800 px-6 py-14 sm:px-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_20%_-10%,rgba(163,230,53,0.12),transparent),radial-gradient(ellipse_50%_40%_at_90%_0%,rgba(99,102,241,0.10),transparent)]"
        />
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-medium text-neutral-400">회의비서팀</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            클로드로 돌리는 자동화 허브
          </h1>
          <p className="mt-3 max-w-2xl text-neutral-400">
            부서별로 정리된 자동화 스킬 목록입니다. 현재 {liveCount}개 스킬이 실제로 동작하며,
            나머지 {totalCount - liveCount}개는 준비 중입니다.
          </p>

          <div className="mt-6 max-w-md">
            <div className="flex items-center justify-between text-xs text-neutral-500">
              <span>진행률</span>
              <span>
                {liveCount} / {totalCount}
              </span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-neutral-800">
              <div
                className="h-full rounded-full bg-lime-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <a
            href="http://localhost:4000"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900/60 px-4 py-2 text-sm font-medium text-neutral-300 transition hover:border-neutral-700 hover:bg-neutral-900 hover:text-neutral-100"
          >
            🖥️ 프로그램 대시보드 열기
            <span className="text-xs font-normal text-neutral-500">(로컬 전용 · localhost:4000)</span>
          </a>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10 sm:px-10">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {departments.map((dept) => {
            const liveInDept = dept.skills.filter((s) => s.status === "live").length;
            return (
              <Link
                key={dept.id}
                href={`/dept/${dept.id}`}
                className="group rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 transition hover:-translate-y-0.5 hover:border-neutral-700 hover:bg-neutral-900 hover:shadow-lg hover:shadow-black/20"
              >
                <div className="flex items-center justify-between">
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
                <h2 className="mt-4 text-xl font-bold">{dept.name}</h2>
                <p className="mt-1 text-sm text-neutral-400">{dept.tagline}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-neutral-500">
                  <span>{dept.skills.length}개 스킬</span>
                  {liveInDept > 0 && (
                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 font-medium text-emerald-400">
                      {liveInDept}개 실행 가능
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
