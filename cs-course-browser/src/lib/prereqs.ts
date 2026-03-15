/**
 * Parse prerequisite data from course prereqText or new prerequisites array.
 * Supports both the new structure (prerequisites array with course codes)
 * and the legacy prereqText JSON format.
 */
import type { Course, PrereqRule } from "@/types/course";

/** Extract all course codes/IDs from a prerequisite rule (recursively) */
function extractFromRule(rule: PrereqRule): string[] {
  const ids: string[] = [];
  if (Array.isArray(rule.courses)) {
    ids.push(...rule.courses);
  }
  if (Array.isArray(rule.rules)) {
    for (const r of rule.rules) {
      ids.push(...extractFromRule(r));
    }
  }
  return ids;
}

/** Get prerequisite course codes/IDs from the new prerequisites array */
function getPrereqCourseIdsFromArray(prerequisites: PrereqRule[] | undefined): string[] {
  if (!prerequisites?.length) return [];
  const ids: string[] = [];
  for (const rule of prerequisites) {
    ids.push(...extractFromRule(rule));
  }
  return [...new Set(ids)];
}

/** Parse prereqText JSON (legacy format) - extract course IDs */
function extractCourseIdsFromLegacy(obj: unknown): string[] {
  const ids: string[] = [];
  if (!obj || typeof obj !== "object") return ids;

  const o = obj as Record<string, unknown>;

  if (o.condition === "courses" && Array.isArray(o.values)) {
    for (const v of o.values) {
      if (typeof v === "object" && v !== null && "value" in v) {
        const val = (v as { value: unknown }).value;
        if (Array.isArray(val))
          ids.push(...val.filter((x): x is string => typeof x === "string"));
      }
    }
  }

  if (Array.isArray(o.subRules)) {
    for (const r of o.subRules) ids.push(...extractCourseIdsFromLegacy(r));
  }
  if (o.value && typeof o.value === "object") ids.push(...extractCourseIdsFromLegacy(o.value));
  if (Array.isArray(o.rules)) {
    for (const r of o.rules) ids.push(...extractCourseIdsFromLegacy(r));
  }

  return [...new Set(ids)];
}

function getPrereqCourseIdsFromText(prereqText: string): string[] {
  if (!prereqText?.trim() || !prereqText.trim().startsWith("{")) return [];
  try {
    const parsed = JSON.parse(prereqText) as { requisitesSimple?: unknown[] };
    const ids: string[] = [];
    for (const req of parsed.requisitesSimple ?? []) {
      ids.push(...extractCourseIdsFromLegacy(req));
    }
    return [...new Set(ids)];
  } catch {
    return [];
  }
}

/** Build courseId -> Course and code -> Course lookups */
export function buildCourseByIdMap(courses: Course[]): Map<string, Course> {
  const map = new Map<string, Course>();
  for (const c of courses) map.set(c.courseId, c);
  return map;
}

export function buildCourseByCodeMap(courses: Course[]): Map<string, Course> {
  const map = new Map<string, Course>();
  for (const c of courses) map.set(c.code, c);
  return map;
}

/** Get prerequisite courses (from our dataset) for a given course */
export function getPrereqCourses(
  course: Course,
  byId: Map<string, Course>,
  byCode: Map<string, Course>
): Course[] {
  let ids: string[] = [];

  if (course.prerequisites?.length) {
    ids = getPrereqCourseIdsFromArray(course.prerequisites);
  } else {
    ids = getPrereqCourseIdsFromText(course.prereqText);
  }

  const result: Course[] = [];
  for (const id of ids) {
    const c = byId.get(id) ?? byCode.get(id);
    if (c) result.push(c);
  }
  return result;
}
