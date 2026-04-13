/**
 * Dropdown to select a course. Used for prereq tree view.
 */
"use client";

import type { Course } from "@/types/course";

interface CourseSelectorProps {
  courses: Course[];
  value: Course | null;
  onChange: (course: Course | null) => void;
  placeholder?: string;
}

export function CourseSelector({
  courses,
  value,
  onChange,
  placeholder = "Select a course…",
}: CourseSelectorProps) {
  const sorted = [...courses].sort((a, b) => a.code.localeCompare(b.code));

  return (
    <div className="relative">
      <label className="sr-only" htmlFor="course-focus">
        Focus prerequisite tree on a course
      </label>
      <select
        id="course-focus"
        value={value?.code ?? ""}
        onChange={(e) => {
          const code = e.target.value;
          const c = courses.find((x) => x.code === code) ?? null;
          onChange(c);
        }}
        className="w-full max-w-xl appearance-none rounded-2xl border border-[var(--border)] bg-[var(--surface)] py-3.5 pl-4 pr-10 font-mono text-sm text-[var(--text)] shadow-sm focus:border-[var(--accent)] focus:outline-none focus:ring-4 focus:ring-[var(--ring)]"
      >
        <option value="">{placeholder}</option>
        {sorted.map((c) => (
          <option key={c.courseId} value={c.code}>
            {c.code} — {c.title}
          </option>
        ))}
      </select>
      <span
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted)]"
        aria-hidden
      >
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </span>
    </div>
  );
}
