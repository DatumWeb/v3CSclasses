/**
 * Renders a category (primary or subcategory) with its courses.
 * Collapsible: click the header to expand/collapse.
 */
"use client";

import { useState } from "react";
import { CourseCard } from "./CourseCard";
import type { Course } from "@/types/course";

interface CategorySectionProps {
  label: string;
  courses: Course[];
}

export function CategorySection({ label, courses }: CategorySectionProps) {
  const [expanded, setExpanded] = useState(true);

  if (courses.length === 0) return null;

  return (
    <section className="mb-6">
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="mb-2 flex w-full items-center gap-2 border-b-2 border-gray-500 pb-1 text-left font-mono text-lg font-bold hover:bg-gray-50"
      >
        <span
          className="inline-block transition-transform"
          aria-hidden
        >
          {expanded ? "▼" : "▶"}
        </span>
        {label}
        <span className="text-sm font-normal text-gray-500">
          ({courses.length})
        </span>
      </button>
      {expanded && (
        <div className="space-y-2">
          {courses.map((c) => (
            <CourseCard key={c.courseId} course={c} />
          ))}
        </div>
      )}
    </section>
  );
}
