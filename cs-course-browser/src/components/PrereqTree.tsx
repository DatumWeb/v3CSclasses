/**
 * Prerequisite tree visualization.
 * Shows what courses you need to complete before taking another.
 * Completed courses show with checkmark and strikethrough.
 */
"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useCompletedCourses } from "@/context/CompletedCoursesContext";
import {
  getPrereqCourses,
  buildCourseByIdMap,
  buildCourseByCodeMap,
} from "@/lib/prereqs";
import type { Course } from "@/types/course";

interface PrereqTreeProps {
  courses: Course[];
  /** If set, show tree rooted at this course (prereqs below). Otherwise show full forest. */
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

function TreeNodeView({
  node,
  depth,
}: {
  node: TreeNode;
  depth: number;
}) {
  const { isCompleted, toggleCompleted } = useCompletedCourses();
  const completed = isCompleted(node.course.courseId);

  return (
    <div className="ml-4 border-l-2 border-gray-300 pl-3">
      <div
        className={`flex items-start gap-2 border p-2 ${
          completed ? "border-green-600 bg-green-50" : "border-gray-400 bg-white"
        } hover:bg-gray-50`}
      >
        <button
          type="button"
          onClick={() => toggleCompleted(node.course.courseId)}
          className="shrink-0 rounded border border-gray-400 bg-white px-2 py-0.5 text-sm hover:bg-gray-100"
          title={completed ? "Mark as not completed" : "Mark as completed"}
        >
          {completed ? "✓" : "○"}
        </button>
        <Link
          href={`/course/${encodeURIComponent(node.course.code)}`}
          className="min-w-0 flex-1"
        >
          <span className="font-mono font-bold">{node.course.code}</span>
          <span
            className={`ml-2 text-sm ${
              completed ? "line-through text-gray-500" : ""
            }`}
          >
            {node.course.title}
          </span>
          {completed && (
            <span className="ml-2 text-xs text-green-600">(completed)</span>
          )}
        </Link>
      </div>
      {node.children.length > 0 && (
        <div className="mt-2 space-y-2">
          <div className="text-xs text-gray-500">prerequisites:</div>
          {node.children.map((child) => (
            <TreeNodeView key={child.course.courseId} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
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
    const rootsList = courses.filter((c) => getPrereqCourses(c, byId, byCode).length === 0);
    rootsList.sort((a, b) => a.code.localeCompare(b.code));
    const visited = new Set<string>();
    return rootsList.map((c) => buildTree(c, byId, byCode, visited));
  }, [courses, byId, byCode, rootCourse]);

  return (
    <div className="space-y-4">
      {roots.map((node) => (
        <TreeNodeView key={node.course.courseId} node={node} depth={0} />
      ))}
    </div>
  );
}
