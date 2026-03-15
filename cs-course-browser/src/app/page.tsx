/**
 * BYU CS Classes - Information Architecture prototype
 * Bare-bones site to help students find CS class info.
 */
import { ChangeView } from "@/components/ChangeView";

export const dynamic = "force-dynamic";
import { CourseBrowser } from "@/components/CourseBrowser";
import { loadCourses } from "@/lib/loadCourses";

export default function Home() {
  const courses = loadCourses();

  return (
    <div className="min-h-screen border-t-4 border-gray-800 bg-white p-4">
      <header className="mb-6 border-b border-gray-400 pb-4">
        <div className="flex justify-center py-4">
          <ChangeView currentView="list" />
        </div>
        <h1 className="font-mono text-2xl font-bold">BYU CS Classes</h1>
        <p className="mt-1 text-sm text-gray-600">
          Find information on Computer Science courses. Use search to filter.
        </p>
      </header>
      <main className="max-w-2xl">
        <CourseBrowser courses={courses} />
      </main>
    </div>
  );
}
