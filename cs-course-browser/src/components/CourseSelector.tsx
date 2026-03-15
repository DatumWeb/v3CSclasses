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
    <select
      value={value?.code ?? ""}
      onChange={(e) => {
        const code = e.target.value;
        const c = courses.find((x) => x.code === code) ?? null;
        onChange(c);
      }}
      className="w-full max-w-md border border-gray-400 p-2 font-mono text-sm"
    >
      <option value="">{placeholder}</option>
      {sorted.map((c) => (
        <option key={c.courseId} value={c.code}>
          {c.code} — {c.title}
        </option>
      ))}
    </select>
  );
}
