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

export function generateStaticParams() {
  const courses = loadCourses();
  return courses.map((c) => ({ code: c.code }));
}

export default async function CoursePage({ params }: PageProps) {
  const { code } = await params;
  const decoded = decodeURIComponent(code);
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
