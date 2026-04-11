"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if(!isLoading && !isAuthenticated) {
            router.push("/auth/login");
        }
    }, [isAuthenticated, isLoading, router]);

    if(isLoading) {
 return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your healthcare dashboard...</p>
        </div>
      </div>
    );
  }return isAuthenticated ? <>{children}</> : null;
}


