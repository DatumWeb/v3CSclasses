/**
 * Search input for filtering courses by title, code, or description.
 */
"use client";

interface SearchFilterProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchFilter({
  value,
  onChange,
  placeholder = "Search by code, title, or description…",
}: SearchFilterProps) {
  return (
    <label className="relative block">
      <span className="sr-only">Search courses</span>
      <span
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]"
        aria-hidden
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] py-3.5 pl-12 pr-4 font-mono text-sm text-[var(--text)] shadow-sm transition-[box-shadow,border-color] placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-4 focus:ring-[var(--ring)]"
      />
    </label>
  );
}
