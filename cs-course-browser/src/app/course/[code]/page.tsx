/**
 * Course detail page.
 */
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { CourseDetail } from "@/components/CourseDetail";
import { loadCourses } from "@/lib/loadCourses";

interface PageProps {
  params: Promise<{ code: string }>;
}

/**
 * Use the same encoding as <Link href={`/course/${encodeURIComponent(code)}`}>.
 * With output: "export", dev requires param values to match the URL segment;
 * decoded "C S 111" does not match "C%20S%20111".
 */
export function generateStaticParams() {
  const courses = loadCourses();
  return courses.map((c) => ({ code: encodeURIComponent(c.code) }));
}

function decodeCourseParam(param: string): string {
  try {
    return decodeURIComponent(param);
  } catch {
    return param;
  }
}

export default async function CoursePage({ params }: PageProps) {
  const { code } = await params;
  const decoded = decodeCourseParam(code);
  const courses = loadCourses();
  const course = courses.find((c) => c.code === decoded);

  if (!course) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader
        view="list"
        courseCode={course.code}
        title={course.code}
        description={course.title}
      />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <nav className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--accent)] hover:underline"
          >
            <span aria-hidden>←</span>
            Back to course list
          </Link>
        </nav>
        <CourseDetail course={course} />
      </main>
      <SiteFooter />
    </div>
  );
}
