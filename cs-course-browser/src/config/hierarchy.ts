/**
 * Hierarchy configuration for organizing CS courses.
 * Change this file to reorganize categories without touching components.
 * Multiple category sets for different ways to find your next class.
 */

import type { Course } from "@/types/course";

export interface CategoryRule {
  /** Label shown in the UI */
  label: string;
  /** Function that returns true if a course belongs in this category */
  matches: (course: Course) => boolean;
}

export interface CategorySet {
  /** Label for the filter dropdown */
  label: string;
  categories: CategoryRule[];
}

/** By course level (100, 200, 300, etc.) */
export const LEVEL_CATEGORIES: CategorySet = {
  label: "By level",
  categories: [
    { label: "100-level", matches: (c) => parseInt(c.number, 10) >= 100 && parseInt(c.number, 10) < 200 },
    { label: "200-level", matches: (c) => parseInt(c.number, 10) >= 200 && parseInt(c.number, 10) < 300 },
    { label: "300-level", matches: (c) => parseInt(c.number, 10) >= 300 && parseInt(c.number, 10) < 400 },
    { label: "400-level", matches: (c) => parseInt(c.number, 10) >= 400 && parseInt(c.number, 10) < 500 },
    { label: "500-level (Graduate)", matches: (c) => parseInt(c.number, 10) >= 500 },
  ],
};

/** By topic/area — helps students find classes by interest */
export const TOPIC_CATEGORIES: CategorySet = {
  label: "By topic",
  categories: [
    {
      label: "Intro & foundations",
      matches: (c) => ["110", "142", "180", "235", "236"].includes(c.number),
    },
    {
      label: "Algorithms & theory",
      matches: (c) => ["252", "312", "412", "486", "944"].includes(c.number) ||
        c.title.toLowerCase().includes("algorithm") ||
        c.title.toLowerCase().includes("theory") ||
        c.title.toLowerCase().includes("optimization") ||
        c.title.toLowerCase().includes("verification"),
    },
    {
      label: "Software engineering",
      matches: (c) => {
        const n = c.number;
        return ["240", "329", "340", "428", "474"].includes(n) ||
          (parseInt(n, 10) >= 480 && parseInt(n, 10) <= 483) ||
          (parseInt(n, 10) >= 1608 && parseInt(n, 10) <= 1693) ||
          (parseInt(n, 10) >= 1734 && parseInt(n, 10) <= 1760) ||
          c.title.toLowerCase().includes("software");
      },
    },
    {
      label: "AI & machine learning",
      matches: (c) => ["470", "472", "474", "1583"].includes(c.number) ||
        c.title.toLowerCase().includes("artificial intelligence") ||
        c.title.toLowerCase().includes("machine learning") ||
        c.title.toLowerCase().includes("deep learning"),
    },
    {
      label: "Systems & networking",
      matches: (c) => ["224", "324", "345", "460", "1384"].includes(c.number) ||
        c.title.toLowerCase().includes("operating system") ||
        c.title.toLowerCase().includes("networking") ||
        c.title.toLowerCase().includes("systems programming"),
    },
    {
      label: "Web & mobile",
      matches: (c) => ["260", "515", "1904"].includes(c.number) ||
        c.title.toLowerCase().includes("web") ||
        c.title.toLowerCase().includes("mobile") ||
        c.title.toLowerCase().includes("human-computer"),
    },
    {
      label: "Graphics & vision",
      matches: (c) => ["455", "490", "1240"].includes(c.number) ||
        c.title.toLowerCase().includes("graphics") ||
        c.title.toLowerCase().includes("vision") ||
        c.title.toLowerCase().includes("image processing"),
    },
    {
      label: "Data & databases",
      matches: (c) => ["452", "453", "1855"].includes(c.number) ||
        c.title.toLowerCase().includes("database") ||
        c.title.toLowerCase().includes("data science") ||
        c.title.toLowerCase().includes("information retrieval"),
    },
    {
      label: "Security & ethics",
      matches: (c) => ["465", "404"].includes(c.number) ||
        c.title.toLowerCase().includes("security") ||
        c.title.toLowerCase().includes("ethics"),
    },
    {
      label: "Internships & research",
      matches: (c) => c.number.includes("R") && ["199", "201", "301", "401", "493", "494", "495", "497", "498", "477"].some((x) => c.number.startsWith(x)),
    },
    {
      label: "Capstone & projects",
      matches: (c) => ["1417", "1442", "1785", "1810", "1289", "1467"].includes(c.number) ||
        c.title.toLowerCase().includes("capstone") ||
        c.title.toLowerCase().includes("special project") ||
        c.title.toLowerCase().includes("undergraduate research"),
    },
    {
      label: "Professional & career",
      matches: (c) => ["404", "356", "393", "405", "1835"].includes(c.number) ||
        c.title.toLowerCase().includes("career") ||
        c.title.toLowerCase().includes("business") ||
        c.title.toLowerCase().includes("job search"),
    },
    {
      label: "Other / topics",
      matches: (c) => ["501R", "401R", "301R", "858", "1314", "1014"].includes(c.number) ||
        c.title.toLowerCase().includes("topics in"),
    },
  ],
};

/** By when taught — helps with scheduling */
export const WHEN_TAUGHT_CATEGORIES: CategorySet = {
  label: "By semester",
  categories: [
    {
      label: "Fall",
      matches: (c) => c.whenTaught?.some((t) => t.toLowerCase().includes("fall")) ?? false,
    },
    {
      label: "Winter",
      matches: (c) => c.whenTaught?.some((t) => t.toLowerCase().includes("winter")) ?? false,
    },
    {
      label: "Spring",
      matches: (c) => c.whenTaught?.some((t) => t.toLowerCase().includes("spring")) ?? false,
    },
    {
      label: "Summer",
      matches: (c) => c.whenTaught?.some((t) => t.toLowerCase().includes("summer")) ?? false,
    },
    {
      label: "All semesters",
      matches: (c) => c.whenTaught?.some((t) => t.toLowerCase().includes("all")) ?? false,
    },
    {
      label: "Contact department",
      matches: (c) => c.whenTaught?.some((t) => t.toLowerCase().includes("contact")) ?? false,
    },
  ],
};

/** Entry-level: no CS prereqs in our data — "what can I take now?" */
export const ENTRY_LEVEL_CATEGORIES: CategorySet = {
  label: "Entry level (no prereqs)",
  categories: [
    {
      label: "No prerequisites",
      matches: (c) => !c.prereqText?.trim() || c.prereqText.includes("instructor") || c.prereqText.includes("algebra"),
    },
  ],
};

/** All category sets for the filter dropdown */
export const CATEGORY_SETS: CategorySet[] = [
  LEVEL_CATEGORIES,
  TOPIC_CATEGORIES,
  WHEN_TAUGHT_CATEGORIES,
  ENTRY_LEVEL_CATEGORIES,
];

/** Default for backward compatibility */
export const PRIMARY_CATEGORIES = LEVEL_CATEGORIES.categories;
