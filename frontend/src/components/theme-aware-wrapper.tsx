// frontend/src/components/theme-aware-wrapper.tsx
"use client";

import { ReactNode } from "react";
import { useTheme } from "@/context/theme-context";

interface ThemeAwareWrapperProps {
  children: ReactNode;
}

export function ThemeAwareWrapper({ children }: ThemeAwareWrapperProps) {
  const { theme } = useTheme();
  
  return (
    <div className={`theme-${theme} w-full min-h-screen`}>
      {children}
    </div>
  );
}