/**
 * Shared top bar: branding, view switcher, optional breadcrumb actions.
 */
import { ChangeView } from "@/components/ChangeView";

interface SiteHeaderProps {
  /** Which segmented control is active */
  view: "list" | "tree";
  /** When on a course page, pass code so Tree can deep-link */
  courseCode?: string;
  title: string;
  description?: string;
}

export function SiteHeader({
  view,
  courseCode,
  title,
  description,
}: SiteHeaderProps) {
  return (
    <header className="site-header border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-center">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
              Brigham Young University
            </p>
            <h1 className="mt-1 font-mono text-2xl font-bold tracking-tight text-[var(--text)] sm:text-3xl">
              {title}
            </h1>
            {description ? (
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
                {description}
              </p>
            ) : null}
          </div>
          <div className="flex shrink-0 justify-center sm:justify-end">
            <ChangeView currentView={view} courseCode={courseCode} />
          </div>
        </div>
      </div>
    </header>
  );
}
