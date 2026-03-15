/**
 * Client component for the prerequisite tree view.
 */
"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ChangeView } from "@/components/ChangeView";
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
    <div className="min-h-screen border-t-4 border-gray-800 bg-white p-4">
      <header className="mb-6 border-b border-gray-400 pb-4">
        <div className="flex justify-center py-4">
          <ChangeView currentView="tree" />
        </div>
        <h1 className="font-mono text-2xl font-bold">
          Prerequisite Tree
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          See what you need to complete before taking a course. Select a course to
          focus on its prerequisite chain, or browse all entry points below.
        </p>
        <div className="mt-4">
          <CourseSelector
            courses={courses}
            value={selected}
            onChange={setSelected}
            placeholder="Optional: select a course to focus on…"
          />
        </div>
      </header>
      <main className="max-w-2xl">
        {selected ? (
          <div>
            <h2 className="mb-2 font-mono font-bold">
              Prerequisites for {selected.code}
            </h2>
            <PrereqTree courses={courses} rootCourse={selected} />
          </div>
        ) : (
          <div>
            <h2 className="mb-2 font-mono font-bold">
              Entry points (no prerequisites)
            </h2>
            <p className="mb-4 text-sm text-gray-600">
              Courses you can take first. Expand to see what leads where.
            </p>
            <PrereqTree courses={courses} rootCourse={null} />
          </div>
        )}
      </main>
    </div>
  );
}
