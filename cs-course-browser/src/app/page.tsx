/**
 * BYU CS Classes — course list and filters (CS 356 IA prototype, CSV3).
 */
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { CourseBrowser } from "@/components/CourseBrowser";
import { loadCourses } from "@/lib/loadCourses";

export default function Home() {
  const courses = loadCourses();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader
        view="list"
        title="Computer Science Courses"
        description="Search and filter CS offerings, mark what you have completed, and see what you can take next. Data is unofficial—verify with the catalog."
      />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <CourseBrowser courses={courses} />
      </main>
      <SiteFooter />
    </div>
  );
}
