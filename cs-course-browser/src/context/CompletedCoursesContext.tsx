/**
 * Tracks which courses the user has marked as completed.
 * Persists to localStorage. Cascades through prereq tree and "can take" filters.
 */
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const STORAGE_KEY = "cs-completed-courses";

function loadFromStorage(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as string[];
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

function saveToStorage(ids: Set<string>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
  } catch {
    // ignore
  }
}

interface CompletedCoursesContextValue {
  completedIds: Set<string>;
  isCompleted: (courseId: string) => boolean;
  toggleCompleted: (courseId: string) => void;
}

const CompletedCoursesContext = createContext<CompletedCoursesContextValue | null>(null);

export function CompletedCoursesProvider({ children }: { children: React.ReactNode }) {
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setCompletedIds(loadFromStorage());
  }, []);

  useEffect(() => {
    saveToStorage(completedIds);
  }, [completedIds]);

  const isCompleted = useCallback(
    (courseId: string) => completedIds.has(courseId),
    [completedIds]
  );

  const toggleCompleted = useCallback((courseId: string) => {
    setCompletedIds((prev) => {
      const next = new Set(prev);
      if (next.has(courseId)) next.delete(courseId);
      else next.add(courseId);
      return next;
    });
  }, []);

  return (
    <CompletedCoursesContext.Provider
      value={{ completedIds, isCompleted, toggleCompleted }}
    >
      {children}
    </CompletedCoursesContext.Provider>
  );
}

export function useCompletedCourses() {
  const ctx = useContext(CompletedCoursesContext);
  if (!ctx) throw new Error("useCompletedCourses must be used within CompletedCoursesProvider");
  return ctx;
}
