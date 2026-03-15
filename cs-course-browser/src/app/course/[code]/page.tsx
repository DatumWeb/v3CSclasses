/**
 * Course detail page. Displays full info for a single CS class.
 */
import Link from "next/link";

export const dynamic = "force-dynamic";
import { ChangeView } from "@/components/ChangeView";
import { CourseDetail } from "@/components/CourseDetail";
import { loadCourses } from "@/lib/loadCourses";

interface PageProps {
  params: Promise<{ code: string }>;
}

export default async function CoursePage({ params }: PageProps) {
  const { code } = await params;
  const courses = loadCourses();
  const course = courses.find(
    (c) => c.code === decodeURIComponent(code)
  );

  if (!course) {
    return (
      <div className="min-h-screen p-4">
        <p className="border border-gray-400 p-4">Course not found.</p>
        <Link
          href="/"
          className="mt-4 inline-flex rounded-full border border-gray-400 px-3 py-1.5 text-sm hover:bg-gray-100"
        >
          ← Back to list
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen border-t-4 border-gray-800 bg-white p-4">
      <header className="mb-4 border-b border-gray-400 pb-4">
        <div className="flex justify-center py-4">
          <ChangeView currentView="list" courseCode={course.code} />
        </div>
      </header>
      <main className="max-w-2xl">
        <CourseDetail course={course} />
      </main>
    </div>
  );
}
