/**
 * URL path segment for a course. Uses hyphens instead of spaces so static hosts
 * (GitHub Pages) serve real files at course/<segment>/index.html — percent-encoded
 * folder names like C%20S%20110 break direct loads and refreshes.
 */
import type { Course } from "@/types/course";

export function courseCodeToPathSegment(code: string): string {
  return code.trim().replace(/\s+/g, "-");
}

export function findCourseByPathSegment(
  courses: Course[],
  segment: string
): Course | undefined {
  const decoded = tryDecode(segment);
  return (
    courses.find((c) => courseCodeToPathSegment(c.code) === segment) ??
    courses.find((c) => c.code === decoded)
  );
}

function tryDecode(segment: string): string {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}
