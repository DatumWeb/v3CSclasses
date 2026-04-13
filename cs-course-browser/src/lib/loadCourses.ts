/**
 * Load course data from cs-courses.json (filesystem when available, else bundled copy).
 * Filesystem paths support the scraper writing to the repo root during dev; the bundled
 * fallback ensures generateStaticParams() never returns [] when cwd differs (e.g. Turbopack
 * picking a monorepo root), which breaks /course/[code] under output: "export".
 */
import fs from "fs";
import path from "path";
import type { Course } from "@/types/course";
import bundledCourses from "@/data/cs-courses.json";

function candidatePaths(): string[] {
  const cwd = process.cwd();
  return [
    path.join(cwd, "src", "data", "cs-courses.json"),
    path.join(cwd, "..", "cs-courses.json"),
    path.join(cwd, "cs-course-browser", "src", "data", "cs-courses.json"),
    path.join(cwd, "cs-course-browser", "..", "cs-courses.json"),
  ];
}

export function loadCourses(): Course[] {
  for (const p of candidatePaths()) {
    try {
      const raw = fs.readFileSync(p, "utf-8");
      return JSON.parse(raw) as Course[];
    } catch {
      continue;
    }
  }
  return bundledCourses as Course[];
}
