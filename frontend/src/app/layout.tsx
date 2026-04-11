// frontend/src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { AuthProvider } from "@/context/auth-context";
import { ThemeProvider } from "@/context/theme-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Medicare Nepal - AI-Powered Healthcare Platform",
  description: "Your complete healthcare companion in Nepal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className}`}>
        <Suspense fallback={<p>loading...</p>}>
          <ThemeProvider>
            <AuthProvider>
              {/* Background effects that adapt to theme */}
              <div className="fixed inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-black -z-20 transition-colors duration-500" />
              <div className="fixed inset-0 bg-grid-white/[0.02] bg-grid -z-10" />
              <div className="fixed inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 dark:from-blue-500/10 dark:via-transparent dark:to-purple-500/10 -z-10 animate-gradient-shift" />
              {children}
            </AuthProvider>
          </ThemeProvider>
        </Suspense>
      </body>
    </html>
  );
}