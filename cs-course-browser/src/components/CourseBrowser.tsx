/**
 * Client component: search + hierarchy-based course list.
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

  const resultCount = useMemo(() => {
    let n = 0;
    for (const [, list] of byCategory) n += list.length;
    return n;
  }, [byCategory]);

  return (
    <div className="space-y-8">
      <SearchFilter value={search} onChange={setSearch} />

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-[var(--text)]">
              Organize by
            </p>
            <p className="text-xs text-[var(--muted)]">
              Tap a category set, then scroll sections below.
            </p>
          </div>
          <p className="font-mono text-xs text-[var(--muted)]">
            {resultCount} course{resultCount === 1 ? "" : "s"} shown
          </p>
        </div>
        <div
          className="mt-4 flex flex-wrap gap-2"
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
              className={`rounded-full border px-3.5 py-2 text-left text-sm font-medium transition-[background,border-color,box-shadow] ${
                filterIndex === i
                  ? "border-[var(--accent)] bg-[#eff6ff] text-[var(--accent-hover)] shadow-sm"
                  : "border-[var(--border)] bg-[var(--surface-muted)] text-[var(--text)] hover:border-[var(--muted)]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {isCanTakeMode && (
        <div className="rounded-2xl border border-[var(--success-border)] bg-[var(--success-surface)] px-4 py-3 text-sm text-[var(--success)]">
          <strong className="font-semibold">Planning mode:</strong> showing
          courses whose prerequisites (in this dataset) are all marked
          completed. Add more completions to unlock additional courses.
        </div>
      )}

      <div>
        {byCategory.size === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface-muted)]/80 px-6 py-12 text-center">
            <p className="text-sm font-medium text-[var(--text)]">
              {isCanTakeMode
                ? "Nothing here yet"
                : "No courses match your search"}
            </p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              {isCanTakeMode
                ? "Mark prerequisites as completed on course cards or detail pages to see what opens up."
                : "Try a shorter search term or clear the box to see everything."}
            </p>
          </div>
        ) : (
          Array.from(byCategory.entries()).map(([label, list], i) => (
            <CategorySection
              key={label}
              label={label}
              courses={list}
              accentIndex={i}
            />
          ))
        )}
      </div>
    </div>
  );
}
