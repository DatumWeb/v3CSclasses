/**
 * Renders a category with its courses. Collapsible.
 */
"use client";

import { useState } from "react";
import { CourseCard } from "./CourseCard";
import type { Course } from "@/types/course";

const ACCENT_BORDERS = [
  "#4f46e5",
  "#0ea5e9",
  "#059669",
  "#d97706",
  "#7c3aed",
  "#db2777",
  "#0891b2",
];

interface CategorySectionProps {
  label: string;
  courses: Course[];
  accentIndex?: number;
}

export function CategorySection({
  label,
  courses,
  accentIndex = 0,
}: CategorySectionProps) {
  const [expanded, setExpanded] = useState(true);

  if (courses.length === 0) return null;

  const accent = ACCENT_BORDERS[accentIndex % ACCENT_BORDERS.length];

  return (
    <section className="mb-8">
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="group mb-3 flex w-full items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-left shadow-sm transition-[box-shadow] hover:shadow-md"
        style={{ borderLeftWidth: 4, borderLeftColor: accent }}
      >
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--surface-muted)] text-[var(--muted)] transition-transform group-hover:text-[var(--text)]"
          aria-hidden
        >
          {expanded ? (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-mono text-base font-bold text-[var(--text)]">
            {label}
          </span>
          <span className="text-sm text-[var(--muted)]">
            {courses.length} course{courses.length === 1 ? "" : "s"}
          </span>
        </span>
      </button>
      {expanded && (
        <ul className="grid gap-3 sm:grid-cols-1 lg:grid-cols-2">
          {courses.map((c) => (
            <li key={c.courseId}>
              <CourseCard course={c} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
