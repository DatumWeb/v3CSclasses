/**
 * View switcher: List ↔ Tree.
 */
import Link from "next/link";

interface ChangeViewProps {
  currentView: "list" | "tree";
  courseCode?: string;
}

export function ChangeView({ currentView, courseCode }: ChangeViewProps) {
  const treeHref = courseCode
    ? `/tree/?course=${encodeURIComponent(courseCode)}`
    : "/tree/";

  return (
    <div
      className="inline-flex rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-1 shadow-sm"
      role="group"
      aria-label="Change view"
    >
      {currentView === "list" ? (
        <>
          <span className="rounded-xl bg-[var(--text)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm">
            List
          </span>
          <Link
            href={treeHref}
            className="rounded-xl px-5 py-2.5 text-sm font-medium text-[var(--muted)] transition-colors hover:bg-white hover:text-[var(--text)]"
          >
            Prereq tree
          </Link>
        </>
      ) : (
        <>
          <Link
            href="/"
            className="rounded-xl px-5 py-2.5 text-sm font-medium text-[var(--muted)] transition-colors hover:bg-white hover:text-[var(--text)]"
          >
            List
          </Link>
          <span className="rounded-xl bg-[var(--text)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm">
            Prereq tree
          </span>
        </>
      )}
    </div>
  );
}
