/**
 * CS Class / Course Info object
 * Use this interface to swap out data sources and display logic.
 * Keeps course representation consistent across the app.
 */
export interface LearningOutcome {
  name: string;
  objective: string;
}

/** Prerequisite rule: completedAllOf/completedAnyOf with a list of courses */
export interface PrereqRule {
  type: "completedAllOf" | "completedAnyOf";
  logic: "and" | "or";
  courses: string[];
  /** Optional nested rules (e.g. anyOf containing multiple allOf) */
  rules?: PrereqRule[];
}

export interface Course {
  subject: string;
  number: string;
  title: string;
  code: string;
  credits: number | null;
  college: string;
  department: string;
  description: string;
  whenTaught: string[];
  /** New structure: array of prerequisite rules with course codes/IDs */
  prerequisites?: PrereqRule[];
  corequisites?: PrereqRule[];
  prereqText: string;
  coreqText: string;
  repeatableForCredit: boolean;
  courseId: string;
  catalogUrl: string;
  expectedLearningOutcomes: LearningOutcome[];
  notes: string;
}
