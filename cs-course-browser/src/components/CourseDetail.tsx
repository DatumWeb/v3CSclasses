/**
 * Full course detail view.
 */
"use client";

import type { ReactNode } from "react";
import { useCompletedCourses } from "@/context/CompletedCoursesContext";
import type { Course, PrereqRule } from "@/types/course";

interface CourseDetailProps {
  course: Course;
}

function formatRule(rule: PrereqRule): string {
  const courses = rule.courses?.join(` ${rule.logic} `) ?? "";
  if (rule.rules?.length) {
    const nested = rule.rules.map(formatRule).join(` ${rule.logic} `);
    return rule.type === "completedAnyOf" ? `(${nested})` : nested;
  }
  return courses;
}

function formatPrereq(course: Course): string {
  if (course.prerequisites?.length) {
    return course.prerequisites.map(formatRule).join("; ");
  }
  const text = course.prereqText;
  if (!text?.trim()) return "None listed in this dataset.";
  if (text.trim().startsWith("{")) return "See catalog for full prerequisite rules.";
  return text;
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
      <h2 className="border-b border-[var(--border)] pb-2 font-mono text-sm font-bold uppercase tracking-wide text-[var(--muted)]">
        {title}
      </h2>
      <div className="pt-4">{children}</div>
    </section>
  );
}

export function CourseDetail({ course }: CourseDetailProps) {
  const { isCompleted, toggleCompleted } = useCompletedCourses();
  const completed = isCompleted(course.courseId);
  const when = course.whenTaught?.filter(Boolean) ?? [];

  return (
    <div className="space-y-6">
      <div
        className={`overflow-hidden rounded-2xl border shadow-sm ${
          completed
            ? "border-[var(--success-border)] bg-[var(--success-surface)]"
            : "border-[var(--border)] bg-[var(--surface)]"
        }`}
      >
        <div className="border-b border-[var(--border)] bg-gradient-to-br from-[#eff6ff] to-white px-5 py-6 sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="font-mono text-sm font-semibold text-[var(--accent)]">
                {course.department}
              </p>
              <h1 className="mt-1 font-mono text-2xl font-bold tracking-tight text-[var(--text)] sm:text-3xl">
                {course.code}
              </h1>
              <p
                className={`mt-2 text-lg font-medium leading-snug sm:text-xl ${
                  completed ? "text-[var(--muted)] line-through" : "text-[var(--text)]"
                }`}
              >
                {course.title}
              </p>
              <dl className="mt-4 flex flex-wrap gap-3">
                <div className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-white px-3 py-2">
                  <dt className="sr-only">Credits</dt>
                  <dd className="font-mono text-sm">
                    <span className="text-[var(--muted)]">Credits</span>{" "}
                    <span className="font-bold text-[var(--text)]">
                      {course.credits ?? "—"}
                    </span>
                  </dd>
                </div>
                {when.length > 0 ? (
                  <div className="flex flex-wrap items-center gap-2 rounded-xl border border-[var(--border)] bg-white px-3 py-2">
                    <dt className="sr-only">When taught</dt>
                    <dd className="flex flex-wrap gap-1.5">
                      {when.map((t) => (
                        <span
                          key={t}
                          className="rounded-md bg-[var(--chip)] px-2 py-0.5 text-xs font-medium text-[var(--chip-text)]"
                        >
                          {t}
                        </span>
                      ))}
                    </dd>
                  </div>
                ) : null}
              </dl>
            </div>
            <button
              type="button"
              onClick={() => toggleCompleted(course.courseId)}
              className={`shrink-0 rounded-xl border px-4 py-3 text-sm font-semibold shadow-sm transition-colors ${
                completed
                  ? "border-[var(--success)] bg-white text-[var(--success)]"
                  : "border-[var(--border)] bg-white text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
              }`}
            >
              {completed ? "Completed — click to undo" : "Mark as completed"}
            </button>
          </div>
        </div>
      </div>

      <Section title="Description">
        <p className="text-sm leading-relaxed text-[var(--text)]">
          {course.description?.trim()
            ? course.description
            : "No description available."}
        </p>
      </Section>

      <Section title="Prerequisites">
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--text)]">
          {formatPrereq(course)}
        </p>
      </Section>

      {course.coreqText?.trim() ? (
        <Section title="Corequisites">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--text)]">
            {course.coreqText}
          </p>
        </Section>
      ) : null}

      {course.expectedLearningOutcomes?.length > 0 ? (
        <Section title="Expected learning outcomes">
          <ul className="space-y-4">
            {course.expectedLearningOutcomes.map((lo, i) => (
              <li
                key={i}
                className="border-l-4 border-[var(--accent)] pl-4 text-sm leading-relaxed"
              >
                <span className="font-semibold text-[var(--text)]">
                  {lo.name}
                </span>
                <p className="mt-1 text-[var(--muted)]">
                  {lo.objective?.replace(/&nbsp;/g, " ").slice(0, 500)}
                  {(lo.objective?.length ?? 0) > 500 ? "…" : ""}
                </p>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {course.notes?.trim() ? (
        <Section title="Notes">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--text)]">
            {course.notes}
          </p>
        </Section>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <a
          href={course.catalogUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[var(--accent-hover)]"
        >
          Open in BYU Catalog
          <span aria-hidden>↗</span>
        </a>
      </div>
    </div>
  );
}
