/**
 * Client component for the prerequisite tree view.
 */
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { PrereqTree } from "@/components/PrereqTree";
import { CourseSelector } from "@/components/CourseSelector";
import type { Course } from "@/types/course";

interface TreeContentProps {
  courses: Course[];
}

export function TreeContent({ courses }: TreeContentProps) {
  const searchParams = useSearchParams();
  const courseCode = searchParams.get("course");
  const [selected, setSelected] = useState<Course | null>(null);

  useEffect(() => {
    if (courseCode) {
      const c = courses.find((x) => x.code === courseCode) ?? null;
      setSelected(c);
    }
  }, [courseCode, courses]);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader
        view="tree"
        title="Prerequisite tree"
        description="Pick a course to see its prerequisite chain, or browse entry points (courses with no prerequisites in this dataset)."
      />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
          <p className="text-sm font-medium text-[var(--text)]">
            Focus on one course
          </p>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Optional — narrows the tree to everything required before your
            selection.
          </p>
          <div className="mt-4">
            <CourseSelector
              courses={courses}
              value={selected}
              onChange={setSelected}
              placeholder="Browse all entry points…"
            />
          </div>
        </div>

        {selected ? (
          <div>
            <h2 className="mb-4 font-mono text-lg font-bold text-[var(--text)]">
              Prerequisites leading into {selected.code}
            </h2>
            <PrereqTree courses={courses} rootCourse={selected} />
          </div>
        ) : (
          <div>
            <h2 className="mb-2 font-mono text-lg font-bold text-[var(--text)]">
              Entry points
            </h2>
            <p className="mb-6 text-sm text-[var(--muted)]">
              Courses you can take first (no prerequisites in our data). Expand
              downward to follow chains.
            </p>
            <PrereqTree courses={courses} rootCourse={null} />
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
