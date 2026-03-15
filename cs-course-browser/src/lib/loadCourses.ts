/**
 * Load course data at runtime from the project root cs-courses.json.
 * This is the file the scraper writes to — updates appear on refresh, no rebuild needed.
 */
import fs from "fs";
import path from "path";
import type { Course } from "@/types/course";

const ROOT_JSON = path.join(process.cwd(), "..", "cs-courses.json");
const APP_JSON = path.join(process.cwd(), "src", "data", "cs-courses.json");

export function loadCourses(): Course[] {
  for (const p of [ROOT_JSON, APP_JSON]) {
    try {
      const raw = fs.readFileSync(p, "utf-8");
      return JSON.parse(raw) as Course[];
    } catch {
      continue;
    }
  }
  return [];
}
