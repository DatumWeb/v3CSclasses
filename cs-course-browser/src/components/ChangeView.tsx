/**
 * View switcher: List ↔ Tree.
 * Renders as a segmented control showing current view and switch target.
 */
import Link from "next/link";

interface ChangeViewProps {
  currentView: "list" | "tree";
  /** When on course detail, pass to pre-select in tree */
  courseCode?: string;
}

export function ChangeView({ currentView, courseCode }: ChangeViewProps) {
  const treeHref = courseCode
    ? `/tree?course=${encodeURIComponent(courseCode)}`
    : "/tree";

  return (
    <div
      className="inline-flex rounded-full border-2 border-gray-500 p-1.5"
      role="group"
      aria-label="Change view"
    >
      {currentView === "list" ? (
        <>
          <span className="rounded-full bg-gray-800 px-5 py-2 text-base font-medium text-white">
            List
          </span>
          <Link
            href={treeHref}
            className="rounded-full px-5 py-2 text-base font-medium text-gray-700 transition-colors hover:bg-gray-100"
          >
            Tree
          </Link>
        </>
      ) : (
        <>
          <Link
            href="/"
            className="rounded-full px-5 py-2 text-base font-medium text-gray-700 transition-colors hover:bg-gray-100"
          >
            List
          </Link>
          <span className="rounded-full bg-gray-800 px-5 py-2 text-base font-medium text-white">
            Tree
          </span>
        </>
      )}
    </div>
  );
}
