import type { Metadata } from "next";
import { CompletedCoursesProvider } from "@/context/CompletedCoursesContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "BYU CS Classes",
  description: "Find information on BYU Computer Science courses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body className="bg-white text-gray-900 antialiased">
        <CompletedCoursesProvider>{children}</CompletedCoursesProvider>
      </body>
    </html>
  );
}
