/**
 * Shared footer with data disclaimer and catalog link.
 */
export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--surface)]/50 py-8">
      <div className="mx-auto max-w-5xl px-4 text-center text-xs leading-relaxed text-[var(--muted)] sm:px-6 lg:px-8">
        <p>
          Course data is scraped for planning purposes and may not match the
          official catalog. Always verify prerequisites and offerings with{" "}
          <a
            href="https://catalog.byu.edu/"
            className="font-medium text-[var(--accent)] underline decoration-[var(--accent)]/40 underline-offset-2 hover:decoration-[var(--accent)]"
            target="_blank"
            rel="noopener noreferrer"
          >
            BYU Catalog
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
