/**
 * Full course detail view.
 * Renders all available course info from the Course object.
 * Toggle completed state.
 */
"use client";

import { useCompletedCourses } from "@/context/CompletedCoursesContext";
import type { Course, PrereqRule } from "@/types/course";

interface CourseDetailProps {
  course: Course;
}

/** Format a prereq rule as "A and B" or "A or B" */
function formatRule(rule: PrereqRule): string {
  const courses = rule.courses?.join(` ${rule.logic} `) ?? "";
  if (rule.rules?.length) {
    const nested = rule.rules.map(formatRule).join(` ${rule.logic} `);
    return rule.type === "completedAnyOf" ? `(${nested})` : nested;
  }
  return courses;
}

/** Helper: show prereq text, or format new structure, or "See catalog" if raw JSON */
function formatPrereq(course: Course): string {
  if (course.prerequisites?.length) {
    return course.prerequisites.map(formatRule).join("; ");
  }
  const text = course.prereqText;
  if (!text?.trim()) return "None";
  if (text.trim().startsWith("{")) return "See catalog for prerequisites.";
  return text;
}

export function CourseDetail({ course }: CourseDetailProps) {
  const { isCompleted, toggleCompleted } = useCompletedCourses();
  const completed = isCompleted(course.courseId);

  return (
    <div
      className={`space-y-4 border p-4 ${
        completed ? "border-green-600 bg-green-50" : "border-gray-400"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-mono text-xl font-bold">{course.code}</h1>
          <div className={`text-lg ${completed ? "line-through text-gray-500" : ""}`}>
            {course.title}
          </div>
          <div className="mt-1 text-sm text-gray-600">
            {course.credits ?? "—"} credits · {course.department}
          </div>
        </div>
        <button
          type="button"
          onClick={() => toggleCompleted(course.courseId)}
          className={`shrink-0 rounded border px-3 py-2 text-sm ${
            completed
              ? "border-green-600 bg-green-100 text-green-800"
              : "border-gray-400 bg-white hover:bg-gray-100"
          }`}
        >
          {completed ? "✓ Completed" : "Mark completed"}
        </button>
      </div>

      <div>
        <h2 className="border-b border-gray-300 pb-1 text-sm font-bold">
          Description
        </h2>
        <p className="text-sm">{course.description || "—"}</p>
      </div>

      <div>
        <h2 className="border-b border-gray-300 pb-1 text-sm font-bold">
          When Taught
        </h2>
        <p className="text-sm">
          {course.whenTaught?.length ? course.whenTaught.join(", ") : "—"}
        </p>
      </div>

      <div>
        <h2 className="border-b border-gray-300 pb-1 text-sm font-bold">
          Prerequisites
        </h2>
        <p className="text-sm">{formatPrereq(course)}</p>
      </div>

      {course.coreqText?.trim() && (
        <div>
          <h2 className="border-b border-gray-300 pb-1 text-sm font-bold">
            Corequisites
          </h2>
          <p className="text-sm">{course.coreqText}</p>
        </div>
      )}

      {course.expectedLearningOutcomes?.length > 0 && (
        <div>
          <h2 className="border-b border-gray-300 pb-1 text-sm font-bold">
            Expected Learning Outcomes
          </h2>
          <ul className="list-inside list-disc space-y-2 text-sm">
            {course.expectedLearningOutcomes.map((lo, i) => (
              <li key={i}>
                <span className="font-medium">{lo.name}:</span>{" "}
                {lo.objective?.replace(/&nbsp;/g, " ").slice(0, 200)}
                {lo.objective.length > 200 ? "…" : ""}
              </li>
            ))}
          </ul>
        </div>
      )}

      {course.notes?.trim() && (
        <div>
          <h2 className="border-b border-gray-300 pb-1 text-sm font-bold">
            Notes
          </h2>
          <p className="text-sm">{course.notes}</p>
        </div>
      )}

      <div>
        <a
          href={course.catalogUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-700 underline"
        >
          View in BYU Catalog →
        </a>
      </div>
    </div>
  );
}
