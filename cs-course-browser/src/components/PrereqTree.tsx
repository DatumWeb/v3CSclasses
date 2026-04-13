/**
 * Prerequisite tree visualization.
 */
"use client";

import Link from "next/link";
import { useMemo } from "react";
import { courseCodeToPathSegment } from "@/lib/coursePath";
import { useCompletedCourses } from "@/context/CompletedCoursesContext";
import {
  getPrereqCourses,
  buildCourseByIdMap,
  buildCourseByCodeMap,
} from "@/lib/prereqs";
import type { Course } from "@/types/course";

interface PrereqTreeProps {
  courses: Course[];
  rootCourse?: Course | null;
}

interface TreeNode {
  course: Course;
  children: TreeNode[];
}

function buildTree(
  course: Course,
  byId: Map<string, Course>,
  byCode: Map<string, Course>,
  visited: Set<string>
): TreeNode {
  if (visited.has(course.courseId)) return { course, children: [] };
  visited.add(course.courseId);

  const prereqs = getPrereqCourses(course, byId, byCode);
  const children = prereqs.map((p) => buildTree(p, byId, byCode, visited));

  return { course, children };
}

function TreeNodeView({ node }: { node: TreeNode }) {
  const { isCompleted, toggleCompleted } = useCompletedCourses();
  const completed = isCompleted(node.course.courseId);

  return (
    <div className="relative">
      <div className="relative pl-6 before:absolute before:left-[11px] before:top-10 before:h-[calc(100%-2rem)] before:w-px before:bg-gradient-to-b before:from-[var(--border)] before:to-transparent last:before:hidden">
        <div
          className={`rounded-2xl border transition-[box-shadow] ${
            completed
              ? "border-[var(--success-border)] bg-[var(--success-surface)] shadow-sm"
              : "border-[var(--border)] bg-[var(--surface)] shadow-sm hover:shadow-md"
          }`}
        >
          <div className="flex items-start gap-3 p-4">
            <button
              type="button"
              onClick={() => toggleCompleted(node.course.courseId)}
              className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border text-sm font-bold ${
                completed
                  ? "border-[var(--success)] bg-white text-[var(--success)]"
                  : "border-[var(--border)] bg-[var(--surface-muted)] text-[var(--muted)] hover:border-[var(--accent)]"
              }`}
              title={completed ? "Mark as not completed" : "Mark as completed"}
            >
              {completed ? "✓" : "○"}
            </button>
            <Link
              href={`/course/${courseCodeToPathSegment(node.course.code)}`}
              className="min-w-0 flex-1"
            >
              <span className="font-mono font-bold text-[var(--text)]">
                {node.course.code}
              </span>
              <span
                className={`mt-1 block text-sm ${
                  completed ? "text-[var(--muted)] line-through" : "text-[var(--text)]"
                }`}
              >
                {node.course.title}
              </span>
              {completed ? (
                <span className="mt-1 inline-block text-xs font-medium text-[var(--success)]">
                  Completed
                </span>
              ) : null}
            </Link>
          </div>
        </div>
      </div>
      {node.children.length > 0 ? (
        <div className="mt-3 space-y-3 pl-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
            Prerequisites
          </p>
          {node.children.map((child) => (
            <TreeNodeView key={child.course.courseId} node={child} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function PrereqTree({ courses, rootCourse }: PrereqTreeProps) {
  const byId = useMemo(() => buildCourseByIdMap(courses), [courses]);
  const byCode = useMemo(() => buildCourseByCodeMap(courses), [courses]);

  const roots = useMemo(() => {
    if (rootCourse) {
      const visited = new Set<string>();
      return [buildTree(rootCourse, byId, byCode, visited)];
    }
    const rootsList = courses.filter(
      (c) => getPrereqCourses(c, byId, byCode).length === 0
    );
    rootsList.sort((a, b) => a.code.localeCompare(b.code));
    const visited = new Set<string>();
    return rootsList.map((c) => buildTree(c, byId, byCode, visited));
  }, [courses, byId, byCode, rootCourse]);

  return (
    <div className="space-y-6">
      {roots.map((node) => (
        <TreeNodeView key={node.course.courseId} node={node} />
      ))}
    </div>
  );
}
