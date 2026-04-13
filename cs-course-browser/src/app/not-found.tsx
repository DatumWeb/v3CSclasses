import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="mx-auto flex max-w-lg flex-1 flex-col justify-center px-4 py-16 text-center">
        <p className="font-mono text-sm font-semibold text-[var(--accent)]">404</p>
        <h1 className="mt-2 text-2xl font-bold text-[var(--text)]">
          Page not found
        </h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          That course or URL is not in this build. Return to the list and pick a
          course from the catalog.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex justify-center rounded-xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white hover:bg-[var(--accent-hover)]"
        >
          Go to course list
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}
