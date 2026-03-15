/**
 * Prerequisite tree view.
 * Loads course data at runtime from project root cs-courses.json.
 */
import { Suspense } from "react";

export const dynamic = "force-dynamic";
import { loadCourses } from "@/lib/loadCourses";
import { TreeContent } from "./TreeContent";

export default function TreePage() {
  const courses = loadCourses();
  return (
    <Suspense fallback={<div className="p-4">Loading…</div>}>
      <TreeContent courses={courses} />
    </Suspense>
  );
}
