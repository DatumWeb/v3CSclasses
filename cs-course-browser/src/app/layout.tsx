import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
import { CompletedCoursesProvider } from "@/context/CompletedCoursesContext";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "BYU CS Course Explorer",
    template: "%s · BYU CS Course Explorer",
  },
  description:
    "Browse BYU Computer Science courses: descriptions, prerequisites, schedules, and planning tools.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${jetbrainsMono.variable} light`}
    >
      <body className="flex min-h-screen flex-col antialiased text-[var(--text)]">
        <CompletedCoursesProvider>{children}</CompletedCoursesProvider>
      </body>
    </html>
  );
}
