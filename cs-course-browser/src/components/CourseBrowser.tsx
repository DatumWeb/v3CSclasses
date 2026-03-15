/**
 * Client component: search + hierarchy-based course list.
 * Filter by category set (level, topic, semester, entry-level) or "Courses you can take".
 */
"use client";

import { useState, useMemo } from "react";
import { SearchFilter } from "./SearchFilter";
import { CategorySection } from "./CategorySection";
import { useCompletedCourses } from "@/context/CompletedCoursesContext";
import {
  getPrereqCourses,
  buildCourseByIdMap,
  buildCourseByCodeMap,
} from "@/lib/prereqs";
import { CATEGORY_SETS, LEVEL_CATEGORIES } from "@/config/hierarchy";
import type { Course } from "@/types/course";

const CAN_TAKE_LABEL = "Courses you can take";

const FILTER_OPTIONS = [...CATEGORY_SETS.map((s) => s.label), CAN_TAKE_LABEL];

interface CourseBrowserProps {
  courses: Course[];
}

function matchesSearch(course: Course, query: string): boolean {
  if (!query.trim()) return true;
  const q = query.toLowerCase();
  return (
    course.code.toLowerCase().includes(q) ||
    course.title.toLowerCase().includes(q) ||
    course.description.toLowerCase().includes(q)
  );
}

export function CourseBrowser({ courses }: CourseBrowserProps) {
  const [search, setSearch] = useState("");
  const [filterIndex, setFilterIndex] = useState(0);
  const { completedIds } = useCompletedCourses();

  const filtered = useMemo(
    () => courses.filter((c) => matchesSearch(c, search)),
    [courses, search]
  );

  const isCanTakeMode = filterIndex === FILTER_OPTIONS.length - 1;
  const byId = useMemo(() => buildCourseByIdMap(courses), [courses]);
  const byCode = useMemo(() => buildCourseByCodeMap(courses), [courses]);

  const canTakeCourses = useMemo(() => {
    if (!isCanTakeMode) return [];
    return filtered.filter((c) => {
      const prereqs = getPrereqCourses(c, byId, byCode);
      if (prereqs.length === 0) return true;
      return prereqs.every((p) => completedIds.has(p.courseId));
    });
  }, [filtered, isCanTakeMode, byId, completedIds]);

  const byCategory = useMemo(() => {
    if (isCanTakeMode) {
      const map = new Map<string, Course[]>();
      const assigned = new Set<string>();
      for (const cat of LEVEL_CATEGORIES.categories) {
        const list = canTakeCourses.filter((c) => {
          if (assigned.has(c.courseId)) return false;
          if (cat.matches(c)) {
            assigned.add(c.courseId);
            return true;
          }
          return false;
        });
        if (list.length > 0) {
          list.sort((a, b) => a.code.localeCompare(b.code));
          map.set(cat.label, list);
        }
      }
      const other = canTakeCourses.filter((c) => !assigned.has(c.courseId));
      if (other.length > 0) {
        other.sort((a, b) => a.code.localeCompare(b.code));
        map.set("Other", other);
      }
      return map;
    }

    const categorySet = CATEGORY_SETS[filterIndex];
    const allowMultiple = categorySet.label === "By semester";
    const map = new Map<string, Course[]>();
    const assigned = new Set<string>();
    for (const cat of categorySet.categories) {
      const list = filtered.filter((c) => {
        if (!allowMultiple && assigned.has(c.courseId)) return false;
        if (cat.matches(c)) {
          if (!allowMultiple) assigned.add(c.courseId);
          return true;
        }
        return false;
      });
      if (list.length > 0) {
        list.sort((a, b) => a.code.localeCompare(b.code));
        map.set(cat.label, list);
      }
    }
    if (!allowMultiple) {
      const uncategorized = filtered.filter((c) => !assigned.has(c.courseId));
      if (uncategorized.length > 0) {
        uncategorized.sort((a, b) => a.code.localeCompare(b.code));
        map.set("Other", uncategorized);
      }
    }
    return map;
  }, [isCanTakeMode, filterIndex, filtered, canTakeCourses]);

  return (
    <div className="space-y-4">
      <SearchFilter value={search} onChange={setSearch} />
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-gray-600">Filter by:</span>
        <div
          className="inline-flex flex-wrap gap-1 rounded-full border border-gray-400 p-1"
          role="radiogroup"
          aria-label="Filter by category"
        >
          {FILTER_OPTIONS.map((label, i) => (
            <button
              key={label}
              type="button"
              role="radio"
              aria-checked={filterIndex === i}
              onClick={() => setFilterIndex(i)}
              className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                filterIndex === i
                  ? "bg-gray-800 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      {isCanTakeMode && (
        <p className="text-sm text-gray-600">
          Courses where all prerequisites (in our data) are marked completed.
        </p>
      )}
      <div>
        {byCategory.size === 0 ? (
          <p className="border border-gray-400 p-4 text-sm text-gray-600">
            {isCanTakeMode
              ? "No courses yet. Mark prerequisites as completed to see courses you can take."
              : "No courses match your search."}
          </p>
        ) : (
          Array.from(byCategory.entries()).map(([label, list]) => (
            <CategorySection key={label} label={label} courses={list} />
          ))
        )}
      </div>
    </div>
  );
}
