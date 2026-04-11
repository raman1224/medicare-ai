"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { motion } from "framer-motion";

export default function OAuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Get token and user from URL
        const token = searchParams.get('token');
        const userData = searchParams.get('user');
        
        if (!token || !userData) {
          const errorParam = searchParams.get('error');
          throw new Error(errorParam || 'Authentication failed');
        }

        // Decode user data
        const user = JSON.parse(decodeURIComponent(userData));
        
        // Store token and user
        localStorage.setItem('medicare_token', token);
        localStorage.setItem('medicare_user', JSON.stringify(user));
        
        // Update API token
        (api as any).token = token;
        
        // Clear URL parameters
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
        
        // Small delay for better UX
        setTimeout(() => {
          // Redirect based on role
          if (user.role === 'doctor') {
            router.push('/dashboard/doctor');
          } else {
            router.push('/dashboard');
          }
        }, 1000);
        
      } catch (err: any) {
        console.error('OAuth callback error:', err);
        setError(err.message);
        
        // Redirect to login after showing error
        setTimeout(() => {
          router.push(`/auth/login?error=${encodeURIComponent(err.message)}`);
        }, 3000);
      }
    };

    handleOAuthCallback();
  }, [router, searchParams]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-950">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8 rounded-2xl glass-card max-w-md w-full"
        >
          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">❌</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">OAuth Failed</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Redirecting to login page...</p>
          <div className="mt-6 h-1 w-full bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-red-500 animate-[progress_3s_ease-in-out]"></div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-950">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="relative">
          <div className="w-24 h-24 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full animate-pulse"></div>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-white mt-6 mb-2">
          Completing OAuth Login
        </h2>
        <p className="text-gray-400 mb-1">Authenticating with provider...</p>
        <p className="text-sm text-gray-500">Please wait while we set up your account</p>
        
        <div className="mt-8 flex justify-center gap-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </motion.div>
    </div>
  );
}