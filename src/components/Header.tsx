import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center px-6 py-3 sm:px-10">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold text-neutral-200 transition hover:text-white"
        >
          <span aria-hidden="true">🤖</span>
          회의비서팀 자동화 허브
        </Link>
      </div>
    </header>
  );
}
