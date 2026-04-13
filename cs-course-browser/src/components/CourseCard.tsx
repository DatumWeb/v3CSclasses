/**
 * Compact course card for list views.
 */
"use client";

import Link from "next/link";
import { useCompletedCourses } from "@/context/CompletedCoursesContext";
import type { Course } from "@/types/course";

interface CourseCardProps {
  course: Course;
}

function levelLabel(number: string): string {
  const n = parseInt(number.replace(/\D/g, ""), 10);
  if (Number.isNaN(n)) return "—";
  const band = Math.floor(n / 100) * 100;
  if (band >= 500) return "Grad";
  return `${band}-level`;
}

export function CourseCard({ course }: CourseCardProps) {
  const { isCompleted, toggleCompleted } = useCompletedCourses();
  const completed = isCompleted(course.courseId);
  const when = course.whenTaught?.filter(Boolean) ?? [];

  return (
    <div
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border transition-[box-shadow,border-color] ${
        completed
          ? "border-[var(--success-border)] bg-[var(--success-surface)] shadow-sm"
          : "border-[var(--border)] bg-[var(--surface)] shadow-sm hover:border-[var(--muted)] hover:shadow-md"
      }`}
    >
      <div className="flex flex-1 gap-3 p-4">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            toggleCompleted(course.courseId);
          }}
          className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-sm font-bold transition-colors ${
            completed
              ? "border-[var(--success)] bg-white text-[var(--success)]"
              : "border-[var(--border)] bg-[var(--surface-muted)] text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
          }`}
          title={completed ? "Mark as not completed" : "Mark as completed"}
        >
          {completed ? "✓" : "○"}
        </button>
        <Link
          href={`/course/${encodeURIComponent(course.code)}`}
          className="min-w-0 flex-1 outline-none"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-base font-bold text-[var(--text)]">
              {course.code}
            </span>
            <span className="rounded-md bg-[var(--chip)] px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-[var(--chip-text)]">
              {levelLabel(course.number)}
            </span>
          </div>
          <div
            className={`mt-1 text-sm font-medium leading-snug ${
              completed ? "text-[var(--muted)] line-through" : "text-[var(--text)]"
            }`}
          >
            {course.title}
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <span className="rounded-md border border-[var(--border)] bg-[var(--surface-muted)] px-2 py-0.5 font-mono text-[11px] text-[var(--muted)]">
              {course.credits ?? "—"} cr
            </span>
            {when.slice(0, 3).map((t) => (
              <span
                key={t}
                className="rounded-md border border-[var(--border)] bg-white px-2 py-0.5 text-[11px] text-[var(--muted)]"
              >
                {t}
              </span>
            ))}
            {when.length > 3 ? (
              <span className="text-[11px] text-[var(--muted)]">
                +{when.length - 3} more
              </span>
            ) : null}
          </div>
          <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent)] group-hover:underline">
            Details
            <span aria-hidden>→</span>
          </span>
        </Link>
      </div>
    </div>
  );
}
