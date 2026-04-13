/**
 * Prerequisite tree view.
 */
import { Suspense } from "react";
import { loadCourses } from "@/lib/loadCourses";
import { TreeContent } from "./TreeContent";

export default function TreePage() {
  const courses = loadCourses();
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center p-8 text-sm text-[var(--muted)]">
          Loading tree…
        </div>
      }
    >
      <TreeContent courses={courses} />
    </Suspense>
  );
}
