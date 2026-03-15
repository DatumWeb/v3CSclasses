/**
 * Compact course card for list views.
 * Displays key info; links to full detail. Toggle completed state.
 */
"use client";

import Link from "next/link";
import { useCompletedCourses } from "@/context/CompletedCoursesContext";
import type { Course } from "@/types/course";

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const { isCompleted, toggleCompleted } = useCompletedCourses();
  const completed = isCompleted(course.courseId);

  return (
    <div
      className={`flex items-start gap-3 border p-3 ${
        completed ? "border-green-600 bg-green-50" : "border-gray-400 bg-white"
      } hover:bg-gray-50`}
    >
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          toggleCompleted(course.courseId);
        }}
        className="mt-0.5 shrink-0 rounded border border-gray-400 bg-white px-2 py-1 text-sm hover:bg-gray-100"
        title={completed ? "Mark as not completed" : "Mark as completed"}
      >
        {completed ? "✓" : "○"}
      </button>
      <Link
        href={`/course/${encodeURIComponent(course.code)}`}
        className="min-w-0 flex-1"
      >
        <div className="font-mono font-bold">{course.code}</div>
        <div className={`text-sm ${completed ? "line-through text-gray-500" : ""}`}>
          {course.title}
        </div>
        <div className="mt-1 text-xs text-gray-600">
          {course.credits ?? "—"} cr · {course.whenTaught?.join(", ") || "—"}
        </div>
      </Link>
    </div>
  );
}
